export interface Level {
  levelData: string;
  creator: string;
  playCount: bigint;
  completions: bigint;
  verified: boolean;
  createdAt: Date;
  levelDataTransformed?: number[];
} 
