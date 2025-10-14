# Exam Portal Backend API

Complete Node.js + Express.js + MongoDB backend for Online Examination Portal.

## 🚀 Features

- ✅ JWT-based Authentication
- ✅ Role-based Access Control (Admin/Candidate)
- ✅ User Management (CRUD)
- ✅ Question Management (CRUD + Bulk Upload)
- ✅ Exam Submission & Auto-scoring (+1/-1 marking)
- ✅ Result Management & Statistics
- ✅ MongoDB Integration
- ✅ RESTful API Design
- ✅ Input Validation
- ✅ Error Handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## ⚙️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file in the root directory:**

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

3. **Seed the database with sample data:**
```bash
npm run seed -i
```

## 🏃 Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - Login (Admin/Candidate)
- `GET /api/auth/me` - Get current user (Protected)

### 👥 Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 📝 Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/random` - Get 45 random questions (Candidate)
- `GET /api/questions/:id` - Get single question (Admin)
- `POST /api/questions` - Create question (Admin)
- `POST /api/questions/bulk` - Bulk create questions (Admin)
- `PUT /api/questions/:id` - Update question (Admin)
- `DELETE /api/questions/:id` - Delete question (Admin)

### 🎯 Exams & Results
- `POST /api/exams/submit` - Submit exam (Candidate)
- `GET /api/exams/results/me` - Get my results (Candidate)
- `GET /api/exams/results` - Get all results (Admin)
- `GET /api/exams/results/:id` - Get result by ID
- `GET /api/exams/statistics` - Get exam statistics (Admin)
- `DELETE /api/exams/results/:id` - Delete result (Admin)

### 🏥 Health Check
- `GET /api/health` - Check API status
- `GET /` - API information

## 🔑 Sample Login Credentials

**Admin:**
```json
{
  "userType": "Admin",
  "username": "admin",
  "password": "admin123"
}
```

**Candidate 1:**
```json
{
  "userType": "Candidate",
  "hallTicket": "2025J291234"
}
```

**Candidate 2:**
```json
{
  "userType": "Candidate",
  "hallTicket": "2025J291235"
}
```

## 📊 Database Models

### User Schema
```javascript
{
  name: String,
  email: String,
  phone: String,
  userType: 'Admin' | 'Candidate',
  username: String (Admin only),
  password: String (Admin only, hashed),
  hallTicket: String (Candidate only),
  isActive: Boolean
}
```

### Question Schema
```javascript
{
  question: String,
  options: [String] (4 options),
  correctAnswer: String,
  category: 'General' | 'Technical' | 'Aptitude' | 'Logical',
  difficulty: 'Easy' | 'Medium' | 'Hard',
  isActive: Boolean,
  createdBy: ObjectId (User)
}
```

### Result Schema
```javascript
{
  candidate: ObjectId (User),
  candidateName: String,
  hallTicket: String,
  answers: Map<String, String>,
  questions: [QuestionResult],
  totalQuestions: Number,
  attemptedQuestions: Number,
  correctAnswers: Number,
  wrongAnswers: Number,
  score: Number,
  percentage: Number,
  timeTaken: Number (seconds)
}
```

## 🎯 Scoring System

- ✅ Correct Answer: **+1 mark**
- ❌ Wrong Answer: **-1 mark**
- ⏭️ Unattempted: **0 marks**
- 📊 Total Questions: **45**
- ⏱️ Time Limit: **90 minutes**

## 🛠️ Utility Scripts

**Seed database with sample data:**
```bash
npm run seed -i
```

**Clear all data:**
```bash
npm run seed -d
```

## 🔒 Authentication Flow

1. Login with credentials
2. Receive JWT token
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

## 📝 Example API Requests

### Login (Admin)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "Admin",
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Random Questions (Candidate)
```bash
curl -X GET http://localhost:5000/api/questions/random \
  -H "Authorization: Bearer <token>"
```

### Submit Exam
```bash
curl -X POST http://localhost:5000/api/exams/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "answers": {
      "questionId1": "answer1",
      "questionId2": "answer2"
    },
    "timeTaken": 3600
  }'
```

## 🏗️ Project Structure

```
exam_backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── questionController.js
│   └── examController.js
├── middleware/
│   └── auth.js            # JWT verification
├── models/
│   ├── User.js
│   ├── Question.js
│   └── Result.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── questions.js
│   └── exams.js
├── utils/
│   └── seedData.js        # Database seeding
├── .env.example
├── .gitignore
├── package.json
├── server.js              # Main entry point
└── README.md
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | Required |
| JWT_SECRET | JWT secret key | Required |
| JWT_EXPIRE | Token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation

## 🤝 Integration with Frontend

Update your React frontend to point to: `http://localhost:5000`

Update axios base URL:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions, please refer to the documentation or contact the development team.

