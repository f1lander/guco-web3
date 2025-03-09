export interface Level {
  id: number;
  levelData: string;
  creator: string;
  playCount: bigint;
  completions: bigint;
  verified: boolean;
  createdAt: Date;
  levelDataTransformed?: number[];
}

export interface LevelWithId {
  id: number;
  level: Level;
}
