import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

IMG_SIZE = (224, 224)

model = keras.Sequential([
    layers.Input(shape=(224, 224, 3)),
    layers.Conv2D(16, (3,3), activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(32, (3,3), activation="relu"),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(64, activation="relu"),
    layers.Dense(1, activation="sigmoid")   
])

model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])


X_dummy = np.random.rand(20, 224, 224, 3)
y_dummy = np.random.randint(0, 2, size=(20, 1))


model.fit(X_dummy, y_dummy, epochs=2, verbose=1)

model.save("hazard_detector.h5")
print("✅ hazard_detector.h5 created successfully!")
