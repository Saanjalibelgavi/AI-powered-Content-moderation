# Quick Start Guide

## 🚀 Your AI Content Moderation Dashboard is Ready!

The application is now running at: **http://localhost:3000/**

## ✨ Features Available

### 1. **Image Upload**
   - Drag and drop images directly into the upload zone
   - Or click to browse and select from your device
   - Supports: JPG, PNG, GIF, WebP formats

### 2. **AI Content Analysis**
   - Click "Analyze & Generate Content" after uploading
   - Get instant moderation results with confidence scores
   - See safety flags if any issues are detected

### 3. **Content Suggestions**
   - Choose from 4 different tones: Inspirational, Casual, Professional, Fun
   - Get 4 AI-generated caption options
   - Get 3 hashtag combinations optimized for social media
   - One-click copy to clipboard functionality

### 4. **Moderation Results**
   - Clear approval/rejection status
   - Confidence percentage
   - Category classifications
   - Detailed flag breakdown if content is flagged

## 🎯 How to Use

1. **Upload**: Drag an image into the dashboard or click to select
2. **Analyze**: Click the purple "Analyze & Generate Content" button
3. **Review**: Check the moderation status (Approved/Flagged)
4. **Generate**: If approved, browse through AI-generated captions and hashtags
5. **Copy**: Click the copy button next to any suggestion to use it

## 🔧 Next Steps - Connect Real AI

Currently using mock data. To connect real AI services:

### Option 1: OpenAI GPT-4 Vision
```javascript
// Install: npm install openai
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Analyze this image for content moderation..." },
        { type: "image_url", image_url: { url: imageBase64 } }
      ]
    }
  ]
});
```

### Option 2: Google Cloud Vision
```javascript
// Install: npm install @google-cloud/vision
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();
const [result] = await client.safeSearchDetection(imageBuffer);
```

### Option 3: Azure Computer Vision
```javascript
// Install: npm install @azure/cognitiveservices-computervision
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';

const client = new ComputerVisionClient(credentials, endpoint);
const analysis = await client.analyzeImage(imageUrl, { visualFeatures: ['Adult'] });
```

## 📁 Project Structure

```
d:\Projeect\AI powered content moderation\
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── ContentSuggestions.jsx
│   │   └── ModerationResult.jsx
│   ├── styles/             # CSS styling
│   │   ├── Dashboard.css
│   │   ├── ImageUpload.css
│   │   ├── ContentSuggestions.css
│   │   └── ModerationResult.css
│   ├── services/           # API integration
│   │   └── aiService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🎨 Customization

### Change Colors
Edit `src/index.css` in the `:root` section:
```css
--primary-color: #6366f1;    /* Main brand color */
--secondary-color: #8b5cf6;  /* Accent color */
--success-color: #10b981;    /* Success/approved */
--danger-color: #ef4444;     /* Error/flagged */
```

### Modify AI Prompts
Edit `src/components/Dashboard.jsx` in the `handleAnalyzeContent` function.

### Add More Tones
Update the `tones` array in the mock suggestions or API response.

## 🛠️ Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## 📱 Responsive Design

The dashboard automatically adapts to:
- Desktop (full side-by-side layout)
- Tablet (stacked layout)
- Mobile (optimized touch interactions)

## 🔐 Environment Variables

Copy `.env.example` to `.env` and add your API keys:
```bash
REACT_APP_API_URL=your_backend_url
REACT_APP_OPENAI_API_KEY=your_openai_key
```

## 💡 Tips

1. **Large Images**: The app automatically scales preview images
2. **Copy Feedback**: Visual confirmation when text is copied
3. **Error Handling**: Add try-catch blocks when integrating real APIs
4. **Rate Limiting**: Consider adding rate limiting for API calls
5. **Caching**: Cache results to avoid duplicate API calls

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change port in vite.config.js
server: { port: 3001 }
```

**Dependencies issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
npm run build
# Check console for specific errors
```

## 📞 Support

- Check README.md for detailed documentation
- Review src/services/aiService.js for API integration examples
- Modify src/components/Dashboard.jsx for custom logic

---

**Enjoy building with AI Content Moderation Dashboard! 🎉**
