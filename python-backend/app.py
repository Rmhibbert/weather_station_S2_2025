from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client, handle_file
import imghdr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are supported.")

    try:
        image_data = await image.read()
        file_type = imghdr.what(None, h=image_data)
        if file_type not in ["jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Invalid image format.")

        with open("temp_image.jpg", "wb") as f:
            f.write(image_data)

        client = Client("TomMc9010/Cloud_AI_model")
        result = client.predict(
            image_path=handle_file("temp_image.jpg"),
            api_name="/predict"
        )
        return {"result": result}

    except Exception as e:
        return {"error": str(e)}
