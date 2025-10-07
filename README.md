# Calories Advisor API

A FastAPI-based backend service that analyzes food images and provides calorie information using Google's Gemini AI model.

## Features

- **Image Upload**: Upload food images via REST API
- **Calorie Analysis**: Get detailed calorie breakdown and nutritional information
- **Health Assessment**: Receive health recommendations and macronutrient percentages
- **CORS Support**: Ready for frontend integration

## API Endpoints

### GET `/`
- **Description**: Root endpoint
- **Response**: API status and information

### GET `/health`
- **Description**: Health check endpoint
- **Response**: Service health status

### POST `/analyze-calories`
- **Description**: Analyze uploaded food image
- **Parameters**: 
  - `file`: Image file (multipart/form-data)
- **Response**: 
  ```json
  {
    "success": true,
    "analysis": "Detailed calorie analysis...",
    "filename": "image.jpg",
    "content_type": "image/jpeg"
  }
  ```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Create a `.env` file in the backend directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the Server**:
   ```bash
   # Development mode with auto-reload
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   
   # Or run directly
   python app.py
   ```

4. **Access the API**:
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Testing

Run the test script to verify the API is working:
```bash
python test_api.py
```

## Example Usage

### Using curl:
```bash
curl -X POST "http://localhost:8000/analyze-calories" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/image.jpg"
```

### Using Python requests:
```python
import requests

url = "http://localhost:8000/analyze-calories"
files = {"file": open("path/to/image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Frontend Features

### Webcam Capture (ChatGPT/Gemini Style)
- **Real-time Camera Access**: High-quality video feed with automatic camera detection
- **Tap to Capture**: Click anywhere on the video to capture images instantly
- **Camera Switching**: Seamlessly switch between front and back cameras
- **Mobile Optimized**: Prefers back camera on mobile devices for better food photography
- **Error Handling**: Graceful fallbacks with user-friendly error messages
- **Cross-Platform**: Works on desktop, mobile, and tablet devices

### User Interface
- **Modern Design**: Beautiful, responsive UI with smooth animations
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Real-time Preview**: Instant image preview before analysis
- **Progressive Enhancement**: Works with or without camera access

## Migration from Streamlit

This FastAPI version replaces the original Streamlit application with:
- REST API endpoints instead of web UI
- File upload handling via multipart/form-data
- JSON responses instead of Streamlit widgets
- CORS middleware for frontend integration
- Proper error handling and validation
- Advanced webcam capture functionality similar to ChatGPT and Gemini
