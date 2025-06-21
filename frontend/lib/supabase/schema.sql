-- Supabase database schema for Guco Game REST API version

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    levels_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    level_data TEXT NOT NULL, -- JSON string of number[]
    creator_id UUID REFERENCES players(id) ON DELETE CASCADE,
    play_count INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Level completions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS level_completions (
    id SERIAL PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES levels(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, level_id) -- Prevent duplicate completions
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_levels_creator ON levels(creator_id);
CREATE INDEX IF NOT EXISTS idx_levels_created_at ON levels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_levels_completions ON levels(completions DESC);
CREATE INDEX IF NOT EXISTS idx_level_completions_player ON level_completions(player_id);
CREATE INDEX IF NOT EXISTS idx_level_completions_level ON level_completions(level_id);

-- RPC functions for atomic operations
CREATE OR REPLACE FUNCTION increment_player_completions(player_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE players 
    SET levels_completed = levels_completed + 1 
    WHERE id = player_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_level_completions(level_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE levels 
    SET completions = completions + 1 
    WHERE id = level_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_level_play_count(level_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE levels 
    SET play_count = play_count + 1 
    WHERE id = level_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_completions ENABLE ROW LEVEL SECURITY;

-- Players can only see their own data
CREATE POLICY "Players can view own data" ON players 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Players can update own data" ON players 
    FOR UPDATE USING (auth.uid() = id);

-- Anyone can view levels (for browsing)
CREATE POLICY "Anyone can view levels" ON levels 
    FOR SELECT USING (true);

-- Only authenticated users can create levels
CREATE POLICY "Authenticated users can create levels" ON levels 
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own levels
CREATE POLICY "Creators can update own levels" ON levels 
    FOR UPDATE USING (auth.uid() = creator_id);

-- Anyone can view level completions (for leaderboards, etc.)
CREATE POLICY "Anyone can view level completions" ON level_completions 
    FOR SELECT USING (true);

-- Only authenticated users can record their own completions
CREATE POLICY "Users can record own completions" ON level_completions 
    FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Trigger to automatically update completion counts
CREATE OR REPLACE FUNCTION handle_level_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment player's completion count
    PERFORM increment_player_completions(NEW.player_id);
    
    -- Increment level's completion count
    PERFORM increment_level_completions(NEW.level_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_level_completion
    AFTER INSERT ON level_completions
    FOR EACH ROW EXECUTE FUNCTION handle_level_completion();

-- Insert some sample data (optional)
-- INSERT INTO players (id, username) VALUES 
--     (uuid_generate_v4(), 'demo_player'),
--     (uuid_generate_v4(), 'test_user');

-- Sample level data (commented out)
-- INSERT INTO levels (level_data, creator_id, verified) VALUES 
--     ('[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]', (SELECT id FROM players WHERE username = 'demo_player' LIMIT 1), true);