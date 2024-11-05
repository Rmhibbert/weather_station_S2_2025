from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client, handle_file

app = FastAPI()

# Add CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows requests from this specific origin (Next.js frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    try:
        # Save the uploaded image temporarily
        image_data = await image.read()
        with open("temp_image.jpg", "wb") as f:
            f.write(image_data)

        # Connect to the Hugging Face model
        client = Client("TomMc9010/Cloud_AI_model")
        result = client.predict(
            image_path=handle_file("temp_image.jpg"),
            api_name="/predict"
        )
        
        return {"result": result}

    except Exception as e:
        return {"error": str(e)}
