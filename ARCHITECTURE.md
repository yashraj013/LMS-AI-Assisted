# AI Study Workspace - Architecture Document

**Tech Stack**: React + Vite | Node.js + Express | MongoDB | Grok API

---

## 1. System Overview

The AI Study Workspace is a full-stack learning platform built with modern, lightweight technologies. It enables students to view lessons, track progress, and interact with an AI assistant (powered by Grok API) for educational support.

### Core Objectives
- Build a minimal Learning Workspace demonstrating full-stack capabilities
- Focus on clean code, thoughtful engineering decisions, and problem-solving
- Create a responsive, user-friendly interface
- Implement intelligent AI-powered question answering

### Key Users
- **Students**: View lessons, track completion, ask AI questions
- **Admins**: Manage modules and lesson content

---

## 2. High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                        │
│              (React + Vite - Port 5173)                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │  Dashboard   │ │ Lesson       │ │  AI Chat     │   │
│  │  Component   │ │  Viewer      │ │  Assistant   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└────────────────────────────────────────────────────────┘
                         ↓ (HTTP/REST)
┌────────────────────────────────────────────────────────┐
│                   BACKEND LAYER                         │
│         (Node.js + Express - Port 5000)                │
│  ┌────────────────────────────────────────────────────┐│
│  │  Routes / Controllers / Middleware                 ││
│  │  ┌──────────────┐ ┌──────────────┐               ││
│  │  │ Auth Service │ │ Lesson Mgmt  │               ││
│  │  └──────────────┘ └──────────────┘               ││
│  │  ┌──────────────┐ ┌──────────────┐               ││
│  │  │ Progress API │ │ Grok AI      │               ││
│  │  │              │ │ Integration  │               ││
│  │  └──────────────┘ └──────────────┘               ││
│  └────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
                         ↓ (MongoDB Driver)
┌────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│              (MongoDB Atlas / Local)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   Users      │ │   Modules &  │ │  Progress &  │   │
│  │              │ │   Lessons    │ │  Chat        │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└────────────────────────────────────────────────────────┘
                         ↓ (API Call)
┌────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│                  (Grok API)                            │
│  Intelligent question answering powered by xAI        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture (React + Vite)

### 3.1 Project Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── LessonPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ModuleCard.jsx
│   │   │   ├── ProgressOverview.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── LessonViewer/
│   │   │   ├── LessonViewer.jsx
│   │   │   ├── ContentRenderer.jsx
│   │   │   ├── MarkdownRenderer.jsx
│   │   │   └── CompletionButton.jsx
│   │   ├── LessonProgress/
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── LessonList.jsx
│   │   ├── AIAssistant/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   └── Auth/
│   │       ├── LoginForm.jsx
│   │       ├── RegisterForm.jsx
│   │       └── ProtectedRoute.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useLessons.js
│   │   ├── useProgress.js
│   │   ├── useChat.js
│   │   └── useFetch.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   ├── services/
│   │   ├── api.js (Axios instance)
│   │   ├── authService.js
│   │   ├── lessonService.js
│   │   ├── progressService.js
│   │   └── assistantService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── responsive.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vite.config.js
├── package.json
└── index.html
```

### 3.2 Key Features

**1. Dashboard Component**
- Display all available modules
- Show student progress overview
- Recently accessed lessons
- Quick stats (completion %, lessons completed)

**2. Lesson Viewer Component**
- Render lesson content (markdown)
- Display video embeds if available
- Syntax highlighting for code snippets
- Mark lesson as complete
- Navigate between lessons

**3. Progress Tracking UI**
- Visual progress bar per module
- Lesson completion status
- Persistent progress updates

**4. AI Assistant Chat Interface**
- Real-time chat with Grok API
- Context-aware questions (includes lesson_id)
- Message history display
- Loading states and error handling
- Responsive chat window

**5. Authentication**
- Login/Register pages
- JWT token management
- Protected routes
- Persistent login (localStorage)

### 3.3 Tech Stack Specifics

**Framework & Build**: React 18+ with Vite
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds
- Native ES modules support

**Styling**:
- Tailwind CSS (utility-first approach)
- Custom CSS variables for theming
- Responsive design (mobile-first)
- Dark mode support (optional)

**HTTP Client**: Axios with interceptors
- Automatic token refresh
- Error handling wrapper
- Base URL configuration

**State Management**: Context API + useReducer
- Lightweight and sufficient for this scope
- Avoid prop drilling with Context

**Markdown Rendering**: react-markdown + remark plugins
- Safe HTML rendering
- Code syntax highlighting (remark-gfm)
- GitHub Flavored Markdown support

**Testing**: Vitest + React Testing Library
- Unit tests for hooks
- Component tests for UI
- Integration tests for user flows

---

## 4. Backend Architecture (Node.js + Express)

### 4.1 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── grokConfig.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── moduleModel.js
│   │   ├── lessonModel.js
│   │   ├── progressModel.js
│   │   └── chatHistory.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── lessonController.js
│   │   ├── moduleController.js
│   │   ├── progressController.js
│   │   └── assistantController.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── lessonRoute.js
│   │   ├── moduleRoute.js
│   │   ├── progressRoute.js
│   │   ├── assistantRoute.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   ├── cors.js
│   │   └── rateLimit.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── lessonService.js
│   │   ├── progressService.js
│   │   ├── grokService.js
│   │   └── emailService.js (optional)
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js
│   │   ├── errorHandler.js
│   │   └── helpers.js
│   ├── seeders/ (optional)
│   │   └── seedDatabase.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### 4.2 Core Modules

#### Authentication Module
```javascript
// Routes
POST   /api/auth/register        # Register new user
POST   /api/auth/login          # Login user
POST   /api/auth/refresh        # Refresh JWT token
POST   /api/auth/logout         # Logout user
GET    /api/auth/me             # Get current user

