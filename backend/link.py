from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

# Import your model file
import model as model_machine_learning

app = Flask(__name__)
CORS(app)
model_object = model_machine_learning.load_model()

@app.route('/analyze', methods=['POST'])
def analyze_frame():
    # Get the JSON data sent from the React frontend
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided in the request'}), 400

    # Decode the Base64 image string
    try:
        header, encoded = data['image'].split(",", 1)
        image_data = base64.b64decode(encoded)
        
        # Convert the raw image data to a NumPy array that cv2 can use
        np_arr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400

    except Exception as e:
        return jsonify({'error': f'Error decoding image: {str(e)}'}), 400

    try:
        prediction, confidence = model_machine_learning.predict(frame, model_object)
        return jsonify({'prediction': prediction, 'confidence': float(confidence)})

    except Exception as e:
        return jsonify({'error': f'Error during model prediction: {str(e)}'}), 500


if __name__ == '__main__':
    # Run the server, accessible on your local network
    app.run(debug=True)