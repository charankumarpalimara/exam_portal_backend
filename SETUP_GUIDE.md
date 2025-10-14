# 🚀 Quick Setup Guide - Exam Portal Backend

## Step 1: Install Dependencies

Open terminal in the `exam_backend` folder and run:

```bash
npm install
```

## Step 2: Create .env File

Create a file named `.env` in the `exam_backend` folder with this content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://jaikumarpalimara_db_user:F63pDCZ6rvTYFy3J@cluster0.7duczkv.mongodb.net/exam_portal?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=exam_portal_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## Step 3: Seed the Database

Populate MongoDB with sample data (admin user, candidates, and questions):

```bash
npm run seed -i
```

You should see:
```
✅ Created 3 users
✅ Created 45 questions
```

## Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server is running on port 5000
```

## Step 5: Test the API

Open your browser or Postman and visit:
```
http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "Exam Portal API is running"
}
```

## 🎉 Success! Your Backend is Ready!

### Login Credentials

**Admin Login:**
```json
{
  "userType": "Admin",
  "username": "admin",
  "password": "admin123"
}
```

**Candidate Logins:**
- Hall Ticket: `2025J291234` (John Doe)
- Hall Ticket: `2025J291235` (Jane Smith)

## 🔗 Next Steps: Connect Frontend

### Update Frontend API URL

In your React frontend (`exam2` folder), create or update the API configuration:

**Option 1: Create `exam2/src/config/api.js`**
```javascript
export const API_URL = 'http://localhost:5000/api';
```

**Option 2: Update axios default URL**
```javascript
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/api';
```

### Example: Update Login Component

```javascript
// In LoginPage.jsx
const handleLogin = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      // Navigate to dashboard
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

## 📡 Available Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Questions
- `GET /api/questions` - List questions
- `GET /api/questions/random` - Get 45 random questions (Candidate)
- `POST /api/questions` - Create question (Admin)
- `POST /api/questions/bulk` - Bulk upload (Admin)

### Exams
- `POST /api/exams/submit` - Submit exam (Candidate)
- `GET /api/exams/results/me` - My results (Candidate)
- `GET /api/exams/results` - All results (Admin)
- `GET /api/exams/statistics` - Statistics (Admin)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB URI is correct in `.env`
- Verify MongoDB Atlas allows connections from your IP
- Check internet connection

### Port Already in Use
Change PORT in `.env`:
```env
PORT=5001
```

### CORS Error in Frontend
Make sure `CLIENT_URL` in `.env` matches your frontend URL:
```env
CLIENT_URL=http://localhost:5173
```

### Can't Login
Run seed script again:
```bash
npm run seed -d  # Clear data
npm run seed -i  # Import fresh data
```

## 📝 Testing API with Postman/Thunder Client

### 1. Login (POST request)
```
URL: http://localhost:5000/api/auth/login
Method: POST
Body (JSON):
{
  "userType": "Admin",
  "username": "admin",
  "password": "admin123"
}
```

Copy the `token` from response.

### 2. Get Questions (GET request)
```
URL: http://localhost:5000/api/questions/random
Method: GET
Headers:
  Authorization: Bearer <paste_token_here>
```

### 3. Submit Exam (POST request)
```
URL: http://localhost:5000/api/exams/submit
Method: POST
Headers:
  Authorization: Bearer <paste_token_here>
Body (JSON):
{
  "answers": {
    "questionId1": "Paris",
    "questionId2": "JavaScript"
  },
  "timeTaken": 3600
}
```

## 🎯 Project Status

✅ Backend API - Complete
✅ MongoDB Integration - Complete  
✅ Authentication & Authorization - Complete
✅ User Management - Complete
✅ Question Management - Complete
✅ Exam Submission & Scoring - Complete
✅ Result Management - Complete

## 📞 Need Help?

- Check the main `README.md` for detailed documentation
- Review `ENV_INSTRUCTIONS.md` for environment setup
- All API routes are in the `routes/` folder
- Controllers are in the `controllers/` folder

---

**Happy Coding! 🚀**

