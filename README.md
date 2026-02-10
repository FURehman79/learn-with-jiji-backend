# Learn with Jiji - Backend API

> AI Learning Companion Backend - VeidaLabs Software Developer Assignment

A professional, production-ready backend service that powers Jiji's intelligent search and learning resource delivery system, built with Node.js, Express, TypeScript, and Supabase.

## 🌟 Features

- ✅ RESTful API with TypeScript
- ✅ Supabase integration (Database, Auth, Storage)
- ✅ Row Level Security (RLS) implementation
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ Structured logging with Winston
- ✅ Security best practices (Helmet, CORS)
- ✅ Clean architecture (Controllers, Services, Middleware)
- ✅ Mocked AI responses for demo

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd learn-with-jiji-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get your keys
3. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

PORT=3000
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 5. Upload Sample Files to Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create a bucket called `learning-resources` (if not created by schema)
3. Upload sample files:
   - `presentations/rag-introduction.pptx`
   - `videos/rag-tutorial.mp4`
   - `presentations/ai-fundamentals.pptx`
   - `videos/ml-basics.mp4`
   - `presentations/vector-databases.pptx`

### 6. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start at `http://localhost:3000`

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### 1. Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-02-10T10:30:00.000Z",
    "service": "Learn with Jiji Backend"
  }
}
```

### 2. Ask Jiji (Main Endpoint)
```http
POST /api/v1/ask-jiji
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token> (optional)
```

**Request Body:**
```json
{
  "query": "Explain RAG"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "answer": "RAG (Retrieval-Augmented Generation) is a technique that enhances AI responses by retrieving relevant information from a knowledge base before generating an answer...",
    "resources": [
      {
        "id": "uuid-here",
        "title": "Introduction to RAG",
        "description": "Comprehensive guide explaining RAG architecture...",
        "type": "ppt",
        "url": "https://signed-url-to-resource"
      },
      {
        "id": "uuid-here",
        "title": "RAG Implementation Tutorial Video",
        "description": "Step-by-step video tutorial...",
        "type": "video",
        "url": "https://signed-url-to-video"
      }
    ],
    "query_id": "query-uuid"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "message": "Query is required",
    "code": "VALIDATION_ERROR"
  }
}
```

## 🔐 Authentication & RLS

### How Authentication Works

1. **Optional Authentication**: The `/ask-jiji` endpoint works for both authenticated and anonymous users
2. **Token-based Auth**: Include `Authorization: Bearer <token>` header for authenticated requests
3. **User Tracking**: Authenticated queries are linked to user profiles

### Row Level Security (RLS)

The application implements comprehensive RLS policies:

**Profiles Table:**
- Users can only view/update their own profiles
- Automatic profile creation on signup via trigger

**Queries Table:**
- Users can only view their own queries
- Anonymous queries (user_id = NULL) are accessible to all
- Service role can insert queries for both authenticated and anonymous users

**Resources Table:**
- All resources are publicly readable (educational content)
- Only authenticated users can create resources
- Service role has full management access

**Storage Bucket (learning-resources):**
- Public read access for all learning materials
- Authenticated users can upload new resources
- Service role has full management capabilities

### Testing Authentication

**Get Auth Token:**
```bash
# Sign up a test user in Supabase Dashboard → Authentication
# Or use Supabase client to sign up programmatically
```

**Make Authenticated Request:**
```bash
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"query": "Explain RAG"}'
```

**Make Anonymous Request:**
```bash
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG"}'
```

## 🏗️ Project Structure

```
learn-with-jiji-backend/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── controllers/
│   │   └── jijiController.ts    # Request handlers
│   ├── middlewares/
│   │   ├── auth.ts              # Authentication middleware
│   │   ├── errorHandler.ts     # Error handling & custom errors
│   │   └── validation.ts        # Input validation
│   ├── routes/
│   │   └── index.ts             # API route definitions
│   ├── services/
│   │   └── jijiService.ts       # Business logic layer
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts            # Winston logger configuration
│   └── index.ts                 # Application entry point
├── supabase/
│   └── schema.sql               # Database schema with RLS
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

