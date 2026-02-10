# Supabase Setup Guide

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: learn-with-jiji
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for project to initialize

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (starts with eyJ)
   - **service_role key**: `eyJhbGc...` (KEEP SECRET!)

3. Add to your `.env` file:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of `supabase/migrations/20240210_initial_schema.sql`
4. Paste into SQL editor
5. Click **Run** or press `Ctrl+Enter`
6. Verify success message (no errors)

### 4. Verify Tables Created

1. Go to **Table Editor**
2. You should see:
   - profiles
   - resources
   - queries

3. Click on **resources** table
4. You should see 5 sample resources

### 5. Set Up Storage

1. Go to **Storage**
2. Verify `learning-resources` bucket exists
3. Click on bucket
4. Upload sample files (optional):
   - Sample PPT: `rag-introduction.pptx`
   - Sample Video: `ai-tutorial.mp4`

### 6. Configure Storage URLs

If you uploaded files:

1. Click on uploaded file
2. Click **Get URL**
3. Copy the public URL
4. Update resources table:

```sql
-- Go to SQL Editor
UPDATE resources 
SET file_url = 'https://xxxxx.supabase.co/storage/v1/object/public/learning-resources/rag-intro.pptx'
WHERE title = 'Introduction to RAG (Retrieval Augmented Generation)';

UPDATE resources 
SET file_url = 'https://xxxxx.supabase.co/storage/v1/object/public/learning-resources/ai-tutorial.mp4'
WHERE title = 'RAG Implementation Tutorial';
```

### 7. Test Authentication (Optional)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - Email: test@example.com
   - Password: TestPassword123!
   - Auto Confirm: Yes
4. Click **Create user**

### 8. Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Select each table to see policies:

**profiles**:
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

**resources**:
- Anyone can view resources
- Service role can manage resources

**queries**:
- Users can view their own queries
- Users can insert their own queries
- Anonymous users can insert queries

### 9. Test from Backend

```bash
# Start your backend
npm run dev

# Test the connection
curl http://localhost:3000/api/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG"}'
```

You should get a response with resources!

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Run the migration SQL again

### Issue: "RLS policy violation"
**Solution**: Check that RLS policies are created correctly

### Issue: "Invalid API key"
**Solution**: Verify `.env` has correct keys from Supabase dashboard

### Issue: "CORS error"
**Solution**: 
1. Go to **Settings** → **API**
2. Add your domain to CORS allowed origins
3. Or use `*` for development

## Storage Best Practices

### File Naming Convention
```
learning-resources/
  ├── ppt/
  │   ├── rag-introduction.pptx
  │   ├── prompt-engineering.pptx
  │   └── ai-fundamentals.pptx
  └── video/
      ├── rag-tutorial.mp4
      └── ai-basics.mp4
```

### Security Settings
- Enable RLS on storage.objects
- Set size limits (e.g., 50MB per file)
- Allowed MIME types: 
  - PPT: `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - Video: `video/mp4`, `video/webm`

## Database Optimization

### Indexes
Already created in migration:
- `idx_resources_tags` - GIN index for tag searching
- `idx_queries_user_id` - For user query lookups
- `idx_queries_created_at` - For chronological sorting

### Connection Pooling
Supabase automatically handles connection pooling.

For production, consider:
- Supavisor (built-in connection pooler)
- PgBouncer for additional control

## Monitoring

### Enable Logs
1. Go to **Logs** in Supabase dashboard
2. View:
   - Postgres logs
   - API logs
   - Auth logs
   - Storage logs

### Set Up Alerts
1. Go to **Settings** → **Alerts**
2. Configure:
   - High CPU usage
   - Database size limit
   - API errors

## Backup & Recovery

### Automatic Backups
- Supabase Pro: Daily backups (7 day retention)
- Free tier: No automatic backups

### Manual Backup
```bash
# Using pg_dump
pg_dump -h db.xxxxx.supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

### Restore
1. Go to **Database** → **Backups**
2. Select backup
3. Click **Restore**

## Security Checklist

- [x] RLS enabled on all tables
- [x] Service role key kept secret
- [x] Storage bucket policies configured
- [ ] Enable 2FA for Supabase account
- [ ] Rotate API keys periodically
- [ ] Monitor auth logs for suspicious activity
- [ ] Set up rate limiting on API endpoints

## Performance Tips

1. **Use indexes** - Already configured
2. **Limit query results** - Use `.limit()` in queries
3. **Cache frequent queries** - Consider Redis
4. **Optimize RLS policies** - Keep them simple
5. **Monitor slow queries** - Use Supabase dashboard

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase)
