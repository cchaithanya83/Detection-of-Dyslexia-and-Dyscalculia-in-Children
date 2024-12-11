from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from sklearn.preprocessing import LabelEncoder
import joblib
import aiofiles
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi import  HTTPException
import assemblyai as aai
import os

# Set up the AssemblyAI API key
aai.settings.api_key = "5f8d153d9b08430aa5f45b5245b518a2"
# Load the saved model, scaler, and feature selector
knn_model = joblib.load("model/knn_model.pkl")
scaler = joblib.load("model/scaler.pkl")
selector = joblib.load("model/selector.pkl")
label_encoder = joblib.load("model/label_encoder.pkl")

# Define the FastAPI app
app = FastAPI()

# CORS setup to allow all origins
origins = ["*"]  # Allow all domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define a Pydantic model for the request body
class PredictionRequest(BaseModel):
    Reading_Speed: float
    Reading_Accuracy: float
    Math_Speed: float
    Math_Accuracy: float
    Attention_Span: float
    Memory_Score: float
    
    
# Pydantic model to define the input data structure
class AudioFile(BaseModel):
    file_url: str

# Prediction function
def predict_condition(features):
    """
    Predict the condition using the KNN model.
    """
    features = np.array(features).reshape(1, -1)  # Ensure the input is a 2D array
    selected_features = selector.transform(features)
    scaled_features = scaler.transform(selected_features)
    prediction_encoded = knn_model.predict(scaled_features)
    prediction_label = label_encoder.inverse_transform(prediction_encoded)
    return prediction_label[0]

# Define the prediction endpoint
@app.post("/predict")
async def predict(request: PredictionRequest):
    features = [
        request.Reading_Speed,
        request.Reading_Accuracy,
        request.Math_Speed,
        request.Math_Accuracy,
        request.Attention_Span,
        request.Memory_Score,
    ]
    predicted_condition = predict_condition(features)
    return {"Predicted Condition": predicted_condition}







@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    
    try:
        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Create a transcriber object
        transcriber = aai.Transcriber()

        # Attempt to transcribe the provided file
        transcript = transcriber.transcribe(temp_file_path)

        # Check if the transcription failed
        if transcript.status == aai.TranscriptStatus.error:
            raise HTTPException(status_code=400, detail=f"Error in transcription: {transcript.error}")
        
        # Return the transcribed text if successful
        return {"transcript": transcript.text}
    
    finally:
        # Clean up the temporary file
        try:
            os.remove(temp_file_path)
        except Exception as e:
            print(f"Error deleting temp file: {e}")