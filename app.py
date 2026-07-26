# app.py
import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from PIL import Image
import tensorflow as tf
from tensorflow import keras


MODEL_PATH = "hazard_detector.h5"
IMG_SIZE = (224, 224)  


df = pd.read_csv("chatbot_dataset.csv")
questions = df["user_input"].tolist()
answers = df["bot_response"].tolist()

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)


@st.cache_resource
def load_model_safe(path):
    if not os.path.exists(path):
        return None
    model = keras.models.load_model(path)
    return model

model = load_model_safe(MODEL_PATH)


def preprocess_image(uploaded_file):
    img = Image.open(uploaded_file).convert("RGB").resize(IMG_SIZE)
    arr = np.array(img).astype("float32")
    arr = np.expand_dims(arr, 0)
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    return arr

def predict_image(uploaded_file):
    if model is None:
        raise FileNotFoundError("Model file not found. Place 'hazard_detector.h5' in the folder.")
    arr = preprocess_image(uploaded_file)
    prob = float(model.predict(arr, verbose=0)[0, 0])
    label = "Hazard" if prob >= 0.5 else "Not Hazard"
    return label, prob



st.set_page_config(page_title="Disaster Aid Chatbot", page_icon="🌍")
st.title("🌍 Natural Hazard Aid Chatbot")
st.write("Chat with me or upload an image to check if it’s a climatic hazard.")


if "messages" not in st.session_state:
    st.session_state["messages"] = []


for msg in st.session_state["messages"]:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Type your message here..."):
    st.session_state["messages"].append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    user_vec = vectorizer.transform([prompt])
    similarity = cosine_similarity(user_vec, X)
    best_idx = similarity.argmax()
    reply = answers[best_idx]

    st.session_state["messages"].append({"role": "assistant", "content": reply})
    with st.chat_message("assistant"):
        st.markdown(reply)

st.subheader("📸 Upload an Image for Hazard Detection")
uploaded_file = st.file_uploader("Upload an image (jpg/png/webp)", type=["jpg", "jpeg", "png", "webp"])

if uploaded_file is not None:
    file_size_kb = uploaded_file.size / 1024  

    if file_size_kb < 1:
        st.error("❌ File must be at least 1 KB.")
    elif file_size_kb > 1000 * 1024:  
        st.error("❌ File size must not exceed 1000 MB (1 GB).")
    else:
        st.image(uploaded_file, caption=f"Uploaded Image ({file_size_kb:.2f} KB)", use_container_width=True)

        if model is None:
            st.warning("⚠️ Model not found. Create or place 'hazard_detector.h5' in the folder.")
        else:
            if st.button("Analyze Image"):
                with st.spinner("Analyzing..."):
                    try:
                        label, prob = predict_image(uploaded_file)
                        st.success(f"Prediction: **{label}** (Confidence: {prob:.2f})")
                    except Exception as e:
                        st.error(f"Error during prediction: {e}")