// Implementation
- bcryptjs for password hashing
- jsonwebtoken for JWT generation
- Refresh token rotation pattern
```

#### Module Management
```javascript
// Routes
GET    /api/modules             # Get all modules with basic info
GET    /api/modules/:id         # Get module with all lessons
POST   /api/modules             # Create module (admin)
PUT    /api/modules/:id         # Update module (admin)
DELETE /api/modules/:id         # Delete module (admin)

// Features
- Module listing with pagination
- Lesson count display
- Module metadata (description, order)
```

#### Lesson Management
```javascript
// Routes
GET    /api/lessons/:id         # Get single lesson
GET    /api/lessons/:id/content # Get full lesson content
POST   /api/lessons             # Create lesson (admin)
PUT    /api/lessons/:id         # Update lesson (admin)
DELETE /api/lessons/:id         # Delete lesson (admin)

// Features
- Markdown content storage
- Optional video URLs
- Lesson ordering within modules
```

#### Progress Tracking
```javascript
// Routes
GET    /api/progress/:userId    # Get all progress for user
GET    /api/progress/:userId/module/:moduleId
POST   /api/progress/mark-complete
PUT    /api/progress/:progressId

// Features
- Track completion status
- Record completion timestamp
- Calculate progress percentage
- Return progress stats
```

#### AI Assistant Integration (Grok API)
```javascript
// Routes
POST   /api/assistant/ask
  Input: {
    "lesson_id": "60d7a5f5c7d8e1a2b3c4d5e6",
    "question": "What is this concept?",
    "message_history": [
      { role: "user", content: "..." },
      { role: "assistant", content: "..." }
    ]
  }

  Response: {
    "success": true,
    "answer": "...",
    "sources": ["lesson:60d7a5f5c7d8e1a2b3c4d5e6"],
    "timestamp": "2024-01-15T10:30:00Z"
  }

// Implementation
- Call Grok API with lesson context
- Stream responses for better UX
- Error handling and retry logic
- Rate limiting per user
```

### 4.3 Middleware Stack

```javascript
app.use(cors(corsOptions));                 // CORS handling
app.use(express.json({ limit: '10mb' }));  // JSON parsing
app.use(express.urlencoded({ limit: '10mb' })); // Form parsing
app.use(rateLimit);                         // Rate limiting
app.use(requestLogger);                     // Request logging
app.use('/api/*', authMiddleware);          // Protected routes
app.use(errorHandler);                      // Global error handling
```

### 4.4 Error Handling Strategy

```javascript
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

---

## 5. Database Architecture (MongoDB)

### 5.1 Collections Schema

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  role: String (enum: ['student', 'admin']),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}

// Modules Collection
{
  _id: ObjectId,
  title: String,
  description: String,
  order: Number,
  totalLessons: Number,
  createdAt: Date,
  updatedAt: Date
}

// Lessons Collection
{
  _id: ObjectId,
  moduleId: ObjectId (ref: Modules),
  title: String,
  description: String,
  markdownContent: String,
  videoUrl: String (optional),
  order: Number,
  estimatedDuration: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}

// StudentProgress Collection
{
  _id: ObjectId,
  studentId: ObjectId (ref: Users),
  lessonId: ObjectId (ref: Lessons),
  completed: Boolean,
  completedAt: Date (optional),
  lastAccessed: Date,
  createdAt: Date,
  updatedAt: Date
}

