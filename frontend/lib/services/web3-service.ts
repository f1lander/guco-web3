import { GameService, GameLevel, GamePlayer, CreateLevelParams, CompleteLevelParams, GetLevelsParams } from './types';
import { getLevels as web3GetLevels, getLevelCount as web3GetLevelCount, getLevel as web3GetLevel, getPlayer as web3GetPlayer, isLevelCompleted as web3IsLevelCompleted, getPlayerCreatedLevels as web3GetPlayerCreatedLevels } from '../blockchain/contract-functions';
import { levelToBytes32, bytes32ToLevel } from '../utils';
import { writeContract } from '@wagmi/core';
import { gucoAbi } from '../blockchain/abis/guco.abi';
import { GUCO_CONTRACT_ADDRESSES } from '../constants';

export class Web3GameService implements GameService {
  async getLevels(params: GetLevelsParams): Promise<GameLevel[]> {
    const levels = await web3GetLevels(params.offset, params.limit);
    return levels.map((level: any) => ({
      ...level,
      levelDataTransformed: level.levelData ? bytes32ToLevel(level.levelData as `0x${string}`) : undefined,
    }));
  }

  async getLevelCount(): Promise<number> {
    return await web3GetLevelCount();
  }

  async getLevel(levelId: number): Promise<GameLevel> {
    const level = await web3GetLevel(levelId);
    return {
      id: levelId,
      levelData: level.levelData,
      creator: level.creator,
      playCount: Number(level.playCount),
      completions: Number(level.completions),
      verified: level.verified,
      createdAt: new Date(Number(level.createdAt) * 1000),
      levelDataTransformed: level.levelData ? bytes32ToLevel(level.levelData as `0x${string}`) : undefined,
    };
  }

  async createLevel(params: CreateLevelParams): Promise<{ id: number; txHash?: string }> {
    const account = getAccount(config);
    if (!account.address) {
      throw new Error('Wallet not connected');
    }

    const bytes32Data = levelToBytes32(params.levelData);
    
    const hash = await writeContract(config, {
      address: GUCO_CONTRACT_ADDRESSES,
      abi: gucoAbi,
      functionName: 'createLevel',
      args: [bytes32Data],
    });

    // Note: In a real implementation, you'd want to wait for the transaction
    // and get the actual level ID from the event logs
    const levelCount = await this.getLevelCount();
    
    return {
      id: levelCount, // This is approximate, ideally get from event logs
      txHash: hash,
    };
  }

  async getPlayer(playerId: string): Promise<GamePlayer> {
    const player = await web3GetPlayer(playerId as `0x${string}`);
    return {
      id: playerId,
      levelsCompleted: Number(player.levelsCompleted),
      completedLevels: player.completedLevels.map((level, index) => ({
        id: index, // This is not ideal, but the current contract doesn't store level IDs
        levelData: level.levelData,
        creator: level.creator,
        playCount: Number(level.playCount),
        completions: Number(level.completions),
        verified: level.verified,
        createdAt: new Date(Number(level.createdAt) * 1000),
      })),
    };
  }

  async completeLevel(params: CompleteLevelParams): Promise<{ success: boolean; txHash?: string }> {
    const account = await getAccount();
    if (!account.address) {
      throw new Error('Wallet not connected');
    }

    if (!params.levelData) {
      throw new Error('Level data required for web3 completion');
    }

    const hash = await writeContract({
      address: GUCO_CONTRACT_ADDRESSES,
      abi: gucoAbi,
      functionName: 'updatePlayer',
      args: [
        account.address,
        BigInt(params.levelId),
        {
          levelData: params.levelData.levelData as `0x${string}`,
          creator: params.levelData.creator as `0x${string}`,
          playCount: BigInt(params.levelData.playCount),
          completions: BigInt(params.levelData.completions),
          verified: params.levelData.verified,
          createdAt: BigInt(Math.floor(params.levelData.createdAt.getTime() / 1000)),
        }
      ],
      account: account,
    });

    return {
      success: true,
      txHash: hash,
    };
  }

  async isLevelCompleted(playerId: string, levelId: number): Promise<boolean> {
    return await web3IsLevelCompleted(playerId as `0x${string}`, levelId);
  }

  async getPlayerCreatedLevels(playerId: string): Promise<GameLevel[]> {
    const levels = await web3GetPlayerCreatedLevels(playerId as `0x${string}`);
    return levels.map((level: any) => ({
      ...level,
      levelDataTransformed: level.levelData ? bytes32ToLevel(level.levelData as `0x${string}`) : undefined,
    }));
  }
}