import numpy as np
from sklearn.metrics import confusion_matrix, classification_report, ConfusionMatrixDisplay
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

MODEL_PATH = 'hazard_detector_mobilenetv2.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

if not os.path.exists(MODEL_PATH):
    print('Model file not found:', MODEL_PATH)
    exit(1)

print('Loading model...')
model = keras.models.load_model(MODEL_PATH)
print('Model loaded')

# Use training data with validation split since valid folder is empty
data_dir = './hazard_binary/train'
print(f'Using data from: {data_dir}')

datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
val_gen = datagen.flow_from_directory(
    data_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary',
    shuffle=False,
    subset='validation'
)

if val_gen.samples == 0:
    # Fallback: use full training set for evaluation
    print('No validation split available, using full training set...')
    datagen = ImageDataGenerator(rescale=1./255)
    val_gen = datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        shuffle=False
    )

print(f'Evaluating on {val_gen.samples} images...')
y_true = val_gen.classes
y_pred_prob = model.predict(val_gen, verbose=0)
y_pred = (y_pred_prob >= 0.5).astype(int).flatten()

class_names = list(val_gen.class_indices.keys())
labels = list(range(len(class_names)))

cm = confusion_matrix(y_true, y_pred, labels=labels)
print()
print('Confusion Matrix:')
print(cm)

print()
print('Classification Report:')
print(classification_report(y_true, y_pred, target_names=class_names, labels=labels, zero_division=0))

fig, ax = plt.subplots(figsize=(8, 6))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
disp.plot(ax=ax, cmap='Blues', values_format='d')
ax.set_title('Hazard Detection - Confusion Matrix')
plt.tight_layout()
plt.savefig('confusion_matrix.png', dpi=150)
plt.close()
print('Confusion matrix plot saved as confusion_matrix.png')
