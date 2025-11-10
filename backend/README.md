# AI-Powered Content Moderation Backend

This is the Python Flask backend that provides ML and computer vision capabilities for the content moderation app.

## Features

### 🤖 Hugging Face Transformers
- **Text Classification**: DistilBERT for sentiment analysis and content moderation
- **Caption Generation**: GPT-2 for creating platform-specific social media captions
- **Multi-platform Support**: Generates Instagram, Facebook, and LinkedIn optimized captions

### 👁️ OpenCV + Pretrained CNNs
- **Face Detection**: Haar Cascade for detecting people in images
- **Image Analysis**: Edge detection, brightness, and color analysis
- **ResNet-50**: Deep learning model for image classification and feature extraction
- **Content Detection**: Analyzes image complexity and visual appeal

## Installation

1. **Create a virtual environment:**
```bash
cd backend
python -m venv venv
```

2. **Activate the virtual environment:**
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Mac/Linux:
  ```bash
  source venv/bin/activate
  ```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST `/api/analyze`
Analyzes text and image content for moderation and generates captions.

**Request Body:**
```json
{
  "text": "Your content text here",
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "decision": "approved",
  "confidence": 0.85,
  "captions": {
    "instagram": ["caption1", "caption2", "caption3"],
    "facebook": ["caption1", "caption2", "caption3"],
    "linkedin": ["caption1", "caption2", "caption3"]
  },
  "hashtags": {
    "instagram": [["#tag1", "#tag2"], ["#tag3", "#tag4"], ["#tag5", "#tag6"]],
    "facebook": [...],
    "linkedin": [...]
  },
  "insights": {
    "engagement_score": 85,
    "sentiment": "POSITIVE",
    "toxicity_level": "Low",
    "readability": "High",
    "visual_appeal": "High",
    "authenticity": "85%"
  },
  "image_analysis": {
    "faces_detected": 2,
    "has_people": true,
    "is_complex": true,
    "brightness": 150.5,
    "top_predictions": [...]
  }
}
```

### GET `/api/health`
Health check endpoint to verify server status.

## Models Used

1. **DistilBERT** - Text classification and sentiment analysis
2. **GPT-2** - Caption generation
3. **ResNet-50** - Image feature extraction and classification
4. **OpenCV Haar Cascades** - Face detection

## GPU Support

The backend automatically detects and uses GPU if CUDA is available, otherwise falls back to CPU.

## Notes

- First run will download models (~2-3GB), this may take a few minutes
- GPU recommended for faster inference
- Models are cached locally after first download
