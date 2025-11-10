"""
Test script to verify database functionality
Run this after starting the backend server
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_signup():
    """Test user registration"""
    print("🧪 Testing Signup...")
    response = requests.post(
        f"{BASE_URL}/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 201

def test_login():
    """Test user login"""
    print("🧪 Testing Login...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 200

def test_wrong_password():
    """Test login with wrong password"""
    print("🧪 Testing Wrong Password...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 401

def test_get_users():
    """Test getting all users"""
    print("🧪 Testing Get All Users...")
    response = requests.get(f"{BASE_URL}/auth/users")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 200

if __name__ == "__main__":
    print("=" * 60)
    print("DATABASE FUNCTIONALITY TEST")
    print("=" * 60 + "\n")
    
    try:
        # Test signup
        signup_success = test_signup()
        
        # Test login
        login_success = test_login()
        
        # Test wrong password
        wrong_pass_success = test_wrong_password()
        
        # Test get users
        get_users_success = test_get_users()
        
        print("=" * 60)
        print("TEST RESULTS:")
        print("=" * 60)
        print(f"✅ Signup: {'PASSED' if signup_success else 'FAILED'}")
        print(f"✅ Login: {'PASSED' if login_success else 'FAILED'}")
        print(f"✅ Wrong Password: {'PASSED' if wrong_pass_success else 'FAILED'}")
        print(f"✅ Get Users: {'PASSED' if get_users_success else 'FAILED'}")
        
        if all([signup_success, login_success, wrong_pass_success, get_users_success]):
            print("\n🎉 All tests passed! Database is working correctly.")
        else:
            print("\n⚠️ Some tests failed. Check the output above.")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend server.")
        print("Make sure the backend is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
