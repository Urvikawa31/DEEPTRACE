import torch

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("====================================")
print("PyTorch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
print("Using device:", DEVICE)
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
print("====================================")