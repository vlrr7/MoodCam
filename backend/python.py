#!/usr/bin/env python
# coding: utf-8

# In[17]:


import numpy as np
import os
import PIL
import PIL.Image
import tensorflow as tf
import pandas as pd
import pathlib


# In[18]:


data_dir = pathlib.Path('data/train/').with_suffix('')
image_count = len(list(data_dir.glob('*/*.jpg')))
print(image_count)


# In[19]:


angry = list(data_dir.glob('angry/*'))
disgust = list(data_dir.glob('disgust/*'))
fear = list(data_dir.glob('fear/*'))
happy = list(data_dir.glob('happy/*'))
neutral = list(data_dir.glob('neutral/*'))
sad = list(data_dir.glob('sad/*'))
surprise = list(data_dir.glob('surprise/*'))

PIL.Image.open(str(angry[0]))
# PIL.Image.open(str(fear[0]))


# In[20]:


batch_size = 32
img_height = 224
img_width = 224


# In[ ]:


raw_train_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=None,
  color_mode='grayscale')

raw_val_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=None,
  color_mode='grayscale')


# In[22]:


# Save class names for later use
import json

class_names = raw_train_ds.class_names
print(class_names)

with open('class_names.json', 'w') as f:
    json.dump(class_names, f)

# To load files
def load_class_names():
    with open('class_names.json', 'r') as f:
        return json.load(f)

num_classes = len(class_names)

# Example usage : predictd_class_name = class_names[predicted_index]


# In[23]:


# Normalization is made in the layers - This code is therefore useless
# normalization_layer = tf.keras.layers.Rescaling(1./255)
# normalized_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
# image_batch, labels_batch = next(iter(normalized_ds))
# first_image = image_batch[0]
# # Notice the pixel values are now in `[0,1]`.
# print(np.min(first_image), np.max(first_image))


# In[ ]:


# Optimization and preprocessing
# ImageNet needs input in three channels, because it was trained on RGB images. This is why we convert the grayscale images to RGB by repeating the single channel three times.
# Even if the images are already grayscaled in the dataset, this conversion ensures that there is three channels with the same values to prevent any noise.
def convert_grayscale_to_rgb(image, label):
    image = tf.image.grayscale_to_rgb(image)
    return image, label

# Optimization
AUTOTUNE = tf.data.AUTOTUNE
train_ds = raw_train_ds
train_ds = train_ds.shuffle(buffer_size=1000)

# Convert the whole dataset
train_ds = train_ds.map(convert_grayscale_to_rgb, num_parallel_calls=AUTOTUNE)

# Cache & Batch & Prefetch
train_ds.cache(filename='my_training_cache')
train_ds = train_ds.batch(batch_size)
train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)

val_ds = raw_val_ds.map(convert_grayscale_to_rgb, num_parallel_calls=AUTOTUNE)
val_ds = val_ds.cache()
val_ds = val_ds.batch(batch_size)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)


# In[25]:


import numpy as np

# 3. Create a dictionary to map class names to their integer index
class_indices = {name: i for i, name in enumerate(class_names)}

# 4. Count the number of images in each class directory
class_counts = {name: len(list(data_dir.joinpath(name).glob('*.jpg'))) for name in class_names}
total_samples = sum(class_counts.values())
print(f"Class counts: {class_counts}")

# 5. Calculate the class weights manually
class_weight_dict = {}
for name, count in class_counts.items():
    weight = total_samples / (num_classes * count)
    class_index = class_indices[name]
    class_weight_dict[class_index] = weight

print("Calculated Class Weight Dictionary:", class_weight_dict)


# In[26]:


# Important - Set weights as the dataset is imbalanced
# from sklearn.utils import class_weight

# train_labels = []
# for images, labels in train_ds:
#     train_labels.extend(labels.numpy())
#     print(labels.numpy())

# class_weights = class_weight.compute_class_weight(
#     class_weight = "balanced",
#     classes = np.unique(train_labels),
#     y = train_labels
# )

# class_weight_dict = dict(enumerate(class_weights))

# print("Class Weight Dictionary:", class_weight_dict)


# In[27]:


# # Ancient code for training from scratch - complete sequential without any transfer learning
# num_classes = len(train_ds.class_names)

# model = tf.keras.Sequential([
#   tf.keras.layers.Rescaling(1./255),
#   tf.keras.layers.Conv2D(32, 3, activation='relu'),
#   tf.keras.layers.MaxPooling2D(),
#   tf.keras.layers.Conv2D(32, 3, activation='relu'),
#   tf.keras.layers.MaxPooling2D(),
#   tf.keras.layers.Conv2D(32, 3, activation='relu'),
#   tf.keras.layers.MaxPooling2D(),
#   tf.keras.layers.Flatten(),
#   tf.keras.layers.Dense(128, activation='relu'),
#   tf.keras.layers.Dense(num_classes)
# ])

# model.compile(
#   optimizer='adam',
#   loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
#   metrics=['accuracy'])


# In[29]:


num_classes = len(class_names)

# Data augmentation
data_augmentation = tf.keras.Sequential([
  tf.keras.layers.RandomFlip("horizontal"),
  tf.keras.layers.RandomRotation(0.1),
  tf.keras.layers.RandomZoom(0.1),
], name="data_augmentation")


# In[30]:


# Setting up MobileNetV2 as base model
base_model = tf.keras.applications.MobileNetV2(
    input_shape = (img_width, img_height, 3), # 3 for RGB channels
    include_top = False,
    weights = "imagenet"
)

base_model.trainable = False


# In[31]:


# Creating the model
model = tf.keras.Sequential([
    tf.keras.layers.InputLayer(input_shape=(img_height, img_width, 3)), # Simple definition of input shape
    data_augmentation,
    tf.keras.layers.Rescaling(1./127.5, offset=-1), # MobileNetV2 needs inputs in the range [-1, 1]
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(num_classes, )
])

base_learning_rate = 0.0001
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=base_learning_rate),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

model.summary()


# In[32]:


# Model training
# Implement early stopping
early_stopping_callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    verbose=1,
    restore_best_weights=True
)

# Save model periodically
model_checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
    filepath='best_model.keras',
    save_weights_only=False,
    monitor='val_loss',
    mode='min',
    save_best_only=True,
)

# Training
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=50,
  class_weight=class_weight_dict,
  callbacks=[early_stopping_callback, model_checkpoint_callback]
)


# In[ ]:


sample_img_path = fear[20]
PIL.Image.open(str(sample_img_path))


# In[ ]:


img = tf.keras.utils.load_img(
    str(sample_img_path),
    target_size=(img_width, img_height),
    color_mode="grayscale"
)

# img_array = np.array(img)
img_array = tf.keras.utils.img_to_array(img)
img_array = np.expand_dims(img_array, 0)  # add batch dimension

predictions = model.predict(img_array)
score = tf.nn.softmax(predictions[0])

predicted_index = np.argmax(score)
predicted_class_name = train_ds.class_names[predicted_index]

print(
    "This image most likely belongs to {} with a {:.2f} percent confidence."
    .format(predicted_class_name, 100 * np.max(score))
)


# In[ ]:




