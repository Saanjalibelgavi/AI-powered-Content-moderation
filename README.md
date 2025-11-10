# AI Content Moderation Dashboard

A modern React application for AI-powered content moderation with intelligent content suggestions for social media posts.

## Features

✨ **Image Upload**: Drag-and-drop or click to upload images from your device
🤖 **AI Content Moderation**: Automatic content safety analysis and flagging
📝 **Smart Content Suggestions**: AI-generated captions and hashtags for social media
🎨 **Multiple Tone Options**: Choose from different writing styles (Inspirational, Casual, Professional, Fun)
🛡️ **Safety Scoring**: Confidence scores and detailed moderation results
📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd "d:\Projeect\AI powered content moderation"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── ImageUpload.jsx        # Image upload with drag-and-drop
│   ├── ContentSuggestions.jsx # AI content suggestions display
│   └── ModerationResult.jsx   # Moderation results display
├── styles/
│   ├── Dashboard.css
│   ├── ImageUpload.css
│   ├── ContentSuggestions.css
│   └── ModerationResult.css
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

## How It Works

1. **Upload Image**: Drag and drop or click to select an image from your device
2. **Analyze**: Click the "Analyze & Generate Content" button
3. **Review Results**: See moderation status, confidence scores, and any flagged content
4. **Get Suggestions**: If approved, receive AI-generated captions and hashtags
5. **Copy & Use**: Click the copy button to use suggestions on your social media

## Customization

### Connecting to Real AI API

The current implementation uses mock data. To connect to a real AI API:

1. Open `src/components/Dashboard.jsx`
2. Replace the `handleAnalyzeContent` function with your API call:

```javascript
const handleAnalyzeContent = async () => {
  if (!uploadedImage) return;
  setIsAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append('image', uploadedImage);

    // Replace with your API endpoint
    const response = await axios.post('YOUR_API_ENDPOINT', formData);
    
    setModerationResult(response.data.moderation);
    setContentSuggestions(response.data.suggestions);
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

### Styling

All styles use CSS custom properties (variables) defined in `src/index.css`. Modify the `:root` section to change colors and themes.

## Technologies Used

- **React 18**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client (for API calls)

## Future Enhancements

- 🔐 User authentication
- 💾 Save history of analyzed images
- 🌐 Multiple language support
- 📊 Analytics dashboard
- 🔌 Integration with OpenAI, Google Vision, or other AI services
- 📤 Direct posting to social media platforms

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please create an issue in the project repository.
