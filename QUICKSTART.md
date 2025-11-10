# 🚀 Quick Start Guide - AI Content Moderation

## What You Just Got

A complete AI-powered content moderation system with:

### 🤖 **ML & Vision Backend**
- **Hugging Face Transformers** for text analysis
- **OpenCV + ResNet-50 CNN** for image analysis
- **GPT-2** for caption generation
- **DistilBERT** for sentiment analysis

### ⚛️ **React Frontend**
- Beautiful animated UI
- Platform-specific captions (Instagram, Facebook, LinkedIn)
- Hashtag selection system
- Real-time AI analysis

---

## 📦 Installation (One-Time Setup)

### Option 1: Automated Setup (Recommended)
```powershell
.\setup-backend.ps1
```

### Option 2: Manual Setup
```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend (already done)
npm install
```

---

## 🎮 Running the App

### Easiest Way - One Command:
```powershell
.\start-app.ps1
```

This opens 2 terminals automatically:
- Backend server on port 5000
- Frontend server on port 3000

### Manual Way - Two Terminals:

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

---

## 🎯 How to Use

1. **Open** `http://localhost:3000` in browser
2. **Login** (any credentials work)
3. **Input Page:**
   - Enter text content
   - Upload an image
   - Click "Analyze Content"
4. **Results Page:**
   - See AI moderation decision
   - Get 9 AI-generated captions (3 per platform)
   - Click hashtags to select/deselect
   - Copy captions with hashtags

---

## 🤖 ML Models Explained

### Text Analysis (Hugging Face)
```
Input: "Amazing sunset at the beach today!"
↓
DistilBERT → Sentiment: POSITIVE (95% confidence)
↓
GPT-2 → Generated captions for each platform
```

### Image Analysis (OpenCV + CNN)
```
Input: [Beach photo]
↓
Haar Cascade → Face Detection: 2 faces found
↓
ResNet-50 → Classification: 'beach', 'sunset', 'ocean'
↓
OpenCV → Brightness: 180, Edge Density: 0.15
```

---

## 📊 What Happens Behind the Scenes

```
React Frontend
    ↓ (POST /api/analyze)
Flask Backend
    ↓
┌─────────────────┬─────────────────┐
│  Text Analysis  │  Image Analysis │
│  (Transformers) │  (OpenCV + CNN) │
├─────────────────┼─────────────────┤
│ • DistilBERT    │ • Face Detection│
│ • GPT-2         │ • ResNet-50     │
│ • Sentiment     │ • Edge/Color    │
└─────────────────┴─────────────────┘
    ↓
Combined Results
    ↓
React Results Page
```

---

## 🐛 Troubleshooting

### "Connection refused" error
✅ Backend not running. Start with: `cd backend; python app.py`

### "Module not found" error
✅ Virtual environment not activated. Run: `.\venv\Scripts\activate`

### Models downloading slowly
✅ Normal on first run (~2-3GB). Grab coffee ☕

### GPU not detected
✅ Optional. App works on CPU (just slower)

---

## 📁 Project Structure

```
AI powered content moderation/
│
├── backend/                 # 🐍 Python ML Backend
│   ├── app.py              # Flask server + ML models
│   ├── requirements.txt    # Python packages
│   └── venv/               # Virtual environment
│
├── src/
│   ├── pages/              # React pages
│   ├── services/
│   │   └── aiService.js   # API calls to backend
│   └── styles/             # CSS animations
│
├── setup-backend.ps1       # Auto setup script
└── start-app.ps1          # Launch both servers
```

---

## 🎨 Features You Got

### ✨ Animations
- Slide-in platform blocks
- Pop-in caption cards  
- Shimmer effects
- Ripple buttons

### 🎯 AI-Powered
- Content moderation (approve/reject)
- Sentiment analysis
- Face detection
- Image classification
- Caption generation for 3 platforms

### #️⃣ Smart Hashtags
- 45 relevant hashtags
- 5 per caption × 3 captions × 3 platforms
- Click to toggle selection
- Auto-copy with captions

---

## 💡 Tips

1. **First Run**: Models download once (~5 min), then cached
2. **GPU**: Auto-detected if available (10x faster)
3. **Image Size**: Large images auto-resized
4. **Text Length**: Longer text = better analysis

---

## 🚀 Next Steps

1. ✅ Run `.\setup-backend.ps1`
2. ✅ Run `.\start-app.ps1`
3. ✅ Open http://localhost:3000
4. ✅ Upload content and see AI magic! ✨

---

## 📚 Technologies Used

- **Frontend**: React 18, Vite, React Router
- **Backend**: Flask, Python 3.8+
- **ML/NLP**: Hugging Face Transformers (DistilBERT, GPT-2)
- **Computer Vision**: OpenCV, PyTorch, ResNet-50
- **Styling**: CSS3 with animations

---

**Questions?** Check the detailed README.md in backend folder!

**Enjoy your AI-powered content moderation system! 🎉**