// ChatHistory Collection
{
  _id: ObjectId,
  studentId: ObjectId (ref: Users),
  lessonId: ObjectId (ref: Lessons),
  question: String,
  answer: String,
  grokMetadata: {
    requestId: String,
    model: String,
    tokens: Number
  },
  createdAt: Date
}
```

### 5.2 Indexes for Performance

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Modules
db.modules.createIndex({ order: 1 });
db.modules.createIndex({ createdAt: -1 });

// Lessons
db.lessons.createIndex({ moduleId: 1 });
db.lessons.createIndex({ moduleId: 1, order: 1 });
db.lessons.createIndex({ createdAt: -1 });

// Progress
db.progress.createIndex({ studentId: 1 });
db.progress.createIndex({ lessonId: 1 });
db.progress.createIndex({ studentId: 1, lessonId: 1 }, { unique: true });
db.progress.createIndex({ completed: 1, studentId: 1 });

// ChatHistory
db.chatHistory.createIndex({ studentId: 1, createdAt: -1 });
db.chatHistory.createIndex({ lessonId: 1 });
```



### 6.3 Environment Configuration

```env
# .env.example
# Grok API Configuration
GROK_API_KEY=your_grok_api_key_here
GROK_MODEL=grok-1
GROK_API_TIMEOUT=30000

# Rate limiting for Grok calls
GROK_RATE_LIMIT=100 # requests per hour
```

---

## 7. API Endpoints Reference

### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Module Endpoints
```
GET    /api/modules
GET    /api/modules/:id
POST   /api/modules (admin)
PUT    /api/modules/:id (admin)
DELETE /api/modules/:id (admin)
```

### Lesson Endpoints
```
GET    /api/lessons/:id
GET    /api/lessons/:id/content
POST   /api/lessons (admin)
PUT    /api/lessons/:id (admin)
DELETE /api/lessons/:id (admin)
```

### Progress Endpoints
```
GET    /api/progress/:userId
GET    /api/progress/:userId/module/:moduleId
POST   /api/progress/mark-complete
PUT    /api/progress/:progressId
```

### AI Assistant Endpoints
```
POST   /api/assistant/ask
GET    /api/assistant/history
GET    /api/assistant/history/:lessonId
```

---

