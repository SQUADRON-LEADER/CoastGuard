import tensorflow as tf
from tensorflow.keras import layers, models

IMG_SIZE = (224, 224)

# -------------------------
# Build a simple dummy model
# -------------------------
model = models.Sequential([
    layers.Input(shape=IMG_SIZE + (3,)),
    layers.Conv2D(16, (3,3), activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(32, (3,3), activation="relu"),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(64, activation="relu"),
    layers.Dense(1, activation="sigmoid")  # binary output (hazard vs not hazard)
])

model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

# -------------------------
# Save without training
# -------------------------
model.save("hazard_detector.h5")
print("✅ Dummy hazard_detector.h5 created successfully!")
