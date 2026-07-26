import os
import zipfile
import shutil
import glob
import tensorflow as tf
import tensorflow_datasets as tfds
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.optimizers import Adam
from PIL import Image



zip_path = r"C:\Users\renu_\sih\Flood- Fire and Smoke.v4i.tfrecord (2).zip"  # ✅ Update this path if needed
extract_dir = "./hazard_dataset"

if not os.path.exists(extract_dir):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    print("✅ Extracted dataset to", extract_dir)
else:
    print("📂 Dataset already extracted at", extract_dir)


print("\n🔍 Checking dataset structure...")
for split in ["train", "valid"]:
    split_dir = os.path.join(extract_dir, split)
    if os.path.exists(split_dir):
        for cls in os.listdir(split_dir):
            cls_dir = os.path.join(split_dir, cls)
            if os.path.isdir(cls_dir):
                num_imgs = len(glob.glob(os.path.join(cls_dir, "*")))
                print(f"{split}/{cls}: {num_imgs} images")


dst_base = "./hazard_binary"
for split in ["train", "valid"]:
    os.makedirs(os.path.join(dst_base, split, "hazard"), exist_ok=True)
    os.makedirs(os.path.join(dst_base, split, "not_hazard"), exist_ok=True)

    for cls in ["fire", "flood", "smoke"]:
        src_path = os.path.join(extract_dir, split, cls)
        if os.path.exists(src_path):
            imgs = glob.glob(os.path.join(src_path, "*"))
            for img in imgs:
                shutil.copy(img, os.path.join(dst_base, split, "hazard"))

print("✅ Hazard classes merged into", dst_base)

print("\n📥 Downloading EuroSAT dataset (this may take a few minutes)...")
dataset, info = tfds.load("eurosat/rgb", split="train", with_info=True, as_supervised=True)
classes = info.features["label"].names
print("EuroSAT classes available:", classes)


not_hazard_dir = os.path.join(dst_base, "train", "not_hazard")
os.makedirs(not_hazard_dir, exist_ok=True)

i = 0
for img, label in tfds.as_numpy(dataset.take(1000)):
    img = Image.fromarray(img)
    img.save(os.path.join(not_hazard_dir, f"not_hazard_{i}.jpg"))
    i += 1

print(f"✅ Added {i} not_hazard images")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = datagen.flow_from_directory(
    "./hazard_binary/train",
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    subset="training"
)

val_gen = datagen.flow_from_directory(
    "./hazard_binary/train",
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    subset="validation"
)


print("Class indices:", train_gen.class_indices)


base_model = MobileNetV2(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights="imagenet"
)
base_model.trainable = False 
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(1, activation="sigmoid")
])

model.compile(optimizer=Adam(learning_rate=1e-4),
              loss="binary_crossentropy",
              metrics=["accuracy"])

print("\n🚀 Training started with MobileNetV2 (transfer learning)...")
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=10
)

model.save("hazard_detector_mobilenetv2.h5")
print("✅ Model trained & saved as hazard_detector_mobilenetv2.h5")

# ── Cross-Validation Matrix (Confusion Matrix + Classification Report) ────────
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

print("\n📊 Generating Cross-Validation Matrix...")

# Evaluate on validation set
val_gen.reset()
y_true = val_gen.classes
y_pred_prob = model.predict(val_gen, verbose=0)
y_pred = (y_pred_prob >= 0.5).astype(int).flatten()

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
class_names = list(val_gen.class_indices.keys())

print("\n🔢 Confusion Matrix:")
print(cm)

print("\n📋 Classification Report:")
print(classification_report(y_true, y_pred, target_names=class_names))

# Save confusion matrix plot
fig, ax = plt.subplots(figsize=(8, 6))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
disp.plot(ax=ax, cmap='Blues', values_format='d')
ax.set_title('Hazard Detection - Confusion Matrix')
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=150)
print("✅ Confusion matrix saved as confusion_matrix.png")



