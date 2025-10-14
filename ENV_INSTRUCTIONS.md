# Environment Setup Instructions

Create a `.env` file in the exam_backend folder with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://jaikumarpalimara_db_user:F63pDCZ6rvTYFy3J@cluster0.7duczkv.mongodb.net/exam_portal?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (Change this to a secure random string in production)
JWT_SECRET=exam_portal_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**Note:** The .env file is gitignored for security. Use this template to create your .env file.

