# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Flutter    │  │   Web App    │  │   Mobile     │          │
│  │   Frontend   │  │   (React)    │  │     App      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                     HTTPS/REST API
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    API Gateway Layer                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                Express.js Server                           │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │            Middleware Stack                       │    │  │
│  │  │  • CORS                                          │    │  │
│  │  │  • Helmet (Security Headers)                    │    │  │
│  │  │  • Body Parser                                  │    │  │
│  │  │  • Compression                                  │    │  │
│  │  │  • Request Logger                               │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │              Route Handlers                       │    │  │
│  │  │  • GET  /api/health                             │    │  │
│  │  │  • POST /api/ask-jiji                           │    │  │
│  │  │  • GET  /api/history                            │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                   Application Layer                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     Controllers                            │  │
│  │  • jijiController.askJiji()                               │  │
│  │  • jijiController.getHistory()                            │  │
│  │  • jijiController.healthCheck()                           │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                           │
│  ┌────────────────────▼───────────────────────────────────────┐  │
│  │                   Middleware Layer                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │    Auth     │  │  Validation  │  │  Error Handler  │  │  │
│  │  │  Middleware │  │  Middleware  │  │   Middleware    │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                           │
│  ┌────────────────────▼───────────────────────────────────────┐  │
│  │                   Services Layer                           │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           JijiService                                 │ │  │
│  │  │  • processQuery()                                    │ │  │
│  │  │  • findRelevantResources()                          │ │  │
│  │  │  • generateMockedResponse()                         │ │  │
│  │  │  • saveQuery()                                      │ │  │
│  │  │  • getQueryHistory()                                │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                   Supabase Client SDK
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      Data Layer (Supabase)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL Database                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │   profiles   │  │  resources   │  │   queries    │    │  │
│  │  │   (users)    │  │  (learning   │  │  (history)   │    │  │
│  │  │              │  │   content)   │  │              │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                            │  │
│  │  Row Level Security (RLS) Enabled on All Tables           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Supabase Authentication                       │  │
│  │  • JWT Token Generation                                   │  │
│  │  • User Session Management                                │  │
│  │  • Password Hashing                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                Supabase Storage                            │  │
│  │  Bucket: learning-resources                               │  │
│  │  • PPT files                                              │  │
│  │  • Video files                                            │  │
│  │  • Public read access                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Ask Jiji Request

