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

# Image content analysis patterns
IMAGE_PATTERNS = {
    'sunset': {
        'keywords': ['sunset', 'evening', 'dusk', 'golden hour', 'sky', 'orange', 'red', 'horizon'],
        'captions': {
            'instagram': [
                "🌅 Chasing sunsets and dreams ✨ Every ending brings a new beginning",
                "🧡 Golden hour magic captured in a moment 📸 Nature's masterpiece",
                "☀️ Watching the sun paint the sky 🎨 These are the moments I live for"
            ],
            'facebook': [
                "Another beautiful sunset to remind us of life's simple pleasures 🌅 What's the most beautiful sunset you've ever seen?",
                "Taking a moment to appreciate nature's daily show 🌄 Grateful for these peaceful moments!",
                "The sky put on quite a show tonight! 🌇 Nothing beats ending the day with a view like this"
            ],
            'linkedin': [
                "Reflection moment: Just as the sun sets to rise again, every ending in business creates new opportunities 🌅 #NewBeginnings",
                "Finding inspiration in nature's daily transformation 🌄 Sometimes the best ideas come during moments of pause",
                "Ending the day with gratitude for the journey 🌇 Tomorrow brings new opportunities for growth"
            ]
        },
        'hashtags': {
            'instagram': [
                ['#sunset', '#sunsetlovers', '#goldenhour', '#naturephotography', '#skyporn'],
                ['#sunsetvibes', '#eveningsky', '#sunsetphotography', '#beautifulsky', '#naturelover'],
                ['#sunsetoftheday', '#skylovers', '#dusk', '#eveningglow', '#sunsetmagic']
            ],
            'facebook': [
                ['#Sunset', '#NatureLovers', '#EveningVibes', '#BeautifulSky', '#Grateful'],
                ['#SunsetView', '#NaturesBeauty', '#PeacefulMoments', '#SkyColors', '#Blessed'],
                ['#GoldenHour', '#NaturePhotography', '#SunsetChaser', '#SkyWatcher', '#Thankful']
            ],
            'linkedin': [
                ['#Reflection', '#NewBeginnings', '#GrowthMindset', '#Leadership', '#Inspiration'],
                ['#MindfulMoment', '#WorkLifeBalance', '#Perspective', '#Success', '#Motivation'],
                ['#ProfessionalGrowth', '#Gratitude', '#LeadershipLessons', '#CareerDevelopment', '#Wisdom']
            ]
        }
    },
    'nature': {
        'keywords': ['nature', 'trees', 'forest', 'mountains', 'landscape', 'outdoor', 'green', 'scenic'],
        'captions': {
            'instagram': [
                "🌲 Lost in nature, found in peace 🍃 Where the wild things are",
                "🏔️ Nature therapy at its finest 💚 Breathing in the beauty",
                "🌿 Into the wild we go 🌄 Nature never goes out of style"
            ],
            'facebook': [
                "Sometimes you just need to disconnect and reconnect with nature 🌲 What's your favorite outdoor spot?",
                "Nature has a way of healing the soul 🌿 Grateful for this beautiful planet we call home!",
                "Adventures in the great outdoors! 🏔️ Nothing beats fresh air and stunning views"
            ],
            'linkedin': [
                "Taking time to recharge in nature improves productivity and creativity 🌲 #WorkLifeBalance",
                "Lessons from nature: Adapt, grow, and stay rooted in your values 🌿 #LeadershipLessons",
                "Strategic thinking happens best outdoors 🏔️ Where do you find your best ideas?"
            ]
        },
        'hashtags': {
            'instagram': [
                ['#nature', '#naturelover', '#outdoors', '#naturephotography', '#wilderness'],
                ['#naturelovers', '#getoutside', '#exploremore', '#adventuretime', '#naturegram'],
                ['#intonature', '#outdoorlife', '#scenic', '#landscapephotography', '#earthpix']
            ],
            'facebook': [
                ['#Nature', '#OutdoorLife', '#NatureLovers', '#FreshAir', '#PeacefulPlace'],
                ['#NatureTherapy', '#Outdoors', '#BeautifulNature', '#Explore', '#Adventure'],
                ['#NaturePhotography', '#Scenic', '#Wilderness', '#GetOutside', '#NaturalBeauty']
            ],
            'linkedin': [
                ['#WorkLifeBalance', '#Mindfulness', '#Productivity', '#WellBeing', '#Leadership'],
                ['#SelfCare', '#MentalHealth', '#Success', '#ProfessionalDevelopment', '#Motivation'],
                ['#StrategicThinking', '#Creativity', '#Innovation', '#GrowthMindset', '#Performance']
            ]
        }
    },
    'people': {
        'keywords': ['people', 'person', 'face', 'portrait', 'selfie', 'group', 'friends', 'family'],
        'captions': {
            'instagram': [
                "💫 Living my best life with the best people ✨ Creating memories that last forever",
                "😊 Surrounded by love and good vibes 💕 These are the moments that matter",
                "🌟 Squad goals achieved 🎉 Making every moment count with amazing people"
            ],
            'facebook': [
                "Blessed to have these incredible people in my life! 💕 Who's your favorite person to spend time with?",
                "Making memories with the ones who matter most 😊 Feeling grateful for good company and great times!",
                "Life is better with friends like these! 🌟 Cheers to more adventures together"
            ],
            'linkedin': [
                "Great teams drive great results 💼 Collaboration and connection are key to success",
                "Networking and building meaningful professional relationships 🤝 Together we achieve more",
                "The power of teamwork and shared vision 🎯 Surrounding yourself with excellence breeds excellence"
            ]
        },
        'hashtags': {
            'instagram': [
                ['#friends', '#friendship', '#goodvibes', '#memories', '#blessed'],
                ['#squadgoals', '#besties', '#friendshipgoals', '#together', '#happy'],
                ['#friendship', '#lovemypeople', '#grateful', '#positivevibes', '#goodtimes']
            ],
            'facebook': [
                ['#Friends', '#Blessed', '#GoodTimes', '#Memories', '#Grateful'],
                ['#Friendship', '#Community', '#Together', '#FamilyAndFriends', '#LifeIsGood'],
                ['#BlessedLife', '#GoodCompany', '#Thankful', '#FriendshipGoals', '#HappyMoments']
            ],
            'linkedin': [
                ['#Teamwork', '#Collaboration', '#Networking', '#ProfessionalGrowth', '#Success'],
                ['#Leadership', '#TeamBuilding', '#Partnership', '#BusinessSuccess', '#Together'],
                ['#ProfessionalNetwork', '#Synergy', '#TeamSuccess', '#CollaborativeLeadership', '#Excellence']
            ]
        }
    },
    'food': {
        'keywords': ['food', 'meal', 'dinner', 'lunch', 'breakfast', 'cooking', 'restaurant', 'delicious'],
        'captions': {
            'instagram': [
                "🍽️ Food is my love language 😋 Living for these delicious moments",
                "👨‍🍳 Made with love, eaten with joy 🥘 Food that feeds the soul",
                "🤤 Foodie life is the best life 🍴 Every meal is an experience"
            ],
            'facebook': [
                "Treating myself to something delicious today! 😋 What's your favorite comfort food?",
                "Good food = Good mood! 🍽️ Sharing this amazing meal and grateful for every bite",
                "Foodie adventures continue! 👨‍🍳 There's nothing like a great meal to bring people together"
            ],
            'linkedin': [
                "Business meetings over good food build stronger partnerships 🍽️ #Networking",
                "Work-life balance includes enjoying great meals ☕ Take time to savor the moments",
                "Food brings people together - lessons in hospitality and client relations 🤝 #BusinessEtiquette"
            ]
        },
        'hashtags': {
            'instagram': [
                ['#foodie', '#foodporn', '#delicious', '#foodstagram', '#yummy'],
                ['#foodlover', '#instafood', '#foodphotography', '#foodgasm', '#tasty'],
                ['#foodblogger', '#foodiesofinstagram', '#foodheaven', '#eatgood', '#foodlove']
            ],
            'facebook': [
                ['#Foodie', '#Delicious', '#FoodLover', '#GoodFood', '#Yummy'],
                ['#FoodTime', '#TastyFood', '#FoodPorn', '#EatingGood', '#FoodLife'],
                ['#FoodPhotography', '#ComfortFood', '#FoodHeaven', '#EatWell', '#FoodAdventures']
            ],
            'linkedin': [
                ['#BusinessLunch', '#Networking', '#ClientMeeting', '#WorkLifeBalance', '#Hospitality'],
                ['#BusinessDinner', '#ProfessionalNetworking', '#ClientRelations', '#Partnership', '#Success'],
                ['#CorporateCulture', '#TeamBuilding', '#BusinessEtiquette', '#Collaboration', '#Leadership']
            ]
        }
    },
    'default': {
        'keywords': [],
        'captions': {
            'instagram': [
                "✨ Living in the moment and loving every second 💫 What makes you smile today?",
                "📸 Captured a piece of today's magic ✨ Life is beautiful in unexpected ways",
                "🌟 Creating my own sunshine ☀️ Grateful for this journey"
            ],
            'facebook': [
                "Sharing a moment from today! 😊 What's been the best part of your day?",
                "Taking time to appreciate the little things 💕 Life is full of beautiful moments",
                "Having a great day! 🌟 Hope everyone else is having an amazing day too!"
            ],
            'linkedin': [
                "Professional insight: Every experience is an opportunity for growth 📈 #CareerDevelopment",
                "Reflecting on today's achievements and tomorrow's possibilities 🎯 #ProfessionalGrowth",
                "Finding inspiration in everyday moments 💡 What drives your professional passion?"
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
        }
    }
}

def analyze_image_content(image_data, text):
    """Analyze image content based on text keywords and return context"""
    if not image_data:
        return {'type': 'default'}
    
    # Combine text for analysis
    combined_text = text.lower()
    
    # Check for image content patterns
    detected_patterns = []
    for pattern_name, pattern_data in IMAGE_PATTERNS.items():
        if pattern_name == 'default':
            continue
        # Check if any keywords match
        for keyword in pattern_data['keywords']:
            if keyword in combined_text:
                detected_patterns.append(pattern_name)
                break
    
    # Return the first detected pattern or default
    if detected_patterns:
        return {'type': detected_patterns[0]}
    return {'type': 'default'}

def generate_contextual_captions(text, image_context):
    """Generate captions based on image context"""
    context_type = image_context.get('type', 'default')
    pattern = IMAGE_PATTERNS.get(context_type, IMAGE_PATTERNS['default'])
    
    return pattern['captions']

def generate_contextual_hashtags(image_context):
    """Generate hashtags based on image context"""
    context_type = image_context.get('type', 'default')
    pattern = IMAGE_PATTERNS.get(context_type, IMAGE_PATTERNS['default'])
    
    return pattern['hashtags']

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """Intelligent analysis endpoint - analyzes image content and generates relevant captions"""
    try:
        data = request.json
        text = data.get('text', '')
        image_data = data.get('image', '')
        has_image = bool(image_data)
        
        # Analyze image content using keywords detection
        image_context = analyze_image_content(image_data, text) if has_image else {}
        
        # Generate context-aware captions based on image analysis
        captions = generate_contextual_captions(text, image_context)
        hashtags = generate_contextual_hashtags(image_context)
        
        # Generate mock response
        response = {
            'decision': 'approved' if random.random() > 0.2 else 'rejected',
            'confidence': round(random.uniform(0.75, 0.95), 2),
            'captions': captions,
            'hashtags': hashtags,
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
