# Quick Start Guide

Get the Learn with Jiji backend running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Supabase account

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Configure Supabase (2 min)

**Create Project:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for setup to complete

**Run Schema:**
1. Supabase Dashboard → SQL Editor
2. Copy content from `supabase/schema.sql`
3. Paste and Run

**Get Credentials:**
1. Project Settings → API
2. Copy URL, anon key, and service_role key

### 3. Configure Environment (30 sec)
```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

### 4. Upload Sample Files (1 min)

**Option A: Use Placeholders**
The app works without actual files (will return URLs to non-existent files)

**Option B: Upload Real Files**
1. Supabase → Storage → learning-resources
2. Upload any PPT/video files to:
   - `presentations/rag-introduction.pptx`
   - `videos/rag-tutorial.mp4`
   - etc.

### 5. Start Server (30 sec)
```bash
npm run dev
```

You should see:
```
Server running on port 3000
API Base URL: http://localhost:3000/api/v1
```

## Test It!

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/v1/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG"}'
```

### Using Browser:
Visit: `http://localhost:3000`

### Using Postman:
Import `postman_collection.json` and run requests

## Expected Response
```json
{
  "success": true,
  "data": {
    "answer": "RAG (Retrieval-Augmented Generation) is a technique...",
    "resources": [
      {
        "id": "...",
        "title": "Introduction to RAG",
        "type": "ppt",
        "url": "https://..."
      }
    ],
    "query_id": "..."
  }
}
```

## Next Steps
1. ✅ Read full [README.md](README.md) for detailed documentation
2. ✅ Check [SETUP.md](SETUP.md) for comprehensive setup guide
3. ✅ Review [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for video recording
4. ✅ Use [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) before submitting

## Troubleshooting

**Server won't start?**
- Check `.env` has all required variables
- Ensure port 3000 is not in use
- Run `npm install` again

**Can't connect to Supabase?**
- Verify URL and keys in `.env`
- Check Supabase project is active
- Ensure schema is executed

**No resources returned?**
- Check if seed data exists in Supabase
- Verify resources table has data
- Check RLS policies are enabled

## Support
- 📖 Full docs: [README.md](README.md)
- 🔧 Setup help: [SETUP.md](SETUP.md)
- ✉️ Questions: hello@veidalabs.com

---

That's it! You're ready to go. 🚀
