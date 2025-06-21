// Common types for both web3 and REST API versions
export interface GameLevel {
  id: number;
  levelData: string; // hex string for web3, JSON string for REST
  creator: string; // wallet address for web3, user_id for REST
  playCount: number;
  completions: number;
  verified: boolean;
  createdAt: Date;
  levelDataTransformed?: number[]; // parsed level data
}

export interface GamePlayer {
  id: string; // wallet address for web3, user_id for REST
  username?: string; // only for REST version
  levelsCompleted: number;
  completedLevels: GameLevel[];
}

export interface CreateLevelParams {
  levelData: number[];
  creator?: string; // optional for REST (uses auth), required for web3
}

export interface CompleteLevelParams {
  levelId: number;
  playerId: string;
  levelData?: GameLevel; // for web3 compatibility
}

export interface GetLevelsParams {
  offset: number;
  limit: number;
  creator?: string;
  difficulty?: string;
  sortBy?: 'newest' | 'completion';
}

// Service interface that both implementations must follow
export interface GameService {
  // Level operations
  getLevels(params: GetLevelsParams): Promise<GameLevel[]>;
  getLevelCount(): Promise<number>;
  getLevel(levelId: number): Promise<GameLevel>;
  createLevel(params: CreateLevelParams): Promise<{ id: number; txHash?: string }>;
  
  // Player operations
  getPlayer(playerId: string): Promise<GamePlayer>;
  completeLevel(params: CompleteLevelParams): Promise<{ success: boolean; txHash?: string }>;
  isLevelCompleted(playerId: string, levelId: number): Promise<boolean>;
  getPlayerCreatedLevels(playerId: string): Promise<GameLevel[]>;
  
  // Auth operations (REST only)
  login?(username: string, password: string): Promise<{ user: GamePlayer; token: string }>;
  register?(username: string, password: string): Promise<{ user: GamePlayer; token: string }>;
  logout?(): Promise<void>;
  getCurrentUser?(): Promise<GamePlayer | null>;
}

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  created_at?: Date;
}