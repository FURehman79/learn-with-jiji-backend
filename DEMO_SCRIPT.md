# Demo Video Script

## Duration: ~3-5 minutes

### Introduction (30 seconds)
"Hello! I'm demonstrating the Learn with Jiji backend API that I built for VeidaLabs. This is a production-ready backend service built with Node.js, TypeScript, Express, and Supabase that powers an AI learning companion."

[Show project structure in VS Code]

### Architecture Overview (30 seconds)
"The application follows clean architecture principles with:"
- Controllers for handling HTTP requests
- Services for business logic
- Middleware for authentication and validation
- Type-safe TypeScript throughout
- Supabase for database, auth, and storage

[Show folder structure]

### Supabase Setup (1 minute)
"Let me show you the Supabase configuration."

[Open Supabase Dashboard]
1. "Here's our database schema with three main tables:"
   - profiles (user data)
   - queries (user questions and responses)
   - resources (learning materials)

2. "Row Level Security is enabled on all tables"
   [Show RLS policies in Supabase]
   - Users can only see their own data
   - Resources are publicly readable
   - Service role handles anonymous queries

3. "Storage bucket for learning resources"
   [Show storage bucket with sample files]

### API Demonstration (2 minutes)
"Now let's test the API."

#### Test 1: Health Check
[Open Postman/Terminal]
```bash
GET http://localhost:3000/api/v1/health
```
"This confirms the server is running."

#### Test 2: Anonymous Query
```bash
POST http://localhost:3000/api/v1/ask-jiji
{
  "query": "Explain RAG"
}
```
[Show response]
"Notice how it returns:
- AI-generated answer about RAG
- Relevant learning resources (PPT and video)
- Signed URLs for accessing files
- A query ID for tracking"

[Open Supabase Dashboard - Queries table]
"And the query is saved in our database with user_id as NULL for anonymous users."

#### Test 3: Authenticated Query
[Show getting auth token or use existing]
```bash
POST http://localhost:3000/api/v1/ask-jiji
Authorization: Bearer <token>
{
  "query": "What is artificial intelligence?"
}
```
[Show response]
"Same format, but now..."

[Open Supabase Dashboard - Queries table]
"...the query is linked to the authenticated user."

#### Test 4: Validation
```bash
POST http://localhost:3000/api/v1/ask-jiji
{
  "query": "AI"
}
```
[Show error response]
"Input validation prevents queries that are too short. The error response is clean and structured."

### Code Quality Highlights (45 seconds)
[Quickly show in VS Code]

1. "TypeScript types for type safety"
   [Show types/index.ts]

2. "Error handling with custom AppError class"
   [Show errorHandler.ts]

3. "Authentication middleware with JWT validation"
   [Show auth.ts]

4. "Service layer with clean business logic"
   [Show jijiService.ts]

5. "Comprehensive logging with Winston"
   [Show logger.ts and console logs]

### Security Features (30 seconds)
"Security is built-in from the ground up:"
- ✅ Row Level Security in Supabase
- ✅ Input validation and sanitization
- ✅ No secrets in code (environment variables)
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Parameterized queries (SQL injection prevention)

### Future Improvements (30 seconds)
"Given more time, I would add:"
- Real AI integration with LangChain and OpenAI
- Vector embeddings for semantic search
- Redis caching for common queries
- Rate limiting per user/IP
- Analytics dashboard
- Admin panel for content management

[Show the improvement section in README]

### Conclusion (15 seconds)
"This backend demonstrates professional software development practices with clean code, proper architecture, comprehensive security, and production-ready features. Thank you!"

---

## Recording Tips

### Before Recording:
- [ ] Clean up VS Code (close unnecessary files)
- [ ] Clear terminal history
- [ ] Have Postman collection ready
- [ ] Have Supabase dashboard open in browser
- [ ] Start the dev server
- [ ] Zoom in on terminal/browser for visibility

### During Recording:
- [ ] Speak clearly and at moderate pace
- [ ] Show, don't just tell (visual demos)
- [ ] Keep it under 5 minutes
- [ ] Highlight key features
- [ ] Show both success and error cases

### Screen Layout:
- Left: VS Code with code
- Right: Postman/Terminal for API calls
- Browser: Supabase dashboard

### Tools for Recording:
- **macOS**: QuickTime Player (⌘+Ctrl+N)
- **Windows**: Xbox Game Bar (Win+G)
- **Cross-platform**: OBS Studio, Loom
- **Browser-based**: Loom Chrome Extension
