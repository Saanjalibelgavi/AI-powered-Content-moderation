from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
from datetime import datetime
from database import db, User, init_db

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database
init_db(app)

print("✅ Simple backend server starting (no ML models - using mock data)...")

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """Mock analysis endpoint - returns sample data"""
    try:
        data = request.json
        text = data.get('text', '')
        has_image = bool(data.get('image', ''))
        
        # Generate mock response
        response = {
            'decision': 'approved' if random.random() > 0.2 else 'rejected',
            'confidence': round(random.uniform(0.75, 0.95), 2),
            'captions': {
                'instagram': [
                    f"✨ {text[:50]}... Living my best life! 💫",
                    f"📸 {text[:50]}... What inspires you today? ✨",
                    f"🌟 {text[:50]}... Capturing the magic! 💜"
                ],
                'facebook': [
                    f"Hey friends! 👋 {text[:100]}... What's been the highlight of your week?",
                    f"Feeling blessed! 🌟 {text[:100]}... Hope everyone is having a wonderful day!",
                    f"Taking a moment to appreciate life. {text[:100]}... What are you grateful for?"
                ],
                'linkedin': [
                    f"Professional insight: {text[:80]}... What strategies help you maintain balance?",
                    f"Reflecting on growth: {text[:80]}... What has been your biggest insight recently?",
                    f"Leadership thought: {text[:80]}... What drives your professional passion?"
                ]
            },
            'hashtags': {
                'instagram': [
                    ['#lifestyle', '#inspiration', '#dailyvibes', '#motivation', '#positivevibes'],
                    ['#photooftheday', '#blessed', '#instagood', '#instadaily', '#picoftheday'],
                    ['#happiness', '#grateful', '#goodvibes', '#mindfulness', '#selfcare']
                ],
                'facebook': [
                    ['#Blessed', '#Grateful', '#PositiveVibes', '#Community', '#FamilyFirst'],
                    ['#Inspiration', '#DailyMotivation', '#GoodVibes', '#Thankful', '#ShareTheLove'],
                    ['#Mindfulness', '#Gratitude', '#LifeLessons', '#Positivity', '#TodaysThoughts']
                ],
                'linkedin': [
                    ['#WorkLifeBalance', '#Leadership', '#ProfessionalGrowth', '#CareerDevelopment', '#Success'],
                    ['#BusinessInsights', '#Learning', '#Innovation', '#Entrepreneurship', '#GrowthMindset'],
                    ['#LeadershipDevelopment', '#Impact', '#ProfessionalLife', '#CareerGoals', '#Motivation']
                ]
            },
            'insights': {
                'engagement_score': random.randint(75, 95),
                'sentiment': 'POSITIVE',
                'toxicity_level': 'Low',
                'readability': 'High',
                'visual_appeal': 'High' if has_image else 'Medium',
                'authenticity': f"{random.randint(80, 95)}%",
                'best_time_to_post': random.choice([
                    '9:00 AM - 11:00 AM',
                    '12:00 PM - 1:00 PM', 
                    '7:00 PM - 9:00 PM',
                    '10:00 AM - 12:00 PM',
                    '6:00 PM - 8:00 PM'
                ]),
                'engagement_prediction': random.choice([
                    'High (85-95%)',
                    'Very High (90-98%)',
                    'Excellent (95%+)',
                    'Good (75-85%)',
                    'Strong (80-90%)'
                ])
            },
            'text_analysis': {
                'label': 'POSITIVE',
                'score': round(random.uniform(0.85, 0.98), 2)
            },
            'image_analysis': {
                'faces_detected': random.randint(0, 3) if has_image else 0,
                'has_people': has_image and random.random() > 0.5,
                'is_complex': has_image,
                'brightness': round(random.uniform(120, 180), 1),
                'edge_density': round(random.uniform(0.1, 0.25), 2),
                'top_predictions': []
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': True,
        'mode': 'mock'
    })

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        new_user = User(email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Signup error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/users', methods=['GET'])
def get_users():
    """Get all users (for admin/testing purposes)"""
    try:
        users = User.query.all()
        return jsonify({
            'count': len(users),
            'users': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500

if __name__ == '__main__':
    print("🚀 Backend server ready on http://localhost:5000")
    print("📝 Using mock data (no ML models required)")
    print("⚡ Ready to receive requests!")
    app.run(host='0.0.0.0', port=5000, debug=True)
