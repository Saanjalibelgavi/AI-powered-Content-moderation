# Database Setup

## Overview
The application uses SQLite database for storing user authentication data (email and password).

## Database Details

### Technology Stack
- **Database**: SQLite (local file-based database)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Password Hashing**: Werkzeug Security (PBKDF2 SHA-256)

### Database File
- **Location**: `backend/users.db`
- **Created automatically**: When the Flask app starts for the first time

## User Model

The `User` model stores:
- `id`: Unique identifier (Primary Key)
- `email`: User's email address (Unique, Indexed)
- `password_hash`: Securely hashed password (never stores plain text)
- `created_at`: Account creation timestamp
- `last_login`: Last successful login timestamp

## API Endpoints

### 1. User Registration
```
POST /api/auth/signup
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-11-10T12:00:00",
    "last_login": null
  }
}
```

**Error Responses:**
- `400`: Email and password required / Password too short
- `409`: Email already registered
- `500`: Registration failed

### 2. User Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-11-10T12:00:00",
    "last_login": "2025-11-10T14:30:00"
  }
}
```

**Error Responses:**
- `400`: Email and password required
- `401`: Invalid email or password
- `500`: Login failed

### 3. Get All Users (Admin/Testing)
```
GET /api/auth/users
```
**Success Response (200):**
```json
{
  "count": 2,
  "users": [
    {
      "id": 1,
      "email": "user1@example.com",
      "created_at": "2025-11-10T12:00:00",
      "last_login": "2025-11-10T14:30:00"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "created_at": "2025-11-10T13:00:00",
      "last_login": null
    }
  ]
}
```

## Security Features

### Password Hashing
- Passwords are **never stored in plain text**
- Uses Werkzeug's `generate_password_hash()` with PBKDF2 SHA-256
- Salt is automatically generated for each password
- Hash verification done with `check_password_hash()`

### Validation
- Email uniqueness enforced at database level
- Minimum password length: 6 characters
- Email addresses normalized (lowercase, trimmed)

## Frontend Integration

### Auth Service (`src/services/authService.js`)
Provides methods for:
- `signup(email, password)`: Register new user
- `login(email, password)`: Authenticate user
- `logout()`: Clear user session
- `getCurrentUser()`: Get logged-in user
- `isAuthenticated()`: Check if user is logged in

### Session Storage
User data is stored in browser's `sessionStorage` after successful login/signup:
```javascript
sessionStorage.setItem('user', JSON.stringify(userData));
```

## Database Management

### View Database Contents
You can use SQLite browser tools or Python to view the database:

```python
import sqlite3

conn = sqlite3.connect('users.db')
cursor = conn.cursor()
cursor.execute('SELECT id, email, created_at, last_login FROM users')
print(cursor.fetchall())
conn.close()
```

### Reset Database
To reset the database (delete all users):
1. Stop the backend server
2. Delete `backend/users.db` file
3. Restart the backend server (database will be recreated empty)

## Testing the Database

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

### View All Users
```bash
curl http://localhost:5000/api/auth/users
```

## File Structure
```
backend/
├── app_simple.py          # Flask app with auth endpoints
├── database.py            # Database models and initialization
├── users.db              # SQLite database file (auto-created)
├── requirements.txt       # Python dependencies
└── venv/                 # Virtual environment
```

## Dependencies
```
flask==3.0.0
flask-cors==4.0.0
flask-sqlalchemy==3.1.1
werkzeug==3.0.1
```

## Migration to Production

For production deployment, consider:
1. **PostgreSQL or MySQL** instead of SQLite for better concurrency
2. **JWT tokens** for stateless authentication
3. **Password strength requirements** (uppercase, numbers, special chars)
4. **Email verification** before account activation
5. **Rate limiting** on auth endpoints
6. **HTTPS only** for secure transmission
7. **Session management** with expiration
8. **Two-factor authentication (2FA)** for enhanced security
