import os
import json
from typing import Tuple, Optional, List, Literal, Any, Dict
import logging

import numpy as np
import cv2

# Optional imports: we'll only require the framework that matches the model file
try:
    import tensorflow as tf  # type: ignore
    from tensorflow.keras.models import load_model as keras_load_model  # type: ignore
except Exception:  # pragma: no cover
    tf = None  # type: ignore
    keras_load_model = None  # type: ignore

try:
    import torch  # type: ignore
except Exception:  # pragma: no cover
    torch = None  # type: ignore

try:
    from ultralytics import YOLO  # type: ignore
except Exception:  # pragma: no cover
    YOLO = None  # type: ignore


CLASS_NAMES: Optional[List[str]] = None


def load_class_names(path: Optional[str] = None) -> List[str]:
    global CLASS_NAMES
    if CLASS_NAMES is not None:
        return CLASS_NAMES

    if path is None:
        path = os.path.join(os.path.dirname(__file__), 'class_names.json')

    with open(path, 'r', encoding='utf-8') as f:
        CLASS_NAMES = json.load(f)
    return CLASS_NAMES


ModelKind = Literal['keras', 'ultralytics']


def load_model(model_path: Optional[str] = None) -> Dict[str, Any]:
    """Load the trained model.

    Supports two formats:
      - Ultralytics .pt (recommended): moodcam_best.pt
      - Keras .h5 fallback: model.h5

    Returns a dict with keys: {'kind': ModelKind, 'model': Any}
    """
    base_dir = os.path.dirname(__file__)
    if model_path is None:
        # Preference order: Keras .keras -> Keras .h5 -> Ultralytics/TorchScript .pt
        keras_path = os.path.join(base_dir, 'fine_tuned_model.keras')
        h5_path = os.path.join(base_dir, 'model.h5')
        pt_path = os.path.join(base_dir, 'moodcam_best.pt')
        if os.path.exists(keras_path):
            model_path = keras_path
        elif os.path.exists(h5_path):
            model_path = h5_path
        else:
            model_path = pt_path

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found: {model_path}. Place your trained model at this path."
        )

    ext = os.path.splitext(model_path)[1].lower()

    # Keras SavedModel/Native (.keras)
    if ext == '.keras':
        if keras_load_model is None:
            raise RuntimeError("TensorFlow/Keras not installed. Install with `pip install tensorflow`. ")
        model = keras_load_model(model_path)
        try:
            load_class_names()
        except Exception:
            pass
        return {'kind': 'keras', 'model': model}

    # Ultralytics .pt
    if ext == '.pt':
        # First, try Ultralytics YOLO format
        if YOLO is not None:
            try:
                model = YOLO(model_path)
                # Attempt to load class names
                try:
                    names = getattr(model, 'names', None)
                    if isinstance(names, (list, dict)):
                        _ = names  # not used directly; frontend uses our class_names mapping when needed
                    load_class_names()
                except Exception:
                    pass
                return {'kind': 'ultralytics', 'model': model}
            except Exception as e:
                # If the file is not a YOLO checkpoint (KeyError: 'model'), try TorchScript
                if torch is None:
                    raise RuntimeError("Torch not installed; cannot attempt TorchScript load. Install torch.") from e
                try:
                    ts_model = torch.jit.load(model_path, map_location='cpu')
                    ts_model.eval()
                    # Ensure class names are loaded
                    try:
                        load_class_names()
                    except Exception:
                        pass
                    return {'kind': 'torchscript', 'model': ts_model}
                except Exception as e2:
                    raise RuntimeError(
                        "Failed to load .pt as Ultralytics YOLO or TorchScript.\n"
                        "- If this is a YOLO model, export/save weights with Ultralytics (yolo train/export).\n"
                        "- If this is a custom PyTorch model, export TorchScript with torch.jit.trace/script."
                    ) from e2
        else:
            # No YOLO available; try TorchScript directly
            if torch is None:
                raise RuntimeError("Torch not installed; cannot load .pt model. Install torch.")
            try:
                ts_model = torch.jit.load(model_path, map_location='cpu')
                ts_model.eval()
                try:
                    load_class_names()
                except Exception:
                    pass
                return {'kind': 'torchscript', 'model': ts_model}
            except Exception as e2:
                raise RuntimeError(
                    "Failed to load .pt as TorchScript. Export your model with torch.jit.trace or torch.jit.script."
                ) from e2

    # Keras .h5
    if keras_load_model is None:
        raise RuntimeError(
            "TensorFlow/Keras not installed. Install with `pip install tensorflow`."
        )
    model = keras_load_model(model_path)
    try:
        load_class_names()
    except Exception:
        pass
    return {'kind': 'keras', 'model': model}


