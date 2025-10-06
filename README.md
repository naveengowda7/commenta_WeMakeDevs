# Commenta - AI-Powered YouTube Comment Analysis Platform

**A microservices-based platform that helps YouTube creators understand their audience through advanced AI sentiment analysis and natural language querying.**

---


## 🎥 Demo Video

Watch our project demonstration:

[![Commenta Demo Video](https://img.youtube.com/vi/XNeTzrOe6lY/maxresdefault.jpg)](https://www.youtube.com/watch?v=XNeTzrOe6lY&feature=youtu.be)

*Click the image above to watch the full demo on YouTube*

Or watch directly: [https://www.youtube.com/watch?v=XNeTzrOe6lY](https://www.youtube.com/watch?v=XNeTzrOe6lY)

---

- **backend** - [github.com/team/commenta-backend](https://github.com/naveengowda7/commenta_backend)

## 🎯 Project Overview

Commenta is an intelligent comment analytics platform built to help YouTube content creators gain deep insights from their video comments. Using AI-powered sentiment analysis and a conversational AI agent, creators can understand viewer sentiment, identify trends, spot controversial topics, and engage with their community more effectively.

### Key Features

- **OAuth Authentication** - Secure YouTube OAuth 2.0 integration
- **Real-time Comment Fetching** - Automatically fetch all comments from any YouTube video
- **AI Sentiment Analysis** - Analyze comments for:
  - Sentiment (Positive/Negative/Neutral)
  - Questions that need answers
  - Suggestions for improvement
  - Controversial comments
  - Hilarious reactions
- **Natural Language AI Agent** - Chat with an AI that understands your comments and can answer questions in plain English
- **Real-time Progress Updates** - WebSocket-based live updates during fetching and analysis
- **Beautiful Dashboard** - React-based frontend with comprehensive analytics
- **Email Notifications** - Get notified when analysis completes

---

## 🏗️ Architecture

Commenta follows a **microservices architecture** with 6 independent services:
                                                                ```
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                      Frontend (React)                       │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                        Service Layer                        │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                      Auth Service                           │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                   Comment Fetcher Service                   │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                   AI Analytics Service                      │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                      AI Agent Service                       │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                       MCP Gateway                           │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                                              ↓
                                                                ┌─────────────────────────────────────────────────────────────┐
                                                                │                     DB Ops Service                          │
                                                                └─────────────────────────────────────────────────────────────┘
                                                                ```
### Service Breakdown

#### 1. **Auth Service** (Port 4000)
- Handles YouTube OAuth 2.0 flow
- JWT token generation and verification
- User session management
- Communicates with YouTube API for channel information

#### 2. **Comment Fetcher Service** (Port 4001)
- Fetches comments from YouTube videos (100 per batch)
- Handles pagination and rate limiting
- Stores raw comments in database
- Queues comments for AI analysis via BullMQ
- **WebSocket Server** - Broadcasts real-time fetch progress

#### 3. **AI Analytics Service** (Port 4002)
- Consumes comment batches from BullMQ queue
- Uses **Cerebras AI** (Qwen 3 235B model) for sentiment analysis
- Analyzes comments for sentiment, questions, suggestions, etc.
- Queues results for database storage
- **WebSocket Server** - Broadcasts analysis progress
- **Email Service** - Sends completion notifications via Gmail

#### 4. **DB Ops Service** (Port 5000)
- Central database operations hub
- Provides REST API for all CRUD operations
- **BullMQ Workers**:
  - `userWorker` - Processes user creation from OAuth
  - `analysisWorker` - Stores sentiment analysis results
- Prisma ORM for type-safe database access

#### 5. **AI Agent Service** (Port 4003)
- Natural language interface for querying comment data
- Uses **Cerebras AI with function calling**
- Communicates with MCP Gateway for data retrieval
- Saves conversation history

#### 6. **MCP Gateway** (Port 5001)
- **Model Context Protocol** implementation
- Exposes tools/functions that AI can call:
  - `get_sentiment_breakdown` - Sentiment statistics
  - `get_top_comments` - Filter by type (positive/negative/controversial)
  - `search_comments` - Keyword search
  - `get_top_likes` - Most liked comments
  - `get_top_replies` - Most replied comments
- Fetches data from DB Ops Service and returns to AI Agent

---

## 🤖 How MCP Gateway Works

The **MCP (Model Context Protocol) Gateway** is the bridge between the AI Agent and your database. Here's the detailed flow:

### Step-by-Step MCP Flow
1. User Interaction:  
The user types: "Show me the most controversial comments"

2. AI Agent Receives the Query:  
The AI Agent (Port 4003) receives the request.

3. Cerebras AI Tool Invocation:  
The AI Agent sends the query to Cerebras AI, which responds with:

```
{
  "tool_calls": [{
    "function": {
      "name": "get_top_comments",
      "arguments": {
        "videoId": "abc123",
        "type": "controversial"
      }
    }
  }]
}
```
4. MCP Gateway Request:   
The AI Agent calls the MCP Gateway (Port 5001) with:
```
http
POST /tools/get_top_comments
Body: {
  "videoId": "abc123",
  "type": "controversial"
}
```
5. Database Query:   
MCP Gateway forwards the request to DB Ops Service (Port 5000):
```
http
GET /analysis/video/abc123
```
6. Data Retrieval & Filtering:   
DB Ops Service fetches analysis data from PostgreSQL.

MCP Gateway filters for controversial comments.

7. Return to AI Agent:   
MCP Gateway sends the filtered results back to the AI Agent.

8. Cerebras AI Formats Response:   
Cerebras AI generates a human-friendly message:

9. Frontend Display:   
The final response is sent to the user interface for display.

### Why MCP?

The MCP Gateway pattern provides:   
- **Separation of Concerns** - AI logic separated from data access
- **Reusability** - Same tools can be used by multiple AI agents
- **Security** - Database queries controlled and validated
- **Flexibility** - Easy to add new tools without changing AI code
- **Scalability** - MCP Gateway can be scaled independently

---

## 🔄 Complete Data Flow Example

### Example: User Analyzes a Video
                                                                    ```
                                                                    User logs in via OAuth
                                                                    Frontend → Auth Service → YouTube API
                                                                    
                                                                                ↓ (JWT token returned)
                                                                    
                                                                    User enters video ID "dQw4w9WgXcQ"
                                                                    Frontend → Comment Fetcher Service
                                                                    
                                                                                ↓
                                                                    
                                                                    Comment Fetcher starts fetching
                                                                    
                                                                    Calls YouTube API (100 comments/request)
                                                                    Saves to DB via DB Ops Service
                                                                    Adds to BullMQ queue
                                                                    Broadcasts progress via WebSocket
                                                                    
                                                                                ↓
                                                                    
                                                                    AI Analytics picks up from queue
                                                                    
                                                                    Reads 60 comments at a time
                                                                    Sends to Cerebras AI for analysis
                                                                    Gets back sentiment + flags
                                                                    Queues for DB storage
                                                                    Broadcasts progress via WebSocket
                                                                    
                                                                                ↓  
                                                                    
                                                                    DB Ops Worker saves analysis
                                                                    
                                                                    Stores sentiment results
                                                                    Updates video summary
                                                                    Marks job as complete
                                                                    
                                                                                ↓
                                                                    
                                                                    Email notification sent
                                                                    
                                                                    AI Analytics sends email via Gmail
                                                                    User receives analysis completion notice
                                                                    
                                                                                ↓
                                                                    
                                                                    User asks AI: "What are people saying?"
                                                                    Frontend → AI Agent → Cerebras AI
                                                                    
                                                                                ↓
                                                                    
                                                                    AI decides to call tools
                                                                    
                                                                                ↓
                                                                    
                                                                    AI Agent → MCP Gateway → DB Ops → PostgreSQL
                                                                    
                                                                                ↓
                                                                    
                                                                    Data flows back
                                                                    
                                                                                ↓
                                                                    
                                                                    Cerebras AI generates friendly response
                                                                    
                                                                                ↓
                                                                    
                                                                    User sees: "Most viewers love it! 75% positive sentiment..."
                                                                    ```
---

## 🛠️ Technology Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- **Axios** (API calls)
- **React Router** (Navigation)
- **Lucide React** (Icons)
- **WebSocket API** (Real-time updates)

### Backend Services
- **Node.js** + **Express.js**
- **Prisma ORM** (PostgreSQL)
- **BullMQ** (Queue management)
- **Axios** (Inter-service communication)
- **WebSocket (ws)** (Real-time communication)
- **Nodemailer** (Email)
- **JWT** (Authentication)

### AI & Infrastructure
- **Cerebras Cloud SDK** (AI inference)
  - Model: `llama-4-scout-17b-16e-instruct` (AI Agent)
  - Model: `qwen-3-235b-a22b-instruct-2507` (Sentiment Analysis)
- **PostgreSQL** (Neon - Database)
- **Redis** (Upstash - Queue & Cache)
- **YouTube Data API v3**

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)
- Redis instance (or Upstash account)
- YouTube OAuth credentials
- Cerebras API key

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/commenta.git
cd commenta
```

2. Setup Backend Services
```
Each service needs its own .env file with these variables:
# Shared across all services
DATABASE_URL=postgresql://...
REDIS_HOST=your-redis-host
REDIS_PORT=13298
REDIS_PASSWORD=your-redis-password
```

# Auth Service
```
PORT=4000
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/auth/callback
JWT_SECRET=your-secret-key
```

# Comment Fetcher
```
PORT=4001
DB_OPS_URL=http://localhost:5000
AUTH_SERVICE_URL=http://localhost:4000
```

# AI Analytics
```
PORT=4002
DB_OPS_URL=http://localhost:5000
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
CEREBRAS_API_KEY=your-cerebras-key
```
# AI Agent
```
PORT=4003
DB_OPS_URL=http://localhost:5000
AUTH_SERVICE_URL=http://localhost:4000
MCP_GATEWAY_URL=http://localhost:5001
CEREBRAS_API_KEY=your-cerebras-key
```
# DB Ops
```
PORT=5000
```
# MCP Gateway
```
PORT=5001
DB_OPS_URL=http://localhost:5000
```
3. Install Dependencies & Start Services

   # Install and start each service
```
cd commenta-auth-service && npm install && npm start &
cd commenta-comment-fetching && npm install && npm start &
cd commenta-ai-analytics && npm install && npm start &
cd commenta-db-ops && npm install && npx prisma generate && npm start &
cd commenta-ai-agent && npm install && npm start &
cd commenta-mcp && npm install && npm start &
```
4. Setup Frontend
```
cd commenta-frontend
npm install
npm run dev
```
```
Access at: http://localhost:5173
```
📖 API Documentation
Auth Service (4000)
```
GET /auth/login - Initiate OAuth flow
GET /auth/callback - OAuth callback handler
POST /auth/verify - Verify JWT token
POST /auth/refresh - Refresh access token
```
Comment Fetcher (4001)
```
POST /fetch - Start fetching comments (requires JWT)
GET /fetch/status/:videoId - Get fetch status
WebSocket: ws://localhost:4001
```
AI Analytics (4002)
```
WebSocket: ws://localhost:4002
```
DB Ops (5000)
Users:
```
GET /user/:userId
POST /user/create
PATCH /user/:userId/tokens
```
Videos:
```
POST /video/create
GET /video/:videoId
GET /video/user/:userId
PATCH /video/:videoId/status
```
Comments:
```
POST /comments/bulk
GET /comments/video/:videoId
GET /comments/video/:videoId/top-likes
GET /comments/video/:videoId/top-replies
```
Analysis:
```
POST /analysis/save
GET /analysis/video/:videoId
GET /analysis/summary/:videoId
POST /analysis/summary
POST /analysis/job
PATCH /analysis/job/:jobId
```
AI Agent (4003)
```
POST /chat - Chat with AI (requires JWT)
GET /chat/history/:videoId - Get conversation history
```
MCP Gateway (5001)
```
POST /tools/get_sentiment_breakdown
POST /tools/get_top_comments
POST /tools/search_comments
POST /tools/get_top_likes
POST /tools/get_top_replies
```

👥 Team
This project was built by:

Naveen Gowda MY - Full Stack Development, Architecture
Sachidanada Shivade - Backend Services, AI Integration
Manoj K - Frontend Development, UI/UX
Dharshan - DevOps, Database Design


📝 Note on Repository
This repository is a consolidated version created for project submission purposes only.
During development, each team member worked on separate repositories for their respective services. This consolidated repository was created to make it easier for evaluators and reviewers to access the complete codebase in one place.
The actual development repositories are maintained separately for:

Better collaboration and version control
Independent service deployment
Microservice architecture best practices
Individual contributor tracking

If you'd like access to the original development repositories or have any questions about the codebase, please contact any team member.

🚀 Future Enhancements

 Real-time comment reply feature
 Multi-language sentiment analysis
 Automated response suggestions
 Trend detection over time
 Competitor analysis
 Mobile app (React Native)
 Chrome extension
 Advanced analytics dashboard
 Export reports (PDF/CSV)
 Team collaboration features


📄 License
MIT License - See LICENSE file for details

🤝 Contributing
This project is currently maintained for academic/showcase purposes. If you'd like to contribute or have suggestions, please reach out to the team members.

📧 Contact
For questions or support:

Naveen Gowda MY - naveen@example.com
Project Repository - GitHub


Built with ❤️ by Team Commenta

```
This README covers everything comprehensively! Feel free to adjust the email addresses and GitHub links to your actual ones.
```
