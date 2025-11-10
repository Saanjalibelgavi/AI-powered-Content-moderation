# AI-powered-Content-moderation
Modern web application for intelligent content moderation and social media caption generation using Machine Learning and Computer Vision

<img alt="React" src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&amp;logo=react">

<img alt="Flask" src="https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&amp;logo=flask">

<img alt="Python" src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&amp;logo=python">

<img alt="Hugging Face" src="https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=for-the-badge&amp;logo=huggingface">

🌟 Overview
A sophisticated multi-page web application that leverages cutting-edge AI and computer vision technologies to moderate content and generate platform-specific social media captions. Perfect for content creators, social media managers, and digital marketers who need intelligent content analysis and automated caption generation.

✨ Key Features
🎯 Multi-Platform Caption Generation
Instagram Captions: Casual, emoji-rich, hashtag-optimized content
Facebook Captions: Conversational, community-focused messaging
LinkedIn Captions: Professional, business-oriented content
9 AI-Generated Variations across all platforms


🔍 Advanced Content Moderation
Real-time sentiment analysis using Hugging Face Transformers
Automated content approval/rejection with confidence scoring
Multi-modal analysis (text + image)
Safety score calculation


👁️ Computer Vision Analysis
Face Detection with OpenCV Haar Cascades
Image Classification using PyTorch ResNet-50 CNN
Visual Appeal Scoring with edge detection and color analysis
1000+ Category Recognition from pretrained models
#️⃣ Smart Hashtag System
45+ curated hashtags per analysis

🎨 Modern UI/UX
Beautiful gradient animations with floating orbs
Glassmorphism design with backdrop blur
Slide-in and pop-up card animations
Responsive design for all devices
Platform-specific color coding
Vibrant multi-color palette (pink, cyan, orange, lime)
🛠️ Tech Stack

Frontend
⚛️ React 18 with Vite
🎨 CSS3 with custom animations
🧭 React Router v6 for navigation
🎯 Lucide React icons
📱 Fully responsive design


Backend
🐍 Flask REST API
🤖 Hugging Face Transformers (DistilBERT, GPT-2)
👁️ OpenCV for computer vision
🧠 PyTorch with pretrained ResNet-50
🖼️ Pillow for image processing


Machine Learning Models
DistilBERT - Text sentiment analysis & moderation
GPT-2 - Natural language caption generation
ResNet-50 - Image classification (pretrained on ImageNet)
Haar Cascades - Face detection

 Quick Start
Prerequisites
Node.js 16+ and npm
Python 3.8+
4GB+ RAM (for ML models)


Installation
# Clone the repository
git clone https://github.com/yourusername/ai-content-moderation.git
cd ai-content-moderation

# Install frontend dependencies
npm install

# Setup backend
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cd ..

Running the Application
Option 1: Automated (Windows)
.\start-app.ps1

Option 2: Manual
# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
python app.py

# Terminal 2 - Frontend
npm run dev
Access the app at: http://localhost:3000




Platform-specific recommendations
Click-to-toggle selection interface
One-click copy functionality
