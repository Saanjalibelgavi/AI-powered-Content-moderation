# 🤖 Google Gemini AI Setup Guide

## ✅ Library Installation
The Google Gemini library has been successfully installed in your backend environment!

## 🔑 Get Your Free API Key

### Step 1: Visit Google AI Studio
Go to: **https://makersuite.google.com/app/apikey**

Or: **https://aistudio.google.com/app/apikey**

### Step 2: Sign in with your Google Account
Use any Google account (Gmail) to sign in.

### Step 3: Create API Key
1. Click "Create API Key"
2. Select "Create API key in new project" (or use existing project)
3. Copy the generated API key (looks like: `AIzaSy...`)

## 🚀 Set Up the API Key

### For Windows (PowerShell):
```powershell
# Temporary (for current session only)
$env:GEMINI_API_KEY = "AIzaSyBNH7jgn6pByrdm2s5r7XtP8-yTvYHBUvo"

# Permanent (recommended)
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'AIzaSyBNH7jgn6pByrdm2s5r7XtP8-yTvYHBUvo', 'User')
```

### For Windows (Command Prompt):
```cmd
set GEMINI_API_KEY=your_api_key_here
```

### For Linux/Mac:
```bash
# Temporary
export GEMINI_API_KEY="AIzaSyBNH7jgn6pByrdm2s5r7XtP8-yTvYHBUvo"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export GEMINI_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

## 🔄 Restart Backend Server

After setting the API key, restart your backend:

```powershell
cd "d:\Projeect\AI powered content moderation\backend"
.\venv\Scripts\Activate.ps1
python app_smart.py
```

## ✨ What Gemini Will Do

When you upload an image:
1. **AI Vision Analysis** - Gemini analyzes the actual image content
2. **Smart Caption** - Generates a natural language description
3. **Theme Detection** - Uses AI caption to detect theme (sunset, food, people, etc.)
4. **Platform Captions** - Creates 6-8 captions for your selected platform
5. **Smart Hashtags** - Generates relevant hashtags

## 📊 Free Tier Limits

Google Gemini free tier includes:
- ✅ 15 requests per minute
- ✅ 1500 requests per day
- ✅ 1 million requests per month
- ✅ Image analysis capabilities
- ✅ No credit card required

More than enough for testing and development!

## 🧪 Test It

1. Set your API key
2. Restart backend server
3. Upload an image of a sunset, food, or people
4. Select a platform (Instagram, Facebook, LinkedIn, Twitter)
5. Click "Generate Captions"
6. See AI-powered captions! 🎉

## 🔍 Check Backend Logs

You should see:
```
🤖 Generating caption with Google Gemini...
✨ Gemini Caption: [AI-generated description]
🧠 Enhanced text with AI caption
🎨 Detected theme: [theme]
```

## ⚠️ Troubleshooting

**Issue**: "GEMINI_API_KEY not set"
- Solution: Make sure you set the environment variable and restarted the terminal

**Issue**: Backend not using Gemini
- Solution: Check backend logs for "🤖 Generating caption with Google Gemini..."
- Make sure API key is set correctly

**Issue**: API key error
- Solution: Verify your API key is correct
- Check you copied the full key (starts with AIzaSy...)

## 🎯 Next Steps

Once you see "🤖 Generating caption with Google Gemini..." in your logs:
1. Your AI-powered caption system is working!
2. Upload different types of images to test
3. Try all 4 platforms (Instagram, Facebook, LinkedIn, Twitter)
4. Enjoy smart, context-aware captions! 🚀