## 8. Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "60d7a5f5c7d8e1a2b3c4d5e6",
    "name": "JavaScript Basics",
    "email": "student@example.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": []
  }
}
```

### AI Assistant Response
```json
{
  "success": true,
  "data": {
    "answer": "JavaScript is a programming language...",
    "sources": ["lesson:60d7a5f5c7d8e1a2b3c4d5e6"],
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 9. Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)
- Grok API key (from xAI)

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Study Workspace
```

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-study-workspace

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Grok API
GROK_API_KEY=your_grok_api_key_here
GROK_MODEL=grok-1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Installation & Setup

**Backend**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if local)
# mongod

# Run development server
npm run dev

# Backend will be available at http://localhost:5000
```

**Frontend**
```bash
# In new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

### Database Seeding (Optional)

```bash
# Seed sample data
npm run seed

# This will create:
# - Sample modules and lessons
# - Test user accounts
# - Sample progress records
```

---

## 10. Deployment Guide

### Frontend Deployment (Vercel / Netlify)

**Vercel Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Build & Deploy Files**
```bash
npm run build  # Creates dist folder
# Deploy dist folder to Vercel
```

**Environment Variables in Vercel**
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Render / Railway / Heroku)

**Using Render**
1. Push code to GitHub
2. Connect repository to Render
3. Create Web Service
4. Set environment variables in Render dashboard
5. Deploy

**Environment Variables to Set**
```
PORT=10000
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=production_secret
GROK_API_KEY=your_grok_key
CORS_ORIGIN=your_frontend_url
NODE_ENV=production
```

**Database Deployment (MongoDB Atlas)**
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Add to MONGODB_URI in backend

---

## 11. Performance Optimization

### Frontend Optimization
- Code splitting with Vite
- Lazy loading for routes
- Image optimization
- Minimize bundle size
- Caching strategies

### Backend Optimization
- Database query optimization with indexes
- Connection pooling for MongoDB
- Rate limiting to prevent abuse
- Async/await for non-blocking operations

### Grok API Optimization
- Cache responses for common questions
- Implement request batching
- Rate limiting per user
- Handle timeouts gracefully

---

## 12. Security Best Practices

### Authentication & Authorization
- Use bcryptjs for password hashing
- JWT with secure signing
- Refresh token rotation
- CORS properly configured
- HTTPS only in production

### Data Protection
- Validate and sanitize all inputs
- Prevent XSS attacks
- Secure password requirements

### API Security
- Rate limiting on sensitive endpoints
- API key management (environment variables)
- Validate request body schemas
- CORS whitelist frontend URL
- Content Security Policy headers

### Grok API Key Security
- Never commit API key to git
- Use environment variables
- Rotate keys periodically
- Monitor API usage
- Implement request signing if available

---

## 13. Testing Strategy

### Backend Testing
```bash
# Unit tests for services
npm run test:unit

# Integration tests for routes
npm run test:integration

# Coverage report
npm run test:coverage
```

### Frontend Testing
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 14. Monitoring & Logging

### Backend Logging
```javascript
// Winston logger setup
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// In development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Error Tracking
- Sentry (optional) for error monitoring
- Logging API requests and responses
- Monitor Grok API usage and errors

---

## 15. Project Timeline

### Week 1: Setup & Core Backend
- [ ] Project setup (React + Vite, Node + Express)
- [ ] MongoDB connection and schema
- [ ] User authentication (register/login)
- [ ] Basic CRUD for modules and lessons

### Week 2: Frontend & Progress Tracking
- [ ] Dashboard component
- [ ] Lesson viewer with markdown
- [ ] Progress tracking API
- [ ] Progress UI components

### Week 3: AI Integration & Polish
- [ ] Grok API integration
- [ ] Chat interface component
- [ ] Error handling and validation
- [ ] Testing and bug fixes

### Week 4: Deployment & Documentation
- [ ] Production deployment setup
- [ ] Documentation completion
- [ ] Performance optimization
- [ ] Final testing and polish

---

## 16. Code Quality Standards

### Naming Conventions
- **Variables**: camelCase (`studentId`, `lessonTitle`)
- **Constants**: UPPER_SNAKE_CASE (`API_TIMEOUT`, `MAX_RETRIES`)
- **Classes/Schemas**: PascalCase (`User`, `Lesson`, `Progress`)
- **Files**: kebab-case for components (`lesson-viewer.jsx`), camelCase for utils (`apiClient.js`)

### Best Practices
- ES6+ features (const/let, arrow functions, destructuring)
- Async/await over callbacks
- Error handling with try-catch
- Input validation on all endpoints
- DRY principle - avoid code repetition
- Meaningful commit messages
- Comments for complex logic only

### Code Organization
- Separate concerns (controllers, services, models)
- Reusable utility functions
- Custom hooks in React
- Middleware for cross-cutting concerns

---

## 17. Troubleshooting Common Issues

### MongoDB Connection Issues
```javascript
// Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database

// Enable debug logging
mongoose.set('debug', true);
```

### Grok API Errors
```javascript
// Handle rate limiting
if (error.status === 429) {
  // Wait and retry
  setTimeout(() => retry(), 5000);
}

// Handle authentication
if (error.status === 401) {
  // Check API key
  console.log('Invalid API key');
}
```

### CORS Issues
```javascript
// Configure CORS properly
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

### Vite HMR Issues
```javascript
// vite.config.js
export default {
  server: {
    hmr: {
      host: 'localhost',
      port: 5173
    }
  }
}
```

---

## 18. Key Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.x",
    "react-markdown": "^8.x",
    "tailwindcss": "^3.x",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "vite": "^4.x",
    "@vitejs/plugin-react": "^4.x",
    "vitest": "^0.x",
    "@testing-library/react": "^14.x"
  }
}
```

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^7.x",
    "axios": "^1.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "dotenv": "^16.x",
    "cors": "^2.x",
    "express-rate-limit": "^6.x"
  },
  "devDependencies": {
    "nodemon": "^2.x",
    "jest": "^29.x",
    "supertest": "^6.x"
  }
}
```

---

## 19. Resources & Documentation

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Grok API Documentation](https://docs.x.ai/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 20. Submission Checklist

- [ ] **GitHub Repository**: Well-structured with clear commit history
- [ ] **Functionality**: All 5 features working (Dashboard, Viewer, Progress, AI, APIs)
- [ ] **Live Deployment**: Frontend and Backend accessible via URLs
- [ ] **Code Quality**: Clean, readable, well-documented
- [ ] **Database**: Proper schema, indexes, and relationships
- [ ] **API Design**: RESTful, consistent, properly documented
- [ ] **Frontend UI**: Responsive, user-friendly, no console errors
- [ ] **Error Handling**: Graceful error messages and fallbacks
- [ ] **AI Integration**: Grok API working, context-aware responses
- [ ] **Documentation**: README with setup, architecture, tech stack
- [ ] **Testing**: Unit or integration tests included
- [ ] **README**: All required sections (Overview, Tech Stack, Setup, API Docs, Decisions)

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Status**: Ready for Development

---

## Quick Start Reference

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev  # runs on http://localhost:5000

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev  # runs on http://localhost:5173

# Terminal 3: MongoDB
mongod  # if running locally

# Then access the app at http://localhost:5173
```

Good luck with your submission! 🚀