def _get_env_flag(name: str, default: bool = False) -> bool:
    val = os.getenv(name, None)
    if val is None:
        return default
    return val.strip().lower() in {"1", "true", "yes", "on"}


def _get_preprocess_mode() -> str:
    # 'unit' -> [0,1] scaling (default)
    # 'mobilenet' -> scale to [-1,1]
    mode = os.getenv('PREPROCESS_MODE', 'unit').strip().lower()
    if mode not in {'unit', 'mobilenet'}:
        mode = 'unit'
    return mode


def _apply_normalization(x: np.ndarray, mode: str) -> np.ndarray:
    # x in float32 [0,1], shape (H,W,C)
    if mode == 'mobilenet':
        # MobilenetV2/EfficientNet style: [-1,1]
        return (x - 0.5) * 2.0
    return x


def _preprocess_for_keras(frame_bgr: np.ndarray, model) -> np.ndarray:
    if not hasattr(model, 'input_shape'):
        raise ValueError('Model has no input_shape; cannot infer preprocessing.')
    
    input_shape = model.input_shape
    target_size = (input_shape[2], input_shape[1]) # (width, height)

    # 1. Convert to grayscale
    gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)

    # 2. Resize the grayscale image
    resized_gray = cv2.resize(gray, target_size, interpolation=cv2.INTER_AREA)

    # 3. Prepare the image based on model's expected channels
    if input_shape[3] == 3:
        # Stack the single grayscale channel three times for a 3-channel input
        logging.debug("Model expects 3 channels, stacking grayscale image.")
        x = np.stack([resized_gray] * 3, axis=-1)
    elif input_shape[3] == 1:
        # Use the grayscale image directly, but add the channel dimension
        logging.debug("Model expects 1 channel, using grayscale image.")
        x = np.expand_dims(resized_gray, axis=-1)
    else:
        raise ValueError(f"Unsupported model input shape. Expected 1 or 3 channels, but got {input_shape[3]}")

    # 4. Normalize the image data
    x = x.astype('float32') / 255.0
    mode = _get_preprocess_mode()
    x = _apply_normalization(x, mode)
    
    # 5. Add a batch dimension
    x = np.expand_dims(x, axis=0)
    
    logging.debug(f"Final preprocessed shape: {x.shape}")
    return x


def _preprocess_for_torchscript(frame_bgr: np.ndarray, size: int = 224) -> 'torch.Tensor':
    # Lazy import torch to avoid hard dependency when using Keras
    assert torch is not None, "Torch is required for TorchScript models"
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(rgb, (size, size), interpolation=cv2.INTER_AREA)
    x = resized.astype('float32') / 255.0  # [0,1]
    # HWC -> CHW
    x = np.transpose(x, (0, 1, 2))
    x = np.transpose(x, (2, 0, 1))  # (3, H, W)
    # To tensor and add batch dim
    t = torch.from_numpy(x).unsqueeze(0)  # (1, 3, H, W)
    return t


