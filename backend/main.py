from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from sklearn.preprocessing import LabelEncoder
import joblib
import aiofiles
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi import  HTTPException,  Form
import assemblyai as aai
import os
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time

# Set up the AssemblyAI API key
aai.settings.api_key = "5f8d153d9b08430aa5f45b5245b518a2"
# Load the saved model, scaler, and feature selector
knn_model = joblib.load("model/knn_model.pkl")
scaler = joblib.load("model/scaler.pkl")
selector = joblib.load("model/selector.pkl")
label_encoder = joblib.load("model/label_encoder.pkl")

# Define the FastAPI app
app = FastAPI()


DATABASE_URL = "sqlite:///./results.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    reading_speed = Column(Float)
    reading_accuracy = Column(Float)
    math_speed = Column(Float)
    math_accuracy = Column(Float)
    memory_score = Column(Float)
    predicted_condition = Column(String)

Base.metadata.create_all(bind=engine)

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
    # Attention_Span: float
    Memory_Score: float
    
class ResultInput(PredictionRequest):
    Name: str
    Predicted_Condition: str  
    

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
        request.Memory_Score,
    ]
    predicted_condition = predict_condition(features)
    if(predicted_condition=='both'):
        return {"Predicted Condition": "Dyslexia and Dyscalculia"}
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
            
            
            
            


@app.post("/analyze_audio/")
async def analyze_audio(
    file: UploadFile = File(...),
    expected_text: str = Form(...),
    duration: float = Form(...)  # Accept duration as a float
):
    """
    API to transcribe audio, calculate transcription accuracy, and reading speed.
    """
    temp_file_path = f"temp_{file.filename}"

    try:
        # Save the uploaded audio file temporarily
        async with aiofiles.open(temp_file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        # Create a transcriber object

        # Transcribe the audio file
        # Create a transcriber object
        transcriber = aai.Transcriber()

        # Start timing the transcription process

        # Transcribe the audio file
        transcript = transcriber.transcribe(temp_file_path)

        # Calculate time taken for reading

        if transcript.status == aai.TranscriptStatus.error:
            raise HTTPException(status_code=400, detail=f"Error in transcription: {transcript.error}")

        transcribed_text = transcript.text

        # Calculate accuracy
        expected_words = expected_text.split()
        transcribed_words = transcribed_text.split()

        correct_word_count = sum(
            1 for i, word in enumerate(expected_words)
            if i < len(transcribed_words) and word == transcribed_words[i]
        )
        total_words = len(expected_words)

        accuracy = (correct_word_count / total_words) * 100 if total_words > 0 else 0

        # Calculate reading speed (words per minute)
        if duration <= 0:
            raise HTTPException(status_code=400, detail="Duration must be greater than 0.")

        words_per_minute = (len(transcribed_words) / duration) * 60

        return JSONResponse(
            content={
                "transcription": transcribed_text,
                "accuracy": round(accuracy, 2),
                "reading_speed_wpm": round(words_per_minute, 2),
                "reading_time_seconds": round(duration, 2),
            }
        )

    finally:
        # Clean up temporary file
        try:
            os.remove(temp_file_path)
        except Exception as e:
            print(f"Error deleting temp file: {e}")
            
            
            
@app.post("/results")
async def save_results(input: ResultInput):
    db = SessionLocal()
    try:
        result = Result(
            name=input.Name,
            reading_speed=input.Reading_Speed,
            reading_accuracy=input.Reading_Accuracy,
            math_speed=input.Math_Speed,
            math_accuracy=input.Math_Accuracy,
            memory_score=input.Memory_Score,
            predicted_condition=input.Predicted_Condition,
        )
        db.add(result)
        db.commit()
        return {"message": "Result saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save results")
    finally:
        db.close()
        
        
        
@app.get("/results")
async def get_all_results():
    db = SessionLocal()
    try:
        results = db.query(Result).all()
        return [
            {
                "id": result.id,
                "name": result.name,
                "reading_speed": result.reading_speed,
                "reading_accuracy": result.reading_accuracy,
                "math_speed": result.math_speed,
                "math_accuracy": result.math_accuracy,
                "memory_score": result.memory_score,
                "predicted_condition": result.predicted_condition,
            }
            for result in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch results")
    finally:
        db.close()
