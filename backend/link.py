from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import logging

import model as model_ml

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("moodcam")

try:
    model_object = model_ml.load_model()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.exception("Failed to load model: %s", e)
    model_object = None


@app.get('/healthz')
def healthz():
    status = 'ok' if model_object is not None else 'model-not-loaded'
    return jsonify({'status': status})


@app.post('/predict/base64')
def predict_base64():
    if model_object is None:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.get_json(silent=True)
    if not data or 'image_base64' not in data:
        return jsonify({'error': 'Missing image_base64'}), 400

    b64 = data['image_base64']
    try:
        if ',' in b64:
            b64 = b64.split(',', 1)[1]
        image_bytes = base64.b64decode(b64)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400
    except Exception as e:
        return jsonify({'error': f'Error decoding image: {str(e)}'}), 400

    try:
        label, prob, bbox = model_ml.predict(frame, model_object)
        resp = {'label': label, 'probability': float(prob), 'face_found': bool(bbox is not None)}
        if bbox is not None:
            resp['bbox'] = [int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])]
        return jsonify(resp)
    except Exception as e:
        logger.exception("Prediction error: %s", e)
        return jsonify({'error': f'Error during model prediction: {str(e)}'}), 500


@app.post('/analyze')
def analyze_frame():
    if model_object is None:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.get_json(silent=True)
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided in the request'}), 400

    try:
        header, encoded = data['image'].split(",", 1)
        image_data = base64.b64decode(encoded)
        np_arr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400
    except Exception as e:
        return jsonify({'error': f'Error decoding image: {str(e)}'}), 400

    try:
        label, prob, _ = model_ml.predict(frame, model_object)
        return jsonify({'prediction': label, 'confidence': float(prob)})
    except Exception as e:
        return jsonify({'error': f'Error during model prediction: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)