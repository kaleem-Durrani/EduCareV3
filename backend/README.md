# 🎓 EduCare Backend API

A comprehensive school management system backend built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Complete School Management**: Students, Teachers, Classes, Parents
- **Academic Management**: Weekly Reports, Monthly Plans, Activities
- **Health Tracking**: Health metrics and medical information
- **Administrative Tools**: Fee management, Document tracking, Lost items
- **Robust Architecture**: Transaction support, Error handling, Authentication

## 🏗️ Architecture

- **Clean Architecture**: Separated routes, controllers, models, and utilities
- **Transaction Support**: MongoDB transactions for data consistency
- **Error Handling**: Comprehensive error middleware with proper status codes
- **Authentication**: JWT-based authentication with role-based access
- **No Try-Catch Hell**: Clean async handling with custom asyncHandler

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Students (11 endpoints)
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- And more...

### Classes (9 endpoints)
### Teachers (2 endpoints)
### Parents (2 endpoints)
### Reports (4 endpoints)
### Plans (5 endpoints)
### Activities (5 endpoints)
### Health (5 endpoints)
### Fees (4 endpoints)
### Documents (6 endpoints)
### And more...

**Total: 69 API endpoints**

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Built-in validation
- **Error Handling**: Custom error middleware
- **File Upload**: Multer
- **Security**: bcryptjs, CORS

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── db/            # Database connection
│   └── index.js       # Entry point
├── .env.example       # Environment template
├── .gitignore        # Git ignore rules
└── package.json      # Dependencies
```

## 🔒 Environment Variables

Required environment variables (see `.env.example`):

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

## 🎯 Key Features

### 🔄 Transaction Support
All critical operations use MongoDB transactions for data consistency.

### 🛡️ Error Handling
- Custom `ApiError` class with status codes
- Comprehensive error middleware
- No try-catch blocks in controllers
- Proper HTTP status codes

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Parent)
- Protected routes with middleware

### 📊 Data Models
- **User Management**: Students, Teachers, Parents, Admins
- **Academic**: Classes, Reports, Plans, Activities
- **Administrative**: Fees, Documents, Lost Items
- **Health**: Health metrics and medical information

## 🚀 Production Ready

- ✅ Comprehensive error handling
- ✅ Database transactions
- ✅ Security best practices
- ✅ Clean architecture
- ✅ Scalable patterns
- ✅ 69 fully functional APIs

## 📝 License

Private Project - All Rights Reserved
