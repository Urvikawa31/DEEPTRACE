# DEEPTRACE — Unmasking AI-Generated Faces with Deep Learning


## Link : https://urvikava-deeptrace.vercel.app


DEEPTRACE is an end-to-end AI-powered deepfake face detection system that combines **Error Level Analysis (ELA)** with **Convolutional Neural Networks (CNNs)** to identify AI-generated or manipulated face images. The system includes a **FastAPI backend**, **React + Vite frontend**, and **MediaPipe face-gating** for strict face validation.

---

## 🚀 Key Features

- 🧠 CNN-based deepfake classification
- 🔬 Error Level Analysis (ELA) preprocessing
- 🎥 Real-time camera face validation
- 🖼️ Upload image face-gating 
- ⚡ FastAPI high-performance backend
- 🎨 Modern React + Tailwind UI
- 🔒 Prevents non-face images (e.g., animals, objects)
- 🌐 Ready for cloud sharing (ngrok / Cloudflare)

---

## 🏗️ System Pipeline

The detection pipeline follows the architecture shown in the project diagram:

<img width="650" height="700" alt="DEEPTRACE - System Architecture" src="https://github.com/user-attachments/assets/33cdf564-d668-479e-8cc6-80c27f85e8ae" />


### Step 1: Input Image
- User uploads image OR captures from camera
- Frontend MediaPipe validates:
  - Exactly **one face**
  - Face centered
  - Face sufficiently large

❌ If invalid → alert shown  
✅ If valid → sent to backend

---

### Step 2: Error Level Analysis (ELA)
For uploaded images:

- Image is recompressed
- Difference map is computed
- Compression artifacts are amplified
- Output fed into CNN

---

### Step 3: CNN Architecture

Model structure:

- Conv2D + ReLU
- MaxPool
- Conv2D + ReLU
- MaxPool
- Conv2D + ReLU
- MaxPool
- Flatten
- Fully Connected + Dropout
- Softmax Output

Output classes:

- ✅ REAL
- ❌ FAKE

---

### Step 4: Prediction Output

API returns:

```json
{
  "prediction": "REAL",
  "confidence": 99.83
}
```

Frontend displays:

- Result badge
- Confidence bar
- Analysis message

---

## 🖥️ Tech Stack

### 🔹 Backend
- FastAPI
- PyTorch
- Pillow
- NumPy

### 🔹 Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- MediaPipe Face Detection
- Lucide Icons

---

## 📁 Project Structure

```

    DEEPTRACE/
    │
    ├── Backend/
    │   ├── FastAPI/
    │   │   └── main.py
    │   ├── Implementation/
    │   ├── Models/
    ├── Inference/
    │   │   ├── inference.py
    ├── Frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   └── Scan.tsx
    │   │   ├── services/
    │   │   │   └── deepfakeApi.ts
    │   │   └── App.tsx
    │   ├── package.json
    │   └── vite.config.ts
    │
    └── README.md

```

---

## ⚙️ How to Run Locally

### 1️⃣ Backend Setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 2️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🌐 Share Your Local App (Important)

### Option A — ngrok

```bash
ngrok http 8000
```

### Option B — Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:5173
```

---

## 🧪 Model Behavior Notes

✔ Works best on clear passport-style faces  
✔ Requires single centered face  
✔ Rejects:

- Animals
- Objects
- Multiple faces
- Blurry faces

⚠️ **Detection results may vary.**

---

## 👩‍💻 Author

**Urvi Kava**  
M.Sc. Data Science<br> 
Data Science Enthusiast | Deep Learning 

I am passionate about combining mathematics, deep learning, and forensic AI to build intelligent systems that detect digital manipulation and synthetic media.

---

## ⭐ Future Improvements

- Video deepfake detection
- Transformer-based models
- Model explainability (Grad-CAM)
- Production deployment

---

## 📜 License

Copyright (c) 2026 Urvi Kava

All rights reserved.

This project, DEEPTRACE, including its source code, models, and documentation,
is the intellectual property of Urvi Kava. Unauthorized copying, modification,
distribution, or use of this software, via any medium, is strictly prohibited
without explicit written permission from the author.

This project is provided for educational and research purposes only.
Detection results may vary depending on image quality and model limitations.

---

## 💬 Acknowledgement

If you found this project useful, consider giving it a ⭐ on GitHub!
