from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import torch
import os
import uuid
import numpy as np
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware


from Inference.inference import (
    convert_to_ela_image,
    load_model
)

app = FastAPI(title="DeepFake Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
model, config, device = load_model()

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    source: str = Form("upload")  # 👈 camera | upload
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")

    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty image file")

        with open(temp_filename, "wb") as f:
            f.write(contents)

        # Validate image
        try:
            Image.open(temp_filename).verify()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image")

        # 🔥 CONDITIONAL PREPROCESSING
        if source == "camera":
            img = Image.open(temp_filename).convert("RGB").resize((128, 128))
            img = torch.tensor(np.array(img) / 255.0, dtype=torch.float32)
            img = img.permute(2, 0, 1).unsqueeze(0).to(device)
        else:
            img = convert_to_ela_image(temp_filename).to(device)

        with torch.no_grad():
            output = model(img)
            probs = torch.softmax(output, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0, pred].item()

        return {
            "prediction": config["class_mapping"][str(pred)],
            "confidence": round(confidence * 100, 2)
        }

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
