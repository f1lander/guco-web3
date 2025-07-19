import { GameService } from './types';
import { Web3GameService } from './web3-service';
import { RestGameService } from './rest-service';

// Environment configuration
console.log("env var", process.env.NEXT_PUBLIC_WEB3_ENABLED);
const isWeb3Enabled = process.env.NEXT_PUBLIC_WEB3_ENABLED === 'true';
console.log("isWeb3Enabled", isWeb3Enabled);

export const gameService: GameService = isWeb3Enabled 
  ? new Web3GameService()
  : new RestGameService();

export const getGameService = (): GameService => gameService;

export const isWeb3Mode = (): boolean => isWeb3Enabled;

export const getServiceMode = (): 'web3' | 'rest' => isWeb3Enabled ? 'web3' : 'rest';