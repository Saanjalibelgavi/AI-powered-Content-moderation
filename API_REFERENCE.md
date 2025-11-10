# Backend API Reference

This document describes the expected API endpoints for connecting to a real AI service.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Full Analysis (Recommended)
Analyzes image and generates content suggestions in one call.

**Endpoint:** `POST /analyze-full`

**Request:**
```javascript
Content-Type: multipart/form-data

FormData:
  - image: File (required)
  - tone: String (optional, default: "Inspirational")
```

**Response:**
```json
{
  "success": true,
  "data": {
    "moderation": {
      "isApproved": true,
      "confidence": 95.5,
      "flags": {
        "inappropriate": false,
        "violence": false,
        "spam": false,
        "adult": false
      },
      "categories": ["General", "Social Media Safe"]
    },
    "suggestions": {
      "captions": [
        "✨ Caption option 1...",
        "🌟 Caption option 2...",
        "💫 Caption option 3...",
        "📸 Caption option 4..."
      ],
      "hashtags": [
        "#photography #instagood #photooftheday",
        "#lifestyle #dailyinspiration #moments",
        "#aesthetic #vibes #content"
      ],
      "tones": ["Inspirational", "Casual", "Professional", "Fun"]
    }
  }
}
```

### 2. Moderation Only
Analyzes image for content safety.

**Endpoint:** `POST /moderate`

**Request:**
```javascript
Content-Type: multipart/form-data

FormData:
  - image: File (required)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isApproved": true,
    "confidence": 95.5,
    "flags": {
      "inappropriate": false,
      "violence": false,
      "spam": false,
      "adult": false
    },
    "categories": ["General", "Social Media Safe"]
  }
}
```

### 3. Content Generation Only
Generates captions and hashtags.

**Endpoint:** `POST /generate-content`

**Request:**
```javascript
Content-Type: multipart/form-data

FormData:
  - image: File (required)
  - tone: String (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "captions": [
      "Caption 1...",
      "Caption 2...",
      "Caption 3...",
      "Caption 4..."
    ],
    "hashtags": [
      "#tag1 #tag2 #tag3",
      "#tag4 #tag5 #tag6",
      "#tag7 #tag8 #tag9"
    ],
    "tones": ["Inspirational", "Casual", "Professional", "Fun"]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid image format",
  "code": "INVALID_FORMAT"
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "error": "Image size exceeds 10MB limit",
  "code": "FILE_TOO_LARGE"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "AI service temporarily unavailable",
  "code": "SERVICE_ERROR"
}
```

## Sample Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Full analysis endpoint
app.post('/api/analyze-full', upload.single('image'), async (req, res) => {
  try {
    const { tone = 'Inspirational' } = req.body;
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    
    // Moderation check
    const moderationPrompt = `Analyze this image for content safety. 
      Check for: inappropriate content, violence, spam indicators, adult content.
      Respond in JSON format.`;
    
    const moderationResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: moderationPrompt },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }],
      max_tokens: 500
    });
    
    // Content generation
    const contentPrompt = `Generate 4 engaging social media captions and 3 hashtag sets 
      for this image in a ${tone} tone.`;
    
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: contentPrompt },
          { 
            type: "image_url", 
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }],
      max_tokens: 800
    });
    
    // Parse and format responses
    const moderation = JSON.parse(moderationResponse.choices[0].message.content);
    const suggestions = JSON.parse(contentResponse.choices[0].message.content);
    
    res.json({
      success: true,
      data: {
        moderation,
        suggestions
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      code: 'SERVICE_ERROR'
    });
  }
});

// Moderate only
app.post('/api/moderate', upload.single('image'), async (req, res) => {
  // Similar implementation for moderation only
});

// Generate content only
app.post('/api/generate-content', upload.single('image'), async (req, res) => {
  // Similar implementation for content generation only
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Rate Limiting Recommendations

- **Free tier:** 10 requests per minute
- **Basic tier:** 50 requests per minute
- **Premium tier:** Unlimited

## Security Considerations

1. **API Key Protection:** Never expose API keys in client-side code
2. **File Validation:** Validate file types and sizes on both client and server
3. **Rate Limiting:** Implement rate limiting to prevent abuse
4. **HTTPS:** Always use HTTPS in production
5. **CORS:** Configure CORS appropriately for your domain
6. **Authentication:** Add user authentication for production use

## Testing the API

Use cURL or Postman:

```bash
curl -X POST http://localhost:5000/api/analyze-full \
  -F "image=@/path/to/image.jpg" \
  -F "tone=Casual"
```

## Integration with Frontend

Update `src/components/Dashboard.jsx`:

```javascript
import { analyzeAndGenerate } from '../services/aiService';

const handleAnalyzeContent = async () => {
  if (!uploadedImage) return;
  setIsAnalyzing(true);

  try {
    const result = await analyzeAndGenerate(uploadedImage, selectedTone);
    setModerationResult(result.moderation);
    setContentSuggestions(result.suggestions);
  } catch (error) {
    console.error('Analysis failed:', error);
    // Show error message to user
  } finally {
    setIsAnalyzing(false);
  }
};
```
