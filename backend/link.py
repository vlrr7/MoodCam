from flask import Flask, request
import cv2
import model #file name of the model

app = Flask(__name__)
camera = cv2.VideoCapture(0)

model = model_machine_learning.load_model()
            
@app.route('/')
def index();
    return render_template('index.html')

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('jpg', frame)
            yield(b' --frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
    def video_feed():
        return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/predict', methods=['POST'])
def predict():
    success, frame = camera.read()
    if not success:
        return jsonify({'error': 'No frame provided'}), 400
    else:
        prediction = model.predict_image(frame)
        return jsonify({'prediction': prediction, 'confidence': confidence}), 200


if __name__ == '__main__':
    app.run(debug = True)