def _detect_face_bbox(frame_bgr: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    """Detect the largest face using OpenCV Haar cascade and return (x, y, w, h)."""
    try:
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        cascade_path = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
        face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
        if len(faces) == 0:
            return None
        # Pick largest face
        x, y, w, h = max(faces, key=lambda box: box[2] * box[3])
        return int(x), int(y), int(w), int(h)
    except Exception:
        return None


def predict(frame_bgr: np.ndarray, model_bundle: Dict[str, Any]) -> Tuple[str, float, Optional[Tuple[int, int, int, int]], Optional[np.ndarray]]:
    """Run prediction on a BGR frame and return (label, probability, bbox?).

    bbox is (x,y,w,h) in pixels relative to input frame if available.
    """
    kind: ModelKind = model_bundle['kind']
    model = model_bundle['model']

    if kind == 'keras':
        # Optional face crop (default on). Disable with FACE_CROP=0 if trained on full frames.
        use_crop = _get_env_flag('FACE_CROP', True)
        bbox = _detect_face_bbox(frame_bgr) if use_crop else None
        roi = frame_bgr
        if bbox is not None:
            x0, y0, w0, h0 = bbox
            roi = frame_bgr[y0:y0+h0, x0:x0+w0]
        x = _preprocess_for_keras(roi, model)
        preds = model.predict(x)
        if isinstance(preds, (list, tuple)):
            preds = preds[0]
        preds = np.array(preds).squeeze().astype('float32')
        if preds.ndim != 1:
            raise ValueError(f'Unexpected prediction shape: {preds.shape}')
        # If outputs are not a proper probability distribution, apply softmax
        probs = preds
        if (probs.min() < 0.0) or (probs.max() > 1.0) or (abs(float(probs.sum()) - 1.0) > 0.05):
            exp = np.exp(probs - np.max(probs))
            denom = float(np.sum(exp)) or 1.0
            probs = exp / denom
        idx = int(np.argmax(probs))
        prob = float(probs[idx])
        # Clamp to [0,1] just in case
        prob = max(0.0, min(1.0, prob))
        classes = CLASS_NAMES or []
        label = classes[idx] if idx < len(classes) else str(idx)
        return label, prob, bbox, probs

    if kind == 'ultralytics':
        # Convert BGR to RGB; Ultralytics handles resizing/normalization internally
        rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        results = model.predict(source=rgb, verbose=False)
        if not results:
            raise RuntimeError('Empty prediction results')
        r0 = results[0]
        # Prefer classification path when available
        if getattr(r0, 'probs', None) is not None and r0.probs is not None:
            probs = r0.probs.data.cpu().numpy().squeeze()
            idx = int(np.argmax(probs))
            prob = float(probs[idx])
            label = None
            names = getattr(model, 'names', None)
            if isinstance(names, dict):
                label = names.get(idx)
            elif isinstance(names, list) and idx < len(names):
                label = names[idx]
            if label is None:
                classes = CLASS_NAMES or []
                label = classes[idx] if idx < len(classes) else str(idx)
            # Try to also provide a face bbox from classical detector
            bbox = _detect_face_bbox(frame_bgr)
            return label, prob, bbox, None

        # Detection path: take highest-confidence box
        boxes = getattr(r0, 'boxes', None)
        if boxes is None or boxes.cls is None or boxes.conf is None:
            raise RuntimeError('Model did not return usable outputs')
        confs = boxes.conf.cpu().numpy().squeeze()
        clses = boxes.cls.cpu().numpy().astype(int).squeeze()
        xyxy = boxes.xyxy.cpu().numpy().squeeze()
        if confs.ndim == 0:
            confs = np.array([float(confs)])
            clses = np.array([int(clses)])
            xyxy = np.array([xyxy])
        best_i = int(np.argmax(confs))
        prob = float(confs[best_i])
        idx = int(clses[best_i])
        x1, y1, x2, y2 = xyxy[best_i]
        x = max(0, int(round(x1)))
        y = max(0, int(round(y1)))
        w = max(0, int(round(x2 - x1)))
        h = max(0, int(round(y2 - y1)))
        names = getattr(model, 'names', None)
        label = None
        if isinstance(names, dict):
            label = names.get(idx)
        elif isinstance(names, list) and idx < len(names):
            label = names[idx]
        if label is None:
            classes = CLASS_NAMES or []
            label = classes[idx] if idx < len(classes) else str(idx)
    return label, prob, (x, y, w, h), None

    if kind == 'torchscript':
        # Face crop to improve classification odds when model expects a face crop
        bbox = _detect_face_bbox(frame_bgr)
        roi = frame_bgr
        if bbox is not None:
            x0, y0, w0, h0 = bbox
            roi = frame_bgr[y0:y0+h0, x0:x0+w0]
        inp = _preprocess_for_torchscript(roi, size=224)
        with torch.no_grad():
            out = model(inp)
        # Expect logits or probabilities as (1, num_classes)
        if isinstance(out, (list, tuple)):
            out = out[0]
        if hasattr(out, 'detach'):
            out = out.detach().cpu().numpy()
        arr = np.array(out).squeeze()
        if arr.ndim != 1:
            raise RuntimeError(f"Unexpected TorchScript output shape: {arr.shape}")
        idx = int(np.argmax(arr))
        # If outputs are logits, softmax is optional for argmax, but we need probability estimate
        exp = np.exp(arr - np.max(arr))
        probs = exp / np.sum(exp)
        prob = float(probs[idx])
        classes = CLASS_NAMES or []
        label = classes[idx] if idx < len(classes) else str(idx)
    return label, prob, bbox, probs

    raise ValueError(f'Unsupported model kind: {kind}')
