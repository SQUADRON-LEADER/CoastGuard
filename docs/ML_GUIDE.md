# ML Model Documentation — CoastGuard Hazard Classifier

## Overview

CoastGuard uses a **deep learning image classification pipeline** to automatically categorize uploaded coastal hazard photos. This document describes the model architecture, training process, dataset, evaluation metrics, and inference instructions.

---

## Model Architecture

### Production Model: MobileNetV2

| Property | Value |
|---|---|
| **Architecture** | MobileNetV2 (Google, 2018) |
| **Base Model** | ImageNet pretrained weights |
| **Input Size** | 224 × 224 × 3 (RGB) |
| **Output** | Softmax — 5 hazard classes |
| **Parameters** | ~3.4M (fine-tuned top layers) |
| **File** | `hazard_detector_mobilenetv2.h5` |
| **Size** | ~11 MB |
| **Inference Time** | < 200ms (CPU), < 50ms (GPU) |

### Training Model: ResNet Variant

| Property | Value |
|---|---|
| **Architecture** | Custom ResNet-based |
| **File** | `hazard_detector.h5` |
| **Size** | ~134 MB |
| **Use Case** | Reference training, experimentation |

---

## Hazard Classes

| Class ID | Label | Description |
|---|---|---|
| 0 | `cyclone` | Storm systems, high winds, dark cloud formations, debris patterns |
| 1 | `flood` | Water inundation, submerged roads, rising water levels |
| 2 | `fire` | Active flames, smoke plumes, thermal signatures |
| 3 | `oil_spill` | Dark water surface patches, iridescent sheen, slick patterns |
| 4 | `infrastructure_damage` | Collapsed buildings, broken structures, rubble |

---

## Dataset

### Composition

| Split | Images | Notes |
|---|---|---|
| Training | ~2,400 | 480 per class |
| Validation | ~600 | 120 per class |
| Total | ~3,000 | Balanced classes |

### Data Sources

- Custom photography and field documentation
- NDMA (National Disaster Management Authority) public imagery
- NASA FIRMS (Fire Information for Resource Management System) thumbnails
- NOAA coastal disaster image archives
- ISRO satellite imagery excerpts

### Preprocessing Pipeline

```python
# Standard preprocessing applied to all images
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode='nearest'
)
```

---

## Training Configuration

```python
# Transfer learning setup
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False   # Freeze base layers initially

# Custom classification head
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dropout(0.3),
    Dense(5, activation='softmax')   # 5 hazard classes
])

model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Phase 1: Train head only (10 epochs)
# Phase 2: Unfreeze top 30 base layers, fine-tune (20 epochs)
```

---

## Evaluation Results

### Accuracy

| Metric | Value |
|---|---|
| Training Accuracy | 91.3% |
| Validation Accuracy | 87.2% |
| Test Loss | 0.38 |

### Per-Class Performance

| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| cyclone | 0.89 | 0.91 | 0.90 |
| flood | 0.88 | 0.86 | 0.87 |
| fire | 0.93 | 0.95 | 0.94 |
| oil_spill | 0.84 | 0.82 | 0.83 |
| infrastructure_damage | 0.86 | 0.85 | 0.85 |
| **Macro Average** | **0.88** | **0.88** | **0.88** |

> See `confusion_matrix.png` for the full confusion matrix visualization.

---

## Running Inference

### Via Streamlit Dashboard (Recommended)

```bash
# Activate virtual environment
.venv\Scripts\activate    # Windows

# Launch dashboard
streamlit run app.py
# Opens at http://localhost:8501
```

Upload any coastal hazard image and the dashboard will display:
- Predicted hazard class
- Confidence score (%)
- Confidence bar chart for all 5 classes

### Via Python Script

```python
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load model
model = load_model('hazard_detector_mobilenetv2.h5')

CLASS_NAMES = ['cyclone', 'flood', 'fire', 'oil_spill', 'infrastructure_damage']

def predict_hazard(image_path: str) -> dict:
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    predictions = model.predict(img_array)[0]
    predicted_class = CLASS_NAMES[np.argmax(predictions)]
    confidence = float(np.max(predictions))
    
    return {
        "class": predicted_class,
        "confidence": round(confidence * 100, 2),
        "all_scores": dict(zip(CLASS_NAMES, predictions.tolist()))
    }

# Example usage
result = predict_hazard("path/to/coastal_image.jpg")
print(result)
# {"class": "cyclone", "confidence": 91.4, "all_scores": {...}}
```

### Running Model Evaluation

```bash
python evaluate_model.py
# Outputs classification report + confusion matrix PNG
```

---

## Training Your Own Model

```bash
# 1. Prepare dataset (organize images into class folders)
python prepareandpath.py

# 2. Open the Jupyter notebook
jupyter notebook Final.ipynb
# Run all cells to train and save the model

# 3. Evaluate results
python evaluate_model.py
```

---

## Known Limitations

- **Nighttime images** — accuracy drops ~15% for low-light conditions
- **Partially visible hazards** — mixed-scene images (e.g. partial flooding) may be misclassified
- **Aerial vs ground level** — model performs better on ground-level than satellite imagery
- **Oil spill detection** — most challenging class due to visual similarity with normal dark water at dusk

---

## Future Improvements

- Expand dataset to 10,000+ images with crowdsourced contributions
- Add video classification via frame sampling
- Train a multi-label model to handle scenes with multiple simultaneous hazards
- Integrate ISRO satellite imagery for larger-scale detection
- Deploy as a dedicated FastAPI inference microservice

---

*CoastGuard ML Documentation · Model v1.0 · TensorFlow/Keras · December 2024*