```
1. Client Request
   │
   └─> POST /api/ask-jiji
       Body: { query: "Explain RAG" }
       │
       ▼
2. Middleware Processing
   │
   ├─> CORS Check ✓
   ├─> Helmet (Security Headers) ✓
   ├─> Body Parser ✓
   ├─> Authentication (Optional) ✓
   └─> Validation (Joi) ✓
       │
       ▼
3. Controller
   │
   └─> jijiController.askJiji()
       │
       ▼
4. Service Layer
   │
   ├─> Extract keywords from query
   │   ("Explain RAG" → ["rag", "explain"])
   │
   ├─> Query Supabase for matching resources
   │   SELECT * FROM resources
   │   WHERE tags @> ARRAY['rag']
   │
   ├─> Generate AI response (mocked)
   │   (In production: call OpenAI/Claude API)
   │
   ├─> Save query to database
   │   INSERT INTO queries (query_text, response_text)
   │
   └─> Format response
       │
       ▼
5. Response
   │
   └─> JSON Response
       {
         "success": true,
         "data": {
           "queryId": "uuid",
           "answer": "RAG is...",
           "resources": [...]
         }
       }
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                              │
│  1. Network Layer                                           │
│     ├─> HTTPS/TLS Encryption                               │
│     ├─> CORS Policy                                        │
│     └─> Rate Limiting (Future)                             │
│                                                              │
│  2. Application Layer                                       │
│     ├─> Helmet.js (Security Headers)                       │
│     │   • X-Frame-Options                                  │
│     │   • X-Content-Type-Options                           │
│     │   • Strict-Transport-Security                        │
│     ├─> Input Validation (Joi)                             │
│     └─> Error Handling (No info leakage)                   │
│                                                              │
│  3. Authentication Layer                                    │
│     ├─> JWT Token Validation                               │
│     ├─> Supabase Auth                                      │
│     └─> Session Management                                 │
│                                                              │
│  4. Database Layer (Row Level Security)                    │
│     ├─> Profiles: User can only see own data              │
│     ├─> Queries: User can only see own queries            │
│     ├─> Resources: Public read, admin write               │
│     └─> PostgreSQL parameterized queries                   │
│                                                              │
│  5. Storage Layer                                          │
│     ├─> Public read for learning-resources                 │
│     ├─> Authenticated upload only                          │
│     └─> File type validation                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                        profiles                              │
├──────────────────┬──────────────────────────────────────────┤
│ id               │ UUID (PK, FK → auth.users)               │
│ email            │ TEXT UNIQUE NOT NULL                     │
│ full_name        │ TEXT                                     │
│ created_at       │ TIMESTAMPTZ                              │
│ updated_at       │ TIMESTAMPTZ                              │
└──────────────────┴──────────────────────────────────────────┘
                   ▲
                   │ (one-to-many)
                   │
┌─────────────────────────────────────────────────────────────┐
│                        queries                               │
├──────────────────┬──────────────────────────────────────────┤
│ id               │ UUID (PK)                                │
│ user_id          │ UUID (FK → profiles.id, nullable)        │
│ query_text       │ TEXT NOT NULL                            │
│ response_text    │ TEXT                                     │
│ created_at       │ TIMESTAMPTZ                              │
└──────────────────┴──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       resources                              │
├──────────────────┬──────────────────────────────────────────┤
│ id               │ UUID (PK)                                │
│ title            │ TEXT NOT NULL                            │
│ description      │ TEXT                                     │
│ type             │ TEXT (ppt|video|text)                    │
│ file_url         │ TEXT                                     │
│ tags             │ TEXT[] (indexed with GIN)                │
│ created_at       │ TIMESTAMPTZ                              │
│ updated_at       │ TIMESTAMPTZ                              │
└──────────────────┴──────────────────────────────────────────┘

Indexes:
• idx_resources_tags (GIN index on tags)
• idx_queries_user_id (B-tree on user_id)
• idx_queries_created_at (B-tree on created_at)
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Technology Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Runtime Environment                                        │
│  └─> Node.js 18+                                           │
│                                                              │
│  Programming Language                                       │
│  └─> TypeScript 5.3+                                       │
│                                                              │
│  Web Framework                                              │
│  └─> Express.js 4.18+                                      │
│                                                              │
│  Database & Backend Services                                │
│  ├─> Supabase (PostgreSQL)                                 │
│  ├─> Supabase Auth (JWT)                                   │
│  └─> Supabase Storage                                      │
│                                                              │
│  Validation & Security                                      │
│  ├─> Joi (Schema validation)                               │
│  ├─> Helmet (Security headers)                             │
│  └─> CORS (Cross-origin)                                   │
│                                                              │
│  Development Tools                                          │
│  ├─> ts-node (TypeScript execution)                        │
│  ├─> nodemon (Auto-reload)                                 │
│  └─> dotenv (Environment variables)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN Layer                             │
│              (CloudFlare / Vercel Edge)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Load Balancer                             │
│              (Vercel / AWS ALB / Nginx)                      │
└───┬──────────────────┬──────────────────┬───────────────────┘
    │                  │                  │
┌───▼────┐      ┌──────▼─────┐      ┌────▼──────┐
│ API    │      │   API      │      │   API     │
│ Server │      │   Server   │      │   Server  │
│   #1   │      │     #2     │      │     #3    │
└───┬────┘      └──────┬─────┘      └────┬──────┘
    │                  │                  │
    └──────────────────┼──────────────────┘
                       │
           ┌───────────▼────────────┐
           │  Redis Cache (Future)  │
           └───────────┬────────────┘
                       │
           ┌───────────▼────────────┐
           │   Supabase Backend     │
           │  • Database            │
           │  • Auth                │
           │  • Storage             │
           └────────────────────────┘
```

---

This architecture provides:
✅ Scalability - Horizontal scaling ready
✅ Security - Multiple security layers
✅ Maintainability - Clean separation of concerns
✅ Performance - Optimized database queries
✅ Reliability - Error handling at every layer
