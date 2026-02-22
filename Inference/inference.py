import torch
import torch.nn as nn
import json
import numpy as np
from PIL import Image, ImageChops, ImageEnhance

IMAGE_SIZE = (128, 128)

# ---------------- ELA ----------------
def convert_to_ela_image(image_path, quality=95):
    original = Image.open(image_path).convert("RGB")

    temp_path = "temp_ela.jpg"
    original.save(temp_path, "JPEG", quality=quality)

    compressed = Image.open(temp_path)
    diff = ImageChops.difference(original, compressed)

    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale = 255.0 / max_diff if max_diff != 0 else 1

    diff = ImageEnhance.Brightness(diff).enhance(scale)
    diff = diff.resize(IMAGE_SIZE)

    ela = np.array(diff, dtype=np.float32) / 255.0
    ela = torch.tensor(ela).permute(2, 0, 1).unsqueeze(0)

    return ela


# ---------------- MODEL ----------------
class DeepFakeCNN(nn.Module):
    def __init__(self):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=5),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(64, 128, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )

        self._to_linear = None
        self._get_flatten_size()

        self.classifier = nn.Sequential(
            nn.Linear(self._to_linear, 128),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(128, 2)
        )

    def _get_flatten_size(self):
        with torch.no_grad():
            x = torch.zeros(1, 3, 128, 128)
            x = self.features(x)
            self._to_linear = x.view(1, -1).shape[1]

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)


# ---------------- LOAD MODEL ----------------
def load_model(
    model_path="E:/Projects/DeepFake/Backend/Models/deepfake_cnn_2.pth",
    config_path="E:/Projects/DeepFake/Backend/Models/configuration/config_cnn_2.json"
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    with open(config_path, "r") as f:
        config = json.load(f)

    model = DeepFakeCNN().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    return model, config, device


# Prediction Function

def predict_image(image_path, model, config, device):
    ela = convert_to_ela_image(image_path).to(device)

    with torch.no_grad():
        outputs = model(ela)
        probs = torch.softmax(outputs, dim=1)
        pred = torch.argmax(probs, dim=1).item()
        confidence = probs[0, pred].item()

    label = config["class_mapping"][str(pred)]

    return label, confidence

# Run Inference

model, config, device = load_model()

label, conf = predict_image(
    "E:/Projects/DeepFake/Backend/Implementation/real-vs-fake/test/fake/0AEIDNSBKD.jpg",
    model,
    config,
    device
)

print(f"Prediction: {label} | Confidence: {conf:.3f}")
