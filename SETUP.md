# Setup Instructions

## Step-by-Step Setup Guide

### 1. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and project name: "learn-with-jiji"
   - Set a strong database password
   - Select region closest to you
   - Wait for project to be created (~2 minutes)

2. **Get API Credentials**
   - Go to Project Settings (gear icon)
   - Click on "API" tab
   - Copy the following:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - `anon` public key
     - `service_role` key (keep this secret!)

3. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Click "New Query"
   - Copy entire content from `supabase/schema.sql`
   - Paste and click "Run"
   - Verify: Check that tables appear in Table Editor

4. **Set Up Storage**
   - Go to Storage in Supabase Dashboard
   - Bucket `learning-resources` should be created automatically
   - If not, create it manually and make it public
   - Upload sample files:
     ```
     presentations/
       ├── rag-introduction.pptx
       ├── ai-fundamentals.pptx
       └── vector-databases.pptx
     videos/
       ├── rag-tutorial.mp4
       └── ml-basics.mp4
     ```

### 2. Backend Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd learn-with-jiji-backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   Server running on port 3000
   Environment: development
   API Base URL: http://localhost:3000/api/v1
   ```

### 3. Test the API

**Option A: Using cURL**
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Ask Jiji
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG"}'
```

**Option B: Using Postman**
1. Import `postman_collection.json`
2. Update `base_url` variable if needed
3. Run "Health Check" request
4. Run "Ask Jiji (Anonymous)" request

### 4. Create Test User (Optional)

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. User will be automatically created in `profiles` table via trigger
5. Get auth token:
   ```bash
   curl -X POST https://xxxxx.supabase.co/auth/v1/token?grant_type=password \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "your-password"
     }'
   ```
6. Use the `access_token` in Authorization header

### 5. Verify RLS is Working

**Test 1: Anonymous Query**
```bash
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "What is AI?"}'
```
Should work ✅

**Test 2: View Resources**
Go to Supabase Dashboard → Table Editor → resources
You should see all 5 sample resources ✅

**Test 3: Try to Insert Without Auth**
```sql
-- In Supabase SQL Editor (without service role)
INSERT INTO queries (query_text, response_text)
VALUES ('test', 'test');
```
Should fail ❌ (RLS prevents direct inserts)

## Troubleshooting

### Issue: "Missing required environment variable"
**Solution:** Make sure `.env` file exists and has all required variables

### Issue: "Error searching resources"
**Solution:** 
- Check if Supabase schema is properly executed
- Verify tables exist in Table Editor
- Check if RLS policies are enabled

### Issue: "CORS error"
**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

### Issue: "Cannot read storage files"
**Solution:** 
- Verify storage bucket is public
- Check file paths match those in database
- Ensure storage policies are created

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
SUPABASE_URL=your-production-url
SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
PORT=3000
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy Options
- **Vercel**: `vercel --prod`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **AWS/GCP/Azure**: Use Docker or direct deployment

## Next Steps

1. ✅ Test all API endpoints
2. ✅ Create test users
3. ✅ Upload real learning content
4. ✅ Integrate with frontend
5. ✅ Add monitoring (optional)
6. ✅ Set up CI/CD (optional)

## Support

If you encounter issues:
1. Check logs: The Winston logger provides detailed error information
2. Verify Supabase connection: Check dashboard for errors
3. Test RLS policies: Use Supabase SQL editor with different roles
4. Review this guide: Common issues are documented above

---

Happy coding! 🚀
