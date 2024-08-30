# app.py

from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import torchvision.models as models
import torch.nn.functional as F

# Define the VisionTransformer model class
class VisionTransformer(nn.Module):
    def __init__(self, num_classes):
        super(VisionTransformer, self).__init__()
        self.model = models.vit_b_16(weights=None)  # Initialize without weights
        self.model.heads.head = nn.Linear(self.model.heads.head.in_features, num_classes)

    def forward(self, X):
        return self.model(X)

# Function to load the model
def load_model(model_path, num_classes):
    model = VisionTransformer(num_classes=num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()  # Set the model to evaluation mode
    return model

# Preprocess the input image
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

# Function to make a prediction
def predict(model, image_tensor, class_names):
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = F.softmax(outputs, dim=1)
        _, predicted = torch.max(outputs, 1)
        confidence = probabilities[0][predicted.item()].item()
        return class_names[predicted.item()], confidence

# Flask application
app = Flask(__name__)

# Load the model (you should upload the model to the same directory as this script)
model = load_model("Cloud AI Model/VisionTransformer_with_crop_final_model.pth", num_classes=11)
class_names = ['AC','As','Cb','Cc','Ci','Cs','Ct','Cu','Ns','Sc','St']

@app.route('/predict', methods=['POST'])
def predict_api():
    # Get the image file from the request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    image = Image.open(file.stream).convert("RGB")
    image_tensor = preprocess_image(image)
    
    predictions = []
    for _ in range(3):
        predicted_class, confidence = predict(model, image_tensor, class_names)
        predictions.append({"class": predicted_class, "confidence": confidence})
        class_names.remove(predicted_class)

    return jsonify(predictions)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
