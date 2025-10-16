import tensorflow as tf
from tensorflow.keras.models import load_model

def load_model():
    model = load_model('model.h5')
    return model

def predict_image(image):
    image = tf.keras.utils.img_to_array(image)
    image = np.expand_dims(image, 0)
    prediction = model.predict(image)
    return prediction
