import gradio as gr
from PIL import Image
import torch
import torchvision.transforms as transforms

# Virtual Try-On AI Model Integration
class VirtualTryOnModel:
    def __init__(self, model_path):
        # Load pre-trained model
        try:
            self.model = torch.load(model_path, map_location=torch.device('cpu'))
            self.model.eval()
            print("Model loaded successfully.")
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found at {model_path}. Please check the path.")

    def try_on(self, person_image_path, garment_image_path):
        # Load images
        person_image = Image.open(person_image_path).convert("RGB")
        garment_image = Image.open(garment_image_path).convert("RGB")

        # Preprocess images
        transform = transforms.Compose([
            transforms.Resize((256, 192)),  # Model input size
            transforms.ToTensor(),
        ])
        person_tensor = transform(person_image).unsqueeze(0)
        garment_tensor = transform(garment_image).unsqueeze(0)

        # Run the model
        with torch.no_grad():
            result_tensor = self.model(person_tensor, garment_tensor)

        # Convert result to image
        result_image = transforms.ToPILImage()(result_tensor.squeeze(0))
        return result_image

# Initialize the AI model
model_path = "/path/to/your/pretrained_model.pth"  # Update with your model's path
try:
    model = VirtualTryOnModel(model_path)
except FileNotFoundError as e:
    print(e)

# Function to process images
def process_images(person_image_path, garment_image_path):
    if person_image_path and garment_image_path:
        try:
            result_image = model.try_on(person_image_path, garment_image_path)
            return result_image
        except Exception as e:
            return f"Error during processing: {str(e)}"
    return "Please upload both images."

# Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# Virtual Try-On System")
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Step 1: Upload a Person Image")
            person_image = gr.Image(type="filepath", label="Upload Person Image")
            
        with gr.Column():
            gr.Markdown("### Step 2: Upload a Garment Image")
            garment_image = gr.Image(type="filepath", label="Upload Garment Image")
    
    with gr.Row():
        run_button = gr.Button("Run Try-On")
        result_output = gr.Image(label="Result")
    
    # Set up button click functionality
    run_button.click(process_images, inputs=[person_image, garment_image], outputs=result_output)

# Launch the Gradio interface
demo.launch()
