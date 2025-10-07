from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from PIL import Image
import io
from typing import Dict, Any, Optional
from prompts import CALORIE_ANALYSIS_PROMPT

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize FastAPI app
app = FastAPI(
    title="Calories Advisor API",
    description="An API to analyze food images and provide calorie information",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def gemini_response(input_prompt: str, image_data: list, api_key: str, model_name: str = "models/gemma-3-27b-it") -> str:
    """Generate response from Gemini model"""
    try:
        # Configure Gemini with the provided API key
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        response = model.generate_content([input_prompt, image_data[0]])
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

def input_image_setup(uploaded_file: UploadFile) -> list:
    """Process uploaded image file"""
    if uploaded_file is None:
        raise ValueError("No image uploaded")
    
    # Read file content
    file_content = uploaded_file.file.read()
    
    # Reset file pointer
    uploaded_file.file.seek(0)
    
    image_parts = [
        {
            "mime_type": uploaded_file.content_type,
            "data": file_content,
        }
    ]
    return image_parts

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Calories Advisor API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/analyze-calories")
async def analyze_calories(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None),
    model: Optional[str] = Form(None)
) -> Dict[str, Any]:
    """
    Analyze uploaded food image and return calorie information
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (optional - adjust as needed)
    if file.size and file.size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File size too large")
    
    # Use provided API key or fallback to environment variable
    gemini_api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise HTTPException(status_code=400, detail="No API key provided")
    
    # Use provided model or fallback to default
    selected_model = model or "models/gemma-3-27b-it"
    
    try:
        # Process the image
        image_data = input_image_setup(file)
        
        # Use the prompt from prompts.py
        input_prompt = CALORIE_ANALYSIS_PROMPT
        
        # Get response from Gemini
        response = gemini_response(input_prompt, image_data, gemini_api_key, selected_model)
        
        return {
            "success": True,
            "analysis": response,
            "filename": file.filename,
            "content_type": file.content_type
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
