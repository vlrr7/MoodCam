# --- CORRECTED and FINAL link.py ---

from flask import Flask, request, jsonify
from flask_cors import CORS
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

# We no longer need the OpenCV imports or the resize_image function

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

    b64_string = data['image_base64']
    try:
        # Just decode from base64 to raw bytes
        if ',' in b64_string:
            b64_string = b64_string.split(',', 1)[1]
        image_bytes = base64.b64decode(b64_string)
    except Exception as e:
        return jsonify({'error': f'Error decoding image: {str(e)}'}), 400

    try:
        # Pass the raw bytes directly to the efficient predict function
        label, prob, _ = model_ml.predict(image_bytes, model_object)
        
        resp = {'label': label, 'probability': float(prob)}
        return jsonify(resp)
    except Exception as e:
        logger.exception("Prediction error: %s", e)
        return jsonify({'error': f'Error during model prediction: {str(e)}'}), 500

# The '/analyze' endpoint is redundant with '/predict/base64',
# but if you need it, you would apply the same logic.

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)