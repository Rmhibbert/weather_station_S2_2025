import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import torchvision.models as models
import torch.nn.functional as F
# Define the VisionTransformer model class (same as used in training)
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
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    image = Image.open(image_path).convert("RGB")
    return transform(image).unsqueeze(0)  # Add batch dimension



# Function to make a prediction
def predict(model, image_tensor, class_names):
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = F.softmax(outputs, dim=1)
        _, predicted = torch.max(outputs, 1)
        confidence = probabilities[0][predicted.item()].item()
        return class_names[predicted.item()], confidence

# Main function to run inference
if __name__ == "__main__":
    model_path = "Cloud AI Model/VisionTransformer_with_crop_final_model.pth"  # Replace with your model path
    image_path = "Cloud AI Model/1.jpg"  # Replace with the path to the image you want to test
    class_names = ['AC','As','Cb','Cc','Ci','Cs','Ct','Cu','Ns','Sc','St']  # Replace with your actual class names

    # Load the model
    model = load_model(model_path, num_classes=len(class_names))

    # Preprocess the image
    image_tensor = preprocess_image(image_path)

    # Make predictions
    predictions = []
    for i in range(3):
        predicted_class, confidence = predict(model, image_tensor, class_names)
        predictions.append((predicted_class, confidence))
        print(f"Prediction {i+1}: {predicted_class} (Confidence: {confidence})")

        # Remove the predicted class from class_names
        class_names.remove(predicted_class)

    print("Next 2 predictions:")
    for i in range(2):
        predicted_class, confidence = predictions[i+1]
        print(f"Prediction {i+1}: {predicted_class} (Confidence: {confidence})")
