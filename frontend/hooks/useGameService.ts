import { useState, useEffect } from 'react';
import { gameService, isWeb3Mode } from '@/lib/services/factory';
import { GameLevel, GamePlayer, CreateLevelParams, CompleteLevelParams } from '@/lib/services/types';
import { useAccount } from 'wagmi';

export const useGameService = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user ID based on mode
  const getCurrentUserId = async (): Promise<string | null> => {
    if (isWeb3Mode()) {
      return address || null;
    } else {
      const user = await gameService.getCurrentUser?.();
      return user?.id || null;
    }
  };

  // Level operations
  const getLevels = async (offset: number, limit: number): Promise<GameLevel[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const levels = await gameService.getLevels({ offset, limit });
      return levels;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch levels';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelCount = async (): Promise<number> => {
    try {
      return await gameService.getLevelCount();
    } catch (err) {
      console.error('Error getting level count:', err);
      return 0;
    }
  };

  const getLevel = async (levelId: number): Promise<GameLevel | null> => {
    try {
      return await gameService.getLevel(levelId);
    } catch (err) {
      console.error('Error getting level:', err);
      return null;
    }
  };

  const createLevel = async (levelData: number[]): Promise<{ id: number; txHash?: string } | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error(isWeb3Mode() ? 'Wallet not connected' : 'User not authenticated');
      }

      const result = await gameService.createLevel({ levelData, creator: userId });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create level';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Player operations
  const getPlayer = async (playerId?: string): Promise<GamePlayer | null> => {
    try {
      const userId = playerId || await getCurrentUserId();
      if (!userId) return null;
      
      return await gameService.getPlayer(userId);
    } catch (err) {
      console.error('Error getting player:', err);
      return null;
    }
  };

  const completeLevel = async (levelId: number, levelData?: GameLevel): Promise<{ success: boolean; txHash?: string } | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error(isWeb3Mode() ? 'Wallet not connected' : 'User not authenticated');
      }

      const result = await gameService.completeLevel({
        levelId,
        playerId: userId,
        levelData, // Required for web3 mode
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete level';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const isLevelCompleted = async (levelId: number): Promise<boolean> => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;
      
      return await gameService.isLevelCompleted(userId, levelId);
    } catch (err) {
      console.error('Error checking level completion:', err);
      return false;
    }
  };

  const getPlayerCreatedLevels = async (playerId?: string): Promise<GameLevel[]> => {
    try {
      const userId = playerId || await getCurrentUserId();
      if (!userId) return [];
      
      return await gameService.getPlayerCreatedLevels(userId);
    } catch (err) {
      console.error('Error getting player created levels:', err);
      return [];
    }
  };

  // Auth operations (REST mode only)
  const login = async (username: string, password: string) => {
    if (isWeb3Mode()) {
      throw new Error('Login not available in Web3 mode');
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await gameService.login?.(username, password);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    if (isWeb3Mode()) {
      throw new Error('Registration not available in Web3 mode');
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await gameService.register?.(username, password);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isWeb3Mode()) {
      throw new Error('Logout not available in Web3 mode');
    }

    try {
      await gameService.logout?.();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getCurrentUser = async (): Promise<GamePlayer | null> => {
    if (isWeb3Mode()) {
      const userId = await getCurrentUserId();
      return userId ? await getPlayer(userId) : null;
    } else {
      return await gameService.getCurrentUser?.() || null;
    }
  };

  return {
    // State
    isLoading,
    error,
    isWeb3Mode: isWeb3Mode(),

    // Level operations
    getLevels,
    getLevelCount,
    getLevel,
    createLevel,

    // Player operations
    getPlayer,
    completeLevel,
    isLevelCompleted,
    getPlayerCreatedLevels,

    // Auth operations (REST only)
    login,
    register,
    logout,
    getCurrentUser,

    // Utility
    getCurrentUserId,
  };
};