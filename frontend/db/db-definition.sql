-- Create the levels table
CREATE TABLE levels (
    id BIGSERIAL PRIMARY KEY,
    level_data JSONB NOT NULL,
    creator_id UUID NOT NULL,
    play_count INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the players table
CREATE TABLE players (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    levels_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the level_completions junction table
CREATE TABLE level_completions (
    id BIGSERIAL PRIMARY KEY,
    player_id UUID NOT NULL,
    level_id BIGINT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, level_id)
);

-- Create indexes for better performance
CREATE INDEX idx_levels_creator_id ON levels(creator_id);
CREATE INDEX idx_levels_created_at ON levels(created_at);
CREATE INDEX idx_levels_completions ON levels(completions);
CREATE INDEX idx_level_completions_player_id ON level_completions(player_id);
CREATE INDEX idx_level_completions_level_id ON level_completions(level_id);

-- Create foreign key constraints
ALTER TABLE levels 
ADD CONSTRAINT fk_levels_creator_id 
FOREIGN KEY (creator_id) REFERENCES players(id) ON DELETE CASCADE;

ALTER TABLE level_completions 
ADD CONSTRAINT fk_level_completions_player_id 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

ALTER TABLE level_completions 
ADD CONSTRAINT fk_level_completions_level_id 
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

-- Create stored procedures for incrementing counters
CREATE OR REPLACE FUNCTION increment_player_completions(player_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE players 
    SET levels_completed = levels_completed + 1,
        updated_at = NOW()
    WHERE id = player_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_level_completions(level_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE levels 
    SET completions = completions + 1,
        updated_at = NOW()
    WHERE id = level_id;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_levels_updated_at 
    BEFORE UPDATE ON levels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for levels table
CREATE POLICY "Levels are viewable by everyone" ON levels
    FOR SELECT USING (true);

CREATE POLICY "Users can create levels" ON levels
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own levels" ON levels
    FOR UPDATE USING (auth.uid() = creator_id);

-- Create RLS policies for players table
CREATE POLICY "Players are viewable by everyone" ON players
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own player record" ON players
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own player record" ON players
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for level_completions table
CREATE POLICY "Level completions are viewable by everyone" ON level_completions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own completions" ON level_completions
    FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;