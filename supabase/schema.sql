-- ============================================================================
-- Learn with Jiji - Supabase Database Schema
-- VeidaLabs Assignment
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Queries table (stores user queries and responses)
CREATE TABLE IF NOT EXISTS public.queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources table (learning materials)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('ppt', 'video', 'document')),
    file_url TEXT NOT NULL,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index on queries for faster user lookups
CREATE INDEX IF NOT EXISTS idx_queries_user_id ON public.queries(user_id);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON public.queries(created_at DESC);

-- Index on resources for keyword searches
CREATE INDEX IF NOT EXISTS idx_resources_keywords ON public.resources USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow profile creation on signup
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Queries RLS Policies
-- Users can view their own queries
CREATE POLICY "Users can view own queries"
    ON public.queries FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Service role can insert queries (for both authenticated and anonymous users)
CREATE POLICY "Service role can insert queries"
    ON public.queries FOR INSERT
    WITH CHECK (true);

-- Resources RLS Policies
-- Everyone can view resources (public learning materials)
CREATE POLICY "Resources are publicly readable"
    ON public.resources FOR SELECT
    USING (true);

-- Only authenticated users or service role can insert resources
CREATE POLICY "Authenticated users can insert resources"
    ON public.resources FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Only resource creators or admins can update/delete
CREATE POLICY "Service role can manage resources"
    ON public.resources FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for resources table
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for learning resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('learning-resources', 'learning-resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for learning-resources bucket
CREATE POLICY "Public can view learning resources"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'learning-resources');

CREATE POLICY "Authenticated users can upload learning resources"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'learning-resources' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Service role can manage learning resources"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'learning-resources' 
        AND auth.role() = 'service_role'
    );

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert sample resources
INSERT INTO public.resources (title, description, resource_type, file_url, keywords)
VALUES
    (
        'Introduction to RAG (Retrieval-Augmented Generation)',
        'Comprehensive guide explaining RAG architecture, use cases, and implementation strategies for AI applications.',
        'ppt',
        'presentations/rag-introduction.pptx',
        ARRAY['rag', 'retrieval', 'generation', 'ai', 'llm', 'vector', 'embedding']
    ),
    (
        'RAG Implementation Tutorial Video',
        'Step-by-step video tutorial on implementing RAG systems with practical examples and code walkthroughs.',
        'video',
        'videos/rag-tutorial.mp4',
        ARRAY['rag', 'tutorial', 'implementation', 'coding', 'ai', 'vector', 'database']
    ),
    (
        'AI Fundamentals for Beginners',
        'Essential concepts in artificial intelligence, machine learning, and neural networks explained simply.',
        'ppt',
        'presentations/ai-fundamentals.pptx',
        ARRAY['ai', 'artificial', 'intelligence', 'machine', 'learning', 'neural', 'networks']
    ),
    (
        'Machine Learning Basics Video Course',
        'Complete video course covering machine learning algorithms, training processes, and real-world applications.',
        'video',
        'videos/ml-basics.mp4',
        ARRAY['machine', 'learning', 'ml', 'algorithms', 'training', 'ai', 'models']
    ),
    (
        'Vector Databases and Embeddings',
        'Understanding vector databases, embeddings, and their role in modern AI applications.',
        'ppt',
        'presentations/vector-databases.pptx',
        ARRAY['vector', 'database', 'embedding', 'similarity', 'search', 'ai', 'rag']
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE public.queries IS 'Stores all user queries and Jiji responses';
COMMENT ON TABLE public.resources IS 'Learning resources (PPT, videos, documents)';

COMMENT ON COLUMN public.resources.keywords IS 'Array of keywords for semantic search';
COMMENT ON COLUMN public.queries.user_id IS 'NULL for anonymous queries, UUID for authenticated users';
