# --- CORRECTED and FINAL model.py ---

import os
import json
from typing import Tuple, List
import io # Required for in-memory byte handling

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model as keras_load_model
from PIL import Image # Use the efficient Pillow library

CLASS_NAMES: List[str] = []

def load_class_names(path: str = None) -> List[str]:
    """Loads the class names from a JSON file."""
    global CLASS_NAMES
    if CLASS_NAMES:
        return CLASS_NAMES

    if path is None:
        path = os.path.join(os.path.dirname(__file__), 'class_names.json')

    with open(path, 'r', encoding='utf-8') as f:
        CLASS_NAMES = json.load(f)
    return CLASS_NAMES


def load_model(model_path: str = None) -> tf.keras.Model:
    """Load the trained Keras model."""
    base_dir = os.path.dirname(__file__)
    if model_path is None:
        model_path = os.path.join(base_dir, 'fine_tuned_model.keras') # Make sure this name matches your file

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}.")

    print(f"Loading Keras model from: {model_path}")
    model = keras_load_model(model_path)
    load_class_names()
    return model


def preprocess_image_bytes(image_bytes: bytes, model) -> tf.Tensor:
    """
    Preprocesses raw image bytes using a memory-efficient PIL-based pipeline
    that perfectly matches the training preprocessing.
    """
    _, H, W, _ = model.input_shape

    # 1. Open image from in-memory bytes using PIL
    img = Image.open(io.BytesIO(image_bytes))

    # 2. Convert to grayscale ('L' mode in PIL)
    img = img.convert('L')
    
    # 3. Resize the image. This is a fast operation in PIL.
    img = img.resize((W, H), Image.Resampling.LANCZOS)
    
    # 4. Convert the small PIL image to a NumPy array -> (224, 224)
    img_array = np.array(img)

    # 5. Convert to a TensorFlow tensor and add channel dim -> (224, 224, 1)
    img_tensor = tf.convert_to_tensor(img_array)
    img_tensor = tf.expand_dims(img_tensor, axis=-1)

    # 6. Convert 1-channel grayscale to 3-channel "pseudo-grayscale" -> (224, 224, 3)
    img_tensor = tf.image.grayscale_to_rgb(img_tensor)

    # 7. Add the batch dimension -> (1, 224, 224, 3)
    img_tensor = tf.expand_dims(img_tensor, axis=0)
    
    return img_tensor


def predict(image_bytes: bytes, model: tf.keras.Model) -> Tuple[str, float, None]:
    """Run prediction on raw image bytes."""
    
    # Preprocess the bytes using the new, correct function
    x = preprocess_image_bytes(image_bytes, model)
    
    # Get the raw predictions (logits) from the model
    preds_logits = model.predict(x)[0]
    
    # Convert logits to probabilities using softmax
    preds_softmax = tf.nn.softmax(preds_logits).numpy()
    
    # Find the winning class index and its probability
    idx = int(np.argmax(preds_softmax))
    prob = float(preds_softmax[idx])
    
    # Get the class name
    classes = load_class_names()
    label = classes[idx] if idx < len(classes) else "Unknown"
        
    return label, prob, None