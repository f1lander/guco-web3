import { GameService, GameLevel, GamePlayer, CreateLevelParams, CompleteLevelParams, GetLevelsParams, AuthUser } from './types';
import { supabase } from '../supabase/client';

export class RestGameService implements GameService {
  private currentUser: AuthUser | null = null;

  async getLevels(params: GetLevelsParams): Promise<GameLevel[]> {
    let query = supabase
      .from('levels')
      .select('*')
      .range(params.offset, params.offset + params.limit - 1);

    // Add filters
    if (params.creator) {
      query = query.eq('creator_id', params.creator);
    }

    // Add sorting
    if (params.sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (params.sortBy === 'completion') {
      query = query.order('completions', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching levels:', error);
      return [];
    }

    return data.map(level => ({
      id: level.id,
      levelData: level.level_data,
      creator: level.creator_id,
      playCount: level.play_count,
      completions: level.completions,
      verified: level.verified,
      createdAt: new Date(level.created_at),
      levelDataTransformed: JSON.parse(level.level_data),
    }));
  }

  async getLevelCount(): Promise<number> {
    const { count, error } = await supabase
      .from('levels')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting level count:', error);
      return 0;
    }

    return count || 0;
  }

  async getLevel(levelId: number): Promise<GameLevel> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('id', levelId)
      .single();

    if (error) {
      throw new Error(`Level not found: ${error.message}`);
    }

    return {
      id: data.id,
      levelData: data.level_data,
      creator: data.creator_id,
      playCount: data.play_count,
      completions: data.completions,
      verified: data.verified,
      createdAt: new Date(data.created_at),
      levelDataTransformed: JSON.parse(data.level_data),
    };
  }

  async createLevel(params: CreateLevelParams): Promise<{ id: number; txHash?: string }> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('levels')
      .insert({
        level_data: JSON.stringify(params.levelData),
        creator_id: user.id,
        play_count: 0,
        completions: 0,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create level: ${error.message}`);
    }

    return {
      id: data.id,
    };
  }

  async getPlayer(playerId: string): Promise<GamePlayer> {
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (playerError) {
      throw new Error(`Player not found: ${playerError.message}`);
    }

    // Get completed levels
    const { data: completionsData, error: completionsError } = await supabase
      .from('level_completions')
      .select(`
        level_id,
        levels (*)
      `)
      .eq('player_id', playerId);

    if (completionsError) {
      console.error('Error fetching completions:', completionsError);
    }

    const completedLevels: GameLevel[] = completionsData?.map(completion => {
      const level = (completion as any).levels;
      return {
        id: level.id,
        levelData: level.level_data,
        creator: level.creator_id,
        playCount: level.play_count,
        completions: level.completions,
        verified: level.verified,
        createdAt: new Date(level.created_at),
        levelDataTransformed: JSON.parse(level.level_data),
      };
    }) || [];

    return {
      id: playerData.id,
      username: playerData.username,
      levelsCompleted: playerData.levels_completed,
      completedLevels,
    };
  }

  async completeLevel(params: CompleteLevelParams): Promise<{ success: boolean; txHash?: string }> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if already completed
    const { data: existingCompletion } = await supabase
      .from('level_completions')
      .select('*')
      .eq('player_id', user.id)
      .eq('level_id', params.levelId)
      .single();

    if (existingCompletion) {
      return { success: true }; // Already completed
    }

    // Start transaction-like operations
    const { error: completionError } = await supabase
      .from('level_completions')
      .insert({
        player_id: user.id,
        level_id: params.levelId,
      });

    if (completionError) {
      throw new Error(`Failed to record completion: ${completionError.message}`);
    }

    // Update player's completion count
    const { error: playerError } = await supabase.rpc('increment_player_completions', {
      player_id: user.id,
    });

    if (playerError) {
      console.error('Failed to update player completion count:', playerError);
    }

    // Update level's completion count
    const { error: levelError } = await supabase.rpc('increment_level_completions', {
      level_id: params.levelId,
    });

    if (levelError) {
      console.error('Failed to update level completion count:', levelError);
    }

    return { success: true };
  }

  async isLevelCompleted(playerId: string, levelId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('level_completions')
      .select('*')
      .eq('player_id', playerId)
      .eq('level_id', levelId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking level completion:', error);
      return false;
    }

    return !!data;
  }

  async getPlayerCreatedLevels(playerId: string): Promise<GameLevel[]> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('creator_id', playerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching player created levels:', error);
      return [];
    }

    return data.map(level => ({
      id: level.id,
      levelData: level.level_data,
      creator: level.creator_id,
      playCount: level.play_count,
      completions: level.completions,
      verified: level.verified,
      createdAt: new Date(level.created_at),
      levelDataTransformed: JSON.parse(level.level_data),
    }));
  }

  // Auth methods
  async login(username: string, password: string): Promise<{ user: GamePlayer; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@guco.local`, // Using username as email prefix
      password,
    });

    if (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    // Get or create player record
    const player = await this.getOrCreatePlayer(data.user.id, username);
    this.currentUser = { id: data.user.id, username };

    return {
      user: player,
      token: data.session.access_token,
    };
  }

  async register(username: string, password: string): Promise<{ user: GamePlayer; token: string }> {
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@guco.local`, // Using username as email prefix
      password,
    });

    if (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('Registration failed: No user returned');
    }

    // Create player record
    const player = await this.getOrCreatePlayer(data.user.id, username);
    this.currentUser = { id: data.user.id, username };

    return {
      user: player,
      token: data.session?.access_token || '',
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<GamePlayer | null> {
    if (this.currentUser) {
      return this.getPlayer(this.currentUser.id);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    // Get player data
    const { data: playerData } = await supabase
      .from('players')
      .select('*')
      .eq('id', user.id)
      .single();

    if (playerData) {
      this.currentUser = { id: user.id, username: playerData.username };
      return this.getPlayer(user.id);
    }

    return null;
  }

  private async getOrCreatePlayer(userId: string, username: string): Promise<GamePlayer> {
    // Try to get existing player
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingPlayer) {
      return {
        id: existingPlayer.id,
        username: existingPlayer.username,
        levelsCompleted: existingPlayer.levels_completed,
        completedLevels: [], // Will be loaded separately if needed
      };
    }

    // Create new player
    const { data: newPlayer, error } = await supabase
      .from('players')
      .insert({
        id: userId,
        username,
        levels_completed: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create player: ${error.message}`);
    }

    return {
      id: newPlayer.id,
      username: newPlayer.username,
      levelsCompleted: newPlayer.levels_completed,
      completedLevels: [],
    };
  }
}