1. **Input Validation**: All user inputs are validated and sanitized using express-validator
2. **RLS Policies**: Database-level security with Row Level Security
3. **No Secrets in Code**: All sensitive data in environment variables
4. **Helmet.js**: Security headers (XSS, clickjacking protection, etc.)
5. **CORS**: Configured for specific allowed origins
6. **Rate Limiting**: Can be added via express-rate-limit (future enhancement)
7. **SQL Injection Prevention**: Parameterized queries via Supabase client
8. **Error Handling**: Structured error responses without leaking sensitive info

## 🧪 Testing the API

### Using cURL

**Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Ask Jiji:**
```bash
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG"}'
```

### Using Postman

1. Import the collection (if provided) or create requests manually
2. Set base URL: `http://localhost:3000/api/v1`
3. Test endpoints as shown above

## 📊 Database Schema

### Tables

**profiles**
- `id` (UUID, PK, FK to auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**queries**
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles, nullable)
- `query_text` (TEXT)
- `response_text` (TEXT)
- `created_at` (TIMESTAMPTZ)

**resources**
- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT)
- `resource_type` (TEXT: 'ppt', 'video', 'document')
- `file_url` (TEXT)
- `keywords` (TEXT[])
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Relationships
- `queries.user_id` → `profiles.id` (nullable for anonymous users)
- `profiles.id` → `auth.users.id` (cascade delete)

## 🎯 How It Works

1. **User sends a query** → POST /api/v1/ask-jiji
2. **Validation** → Request is validated (3-500 chars, sanitized)
3. **Keyword extraction** → Service extracts keywords from query
4. **Resource search** → Searches Supabase for matching resources
5. **Response generation** → Generates mocked AI response (would be LLM in production)
6. **Query logging** → Saves query and response to database
7. **URL generation** → Creates signed URLs for resources
8. **Response** → Returns structured JSON with answer and resources

## 🚀 One Improvement with More Time

### Real AI Integration with LangChain + OpenAI

**Current Implementation:** Mocked AI responses based on keyword matching

**Proposed Enhancement:**

```typescript
// services/aiService.ts
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

class AIService {
  private llm: OpenAI;
  private vectorStore: SupabaseVectorStore;
  
  async generateRAGResponse(query: string, resources: Resource[]) {
    // 1. Generate embeddings for query
    const embeddings = new OpenAIEmbeddings();
    
    // 2. Perform semantic search in vector store
    const relevantDocs = await this.vectorStore.similaritySearch(query, 5);
    
    // 3. Create context-aware prompt
    const template = `You are Jiji, an AI learning companion...`;
    const prompt = PromptTemplate.fromTemplate(template);
    
    // 4. Generate response with LLM
    const response = await this.llm.call(
      prompt.format({ query, context: relevantDocs })
    );
    
    return response;
  }
}
```

**Benefits:**
- Semantic search using vector embeddings
- Context-aware, accurate responses
- Ability to cite specific sources
- Better handling of ambiguous queries
- Continuous learning from user interactions

**Additional Improvements:**
- **Redis caching** for frequently asked queries
- **Rate limiting** per user/IP
- **Analytics dashboard** for query insights
- **Feedback system** for response quality
- **Multi-language support**
- **GraphQL API** as alternative to REST
- **Webhooks** for real-time notifications
- **Admin panel** for content management

## 📝 Assignment Compliance Checklist

✅ Backend & Supabase
- [x] Supabase Database integration
- [x] Supabase Auth implementation
- [x] Supabase Storage usage
- [x] Row Level Security (RLS) policies

✅ API
- [x] POST /ask-jiji endpoint
- [x] Clean request/response contracts
- [x] Proper error handling
- [x] Input validation

✅ Security
- [x] RLS implementation
- [x] No secrets in code
- [x] Basic input validation
- [x] Security headers (Helmet)

✅ Data
- [x] Profiles table
- [x] Queries table
- [x] Resources table
- [x] Sample PPT file reference
- [x] Sample video file reference

✅ Deliverables
- [x] Backend code (organized, clean)
- [x] Supabase schema SQL
- [x] Comprehensive README
- [x] API documentation
- [x] Auth & RLS explanation
- [x] Future improvement proposal

## 📞 Support

For questions or issues:
- Email: ufaizan685@gmail.com
- GitHub: [https://github.com/FURehman79]
- Linkedin: [www.linkedin.com/in/faizan-ur-rehman-666661248]

## 📄 License

MIT License - VeidaLabs Assignment

---

**Built By FAIZAN UR REHMAN for VeidaLabs**
