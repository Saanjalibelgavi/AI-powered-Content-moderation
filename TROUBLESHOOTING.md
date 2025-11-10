# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Backend Won't Start

#### Error: "Python not found"
```powershell
# Solution: Install Python 3.8+
# Download from: https://www.python.org/downloads/
```

#### Error: "No module named 'flask'"
```powershell
# Solution: Activate virtual environment first
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

#### Error: "Address already in use (port 5000)"
```powershell
# Solution: Kill process using port 5000
netstat -ano | findstr :5000
# Note the PID number
taskkill /PID <PID_NUMBER> /F
# Then restart backend
```

---

### 2. Frontend Connection Issues

#### Error: "Analysis failed. Please ensure backend server is running"
```powershell
# Check if backend is running
# Should see output like:
# * Running on http://127.0.0.1:5000

# If not running:
cd backend
.\venv\Scripts\activate
python app.py
```

#### Error: "CORS error" in browser console
```javascript
// Solution: Already fixed in app.py
// CORS(app) is enabled
// Make sure backend is on port 5000
```

---

### 3. Model Download Issues

#### Error: "Connection timeout" during pip install
```powershell
# Solution: Models download from Hugging Face
# Requires stable internet
# Try with better connection or wait and retry

# Or download models manually:
python -c "from transformers import pipeline; pipeline('text-classification', model='distilbert-base-uncased-finetuned-sst-2-english')"
```

#### Error: "Out of disk space"
```powershell
# Solution: Models need ~3GB space
# Clear space in C:\Users\<YourUser>\.cache\huggingface\
# Or set custom cache location:
# In app.py, add before importing transformers:
# import os
# os.environ['TRANSFORMERS_CACHE'] = 'D:\\cache\\huggingface'
```

---

### 4. Memory Issues

#### Error: "Out of memory" or slow performance
```python
# Solution 1: Use CPU instead of GPU (automatic fallback)
# In app.py, models already use: device=-1 for CPU

# Solution 2: Reduce batch size (already 1)

# Solution 3: Use smaller models
# Replace in app.py:
# "gpt2" → "distilgpt2" (smaller, faster)
```

#### Error: "Killed" or process crashes
```powershell
# Solution: Increase system RAM allocation
# Close other applications
# Or use smaller models (see above)
```

---

### 5. Image Processing Issues

#### Error: "Invalid image format"
```javascript
// Solution: Only PNG, JPG, JPEG supported
// Check file type before upload
```

#### Error: "Image too large"
```python
# Solution: Already handled in backend
# Images auto-resized to 224x224 for ResNet
# But you can add max size check in InputPage.jsx:

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_SIZE) {
  alert('Image too large! Max 5MB');
  return;
}
```

---

### 6. GPU Issues

#### Info: "GPU not detected"
```powershell
# This is OK! App works on CPU
# GPU is optional for faster inference

# To enable GPU:
# 1. Install CUDA Toolkit from NVIDIA
# 2. Install GPU version of PyTorch:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### Error: "CUDA out of memory"
```python
# Solution: Force CPU usage
# In app.py, change:
device=0 if torch.cuda.is_available() else -1
# To:
device=-1  # Always use CPU
```

---

### 7. Caption Generation Issues

#### Issue: Captions are repetitive or low quality
```python
# Solution: Adjust GPT-2 parameters in app.py
# Find generate_platform_captions function and modify:

caption_generator(
    prompt,
    max_length=100,        # Increase from 60
    num_return_sequences=3,
    temperature=0.9,       # Increase from 0.8 (more creative)
    top_p=0.95,           # Add this (nucleus sampling)
    do_sample=True
)
```

#### Issue: Captions don't match image
```python
# Solution: Improve context in app.py
# In generate_platform_captions function:

context = f"Create social media post about: {text}. "
if image_features['has_people']:
    context += f"Image contains {image_features['faces_detected']} people. "
if image_features['is_complex']:
    context += "Image is detailed and visually rich. "
# Add brightness check:
if image_features['brightness'] > 150:
    context += "Image is bright and cheerful. "
```

---

### 8. Virtual Environment Issues

#### Error: "Cannot activate virtual environment"
```powershell
# Solution: Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again:
.\venv\Scripts\activate
```

#### Error: "venv folder doesn't exist"
```powershell
# Solution: Create it first
cd backend
python -m venv venv
```

---

### 9. Port Conflicts

#### Frontend port 3000 in use
```powershell
# Solution: Vite will auto-select next available port
# Or kill process:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### Backend port 5000 in use
```python
# Solution: Change port in app.py (last line):
app.run(host='0.0.0.0', port=5001, debug=True)

# Then update frontend aiService.js:
baseURL: 'http://localhost:5001/api'
```

---

### 10. Performance Optimization

#### App is slow
```python
# Solutions:

# 1. Use GPU (10x faster)
# Install CUDA + GPU PyTorch

# 2. Cache results (add to app.py):
from functools import lru_cache

@lru_cache(maxsize=100)
def analyze_cached(text_hash, image_hash):
    # Cache recent analyses

# 3. Use smaller models:
# Replace "gpt2" with "distilgpt2"
# Already using DistilBERT (smaller than BERT)

# 4. Reduce inference time:
# Set max_length lower for GPT-2
# Skip ResNet if only text moderation needed
```

---

### 11. Development Issues

#### Error: "Module not found" after git pull
```powershell
# Frontend:
npm install

# Backend:
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

#### Hot reload not working
```powershell
# Frontend: Already enabled (Vite HMR)
# Backend: Set debug=True in app.py (already set)
```

---

### 12. Production Deployment Issues

#### Security warnings
```python
# Solutions for production:

# 1. Disable debug mode:
app.run(host='0.0.0.0', port=5000, debug=False)

# 2. Add authentication:
from flask_httpauth import HTTPTokenAuth
auth = HTTPTokenAuth(scheme='Bearer')

# 3. Add rate limiting:
from flask_limiter import Limiter
limiter = Limiter(app)

# 4. Use production WSGI server:
# pip install gunicorn
# gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### CORS issues in production
```python
# Update CORS in app.py:
CORS(app, origins=['https://yourdomain.com'])
```

---

## 🆘 Still Having Issues?

### Check Logs

**Backend:**
```powershell
# Terminal output shows errors
# Look for:
# - Import errors
# - Model loading errors
# - Request errors
```

**Frontend:**
```javascript
// Browser Console (F12)
// Look for:
// - Network errors (red requests)
// - CORS errors
// - API connection errors
```

### Test Backend Independently

```powershell
# Test health endpoint:
curl http://localhost:5000/api/health

# Should return:
# {"status":"healthy","models_loaded":true}
```

### Test Frontend Independently

```javascript
// In browser console:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 📊 System Requirements

### Minimum:
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 10GB free
- **Internet**: Required for first setup

### Recommended:
- **CPU**: 8+ cores
- **RAM**: 16GB
- **GPU**: NVIDIA with 4GB+ VRAM
- **Storage**: 20GB+ free SSD

---

## 🔍 Debug Mode

Enable verbose logging in `app.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Add debug prints:
@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    try:
        data = request.json
        print(f"[DEBUG] Received text length: {len(data.get('text', ''))}")
        print(f"[DEBUG] Has image: {bool(data.get('image'))}")
        
        # ... rest of code
```

---

**Most issues? Check that:**
1. ✅ Backend running on port 5000
2. ✅ Virtual environment activated
3. ✅ All packages installed
4. ✅ Internet connection (first run)
5. ✅ Enough RAM/disk space

**Still stuck? Check the terminal output for specific error messages!**
