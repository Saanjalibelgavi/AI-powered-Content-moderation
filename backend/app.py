from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import numpy as np
import cv2
import torch
from transformers import (
    pipeline,
    AutoModelForSequenceClassification,
    AutoTokenizer,
    AutoModelForCausalLM
)
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variables for models
text_classifier = None
caption_generator = None
nsfw_detector = None
resnet_model = None

def initialize_models():
    """Initialize all ML models on startup"""
    global text_classifier, caption_generator, nsfw_detector, resnet_model
    
    print("Loading models...")
    
    # Text Classification - Content Moderation
    # Using distilbert for faster inference
    text_classifier = pipeline(
        "text-classification",
        model="distilbert-base-uncased-finetuned-sst-2-english",
        device=0 if torch.cuda.is_available() else -1
    )
    
    # Caption Generation - GPT-2 for social media captions
    caption_generator = pipeline(
        "text-generation",
        model="gpt2",
        device=0 if torch.cuda.is_available() else -1
    )
    
    # Load pretrained ResNet for image feature extraction
    resnet_model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=True)
    resnet_model.eval()
    
    print("Models loaded successfully!")

def preprocess_image(image_data):
    """Preprocess image for CNN models"""
    # Decode base64 image
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Convert to numpy array for OpenCV
    image_np = np.array(image)
    
    return image, image_np

def detect_image_content(image_np):
    """Analyze image using OpenCV and CNN"""
    # Convert to grayscale for some OpenCV operations
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    
    # Detect faces using OpenCV Haar Cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    # Edge detection for content analysis
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / edges.size
    
    # Color analysis
    avg_color = np.mean(image_np, axis=(0, 1))
    brightness = np.mean(avg_color)
    
    # Analyze with ResNet
    # Preprocess for ResNet
    from torchvision import transforms
    preprocess = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    input_tensor = preprocess(image_np)
    input_batch = input_tensor.unsqueeze(0)
    
    with torch.no_grad():
        output = resnet_model(input_batch)
    
    # Get top predictions
    probabilities = torch.nn.functional.softmax(output[0], dim=0)
    top_prob, top_catid = torch.topk(probabilities, 3)
    
    return {
        'faces_detected': len(faces),
        'edge_density': float(edge_density),
        'brightness': float(brightness),
        'has_people': len(faces) > 0,
        'is_complex': edge_density > 0.1,
        'top_predictions': [
            {'confidence': float(top_prob[i]), 'category_id': int(top_catid[i])}
            for i in range(3)
        ]
    }

def analyze_text_sentiment(text):
    """Analyze text using Hugging Face transformers"""
    if not text or len(text.strip()) == 0:
        return {'label': 'NEUTRAL', 'score': 0.5}
    
    result = text_classifier(text[:512])[0]  # Limit text length
    return result

def generate_platform_captions(text, image_features):
    """Generate platform-specific captions using GPT-2"""
    
    # Create context based on image features
    context = f"Create social media post about: {text}. "
    if image_features['has_people']:
        context += "Image contains people. "
    if image_features['is_complex']:
        context += "Image is detailed. "
    
    captions = {}
    
    # Instagram - More casual, emoji-friendly
    instagram_prompt = f"{context} Instagram style with emojis:"
    instagram_results = caption_generator(
        instagram_prompt,
        max_length=60,
        num_return_sequences=3,
        temperature=0.8,
        do_sample=True
    )
    captions['instagram'] = [result['generated_text'].replace(instagram_prompt, '').strip()[:200] for result in instagram_results]
    
    # Facebook - More descriptive
    facebook_prompt = f"{context} Facebook post:"
    facebook_results = caption_generator(
        facebook_prompt,
        max_length=80,
        num_return_sequences=3,
        temperature=0.7,
        do_sample=True
    )
    captions['facebook'] = [result['generated_text'].replace(facebook_prompt, '').strip()[:250] for result in facebook_results]
    
    # LinkedIn - Professional tone
    linkedin_prompt = f"{context} Professional LinkedIn post:"
    linkedin_results = caption_generator(
        linkedin_prompt,
        max_length=70,
        num_return_sequences=3,
        temperature=0.6,
        do_sample=True
    )
    captions['linkedin'] = [result['generated_text'].replace(linkedin_prompt, '').strip()[:220] for result in linkedin_results]
    
    return captions

def generate_hashtags(text, captions):
    """Generate relevant hashtags from text and captions"""
    # Extract keywords for hashtags
    words = text.lower().split()
    
    # Platform-specific hashtag strategies
    hashtags = {
        'instagram': [
            [f'#{word}' for word in words[:5] if len(word) > 3],
            ['#instagood', '#photooftheday', '#beautiful', '#happy', '#follow'],
            ['#picoftheday', '#instadaily', '#likeforlike', '#instalike', '#instamood']
        ],
        'facebook': [
            [f'#{word.capitalize()}' for word in words[:5] if len(word) > 3],
            ['#SocialMedia', '#Community', '#Share', '#Connect', '#Trending'],
            ['#ViralPost', '#MustSee', '#Amazing', '#Awesome', '#Cool']
        ],
        'linkedin': [
            [f'#{word.capitalize()}' for word in words[:5] if len(word) > 3],
            ['#Professional', '#Business', '#Career', '#Leadership', '#Growth'],
            ['#Innovation', '#Technology', '#Success', '#Networking', '#Industry']
        ]
    }
    
    return hashtags

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """Main endpoint for content analysis"""
    try:
        data = request.json
        text = data.get('text', '')
        image = data.get('image', '')
        
        # Analyze text sentiment
        text_analysis = analyze_text_sentiment(text)
        
        # Analyze image if provided
        image_features = None
        if image:
            _, image_np = preprocess_image(image)
            image_features = detect_image_content(image_np)
        else:
            # Default features if no image
            image_features = {
                'faces_detected': 0,
                'edge_density': 0.0,
                'brightness': 128.0,
                'has_people': False,
                'is_complex': False,
                'top_predictions': []
            }
        
        # Make moderation decision
        decision = 'approved'
        confidence = text_analysis['score']
        
        # Adjust decision based on sentiment
        if text_analysis['label'] == 'NEGATIVE' and text_analysis['score'] > 0.8:
            decision = 'rejected'
            confidence = text_analysis['score']
        elif text_analysis['label'] == 'POSITIVE' and text_analysis['score'] > 0.7:
            decision = 'approved'
            confidence = text_analysis['score']
        else:
            decision = 'approved'
            confidence = 0.7
        
        # Generate platform-specific captions
        captions = generate_platform_captions(text, image_features)
        
        # Generate hashtags
        hashtags = generate_hashtags(text, captions)
        
        # Calculate insights
        insights = {
            'engagement_score': min(95, int(confidence * 100 + np.random.randint(-5, 15))),
            'sentiment': text_analysis['label'],
            'toxicity_level': 'Low' if decision == 'approved' else 'High',
            'readability': 'High' if len(text) < 200 else 'Medium',
            'visual_appeal': 'High' if image_features['is_complex'] else 'Medium',
            'authenticity': f"{int(confidence * 100)}%"
        }
        
        response = {
            'decision': decision,
            'confidence': float(confidence),
            'captions': captions,
            'hashtags': hashtags,
            'insights': insights,
            'text_analysis': text_analysis,
            'image_analysis': image_features
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in analyze_content: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': text_classifier is not None
    })

if __name__ == '__main__':
    initialize_models()
    app.run(host='0.0.0.0', port=5000, debug=True)
