/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';

import Identicon from 'identicon.js';
import { twMerge } from 'tailwind-merge';
import { COMMAND_CATEGORIES, COMMANDS, GRID_WIDTH } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const middleEllipsis = (str: string, len: number) => {
  if (!str) {
    return '';
  }
  return `${str.substr(0, len)}...${str.substr(str.length - len, str.length)}`;
};

export const truncateEthAddress = (
  address: string,
  _sliceStart = [0, 6],
  sliceEnd = 4,
): string => {
  if (!address) {
    return '';
  }
  return (
    address.slice(_sliceStart[0], _sliceStart[1]) +
    '...' +
    address.slice(address.length - sliceEnd, address.length)
  );
};

export const bigIntToNumber = (value: bigint) =>
  Number.isSafeInteger(value) ? Number(value) : 0;

export function buildDataUrl(address: string): string {
  return 'data:image/png;base64,' + new Identicon(address, 420).toString();
}

// Helper function to convert level array to bytes32
/**
 * Encodes an array of levels (0-4) into a bytes32 hex string
 * @param level - Array of integers between 0-4 (must be exactly 32 elements)
 * @returns A bytes32 hex string compatible with Solidity
 */
export const levelToBytes32 = (level: number[]): `0x${string}` => {
  // Validate level array length
  if (level.length !== 32) {
    throw new Error('Level must have exactly 32 numbers');
  }

  // Validate values (0-4 only)
  if (level.some(val => val < 0 || val > 4)) {
    throw new Error('Level values must be between 0 and 4');
  }

  // Method 1: Simple byte packing
  // This is the most straightforward approach - each number gets its own byte
  const bytes = new Uint8Array(32);
  for (let i = 0; i < level.length; i++) {
    bytes[i] = level[i];
  }

  // Convert to hex string
  const hexString: `0x${string}` = '0x' + Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('') as `0x${string}`;

  // Validate encoding by decoding and comparing
  const decodedLevel = bytes32ToLevel(hexString);
  const isValid = level.every((num, index) => num === decodedLevel[index]);

  if (!isValid) {
    throw new Error('Encoding validation failed: decoded value does not match original level');
  }

  return hexString as `0x${string}`;
};

// Helper function to convert bytes32 back to level array
export const bytes32ToLevel = (bytes32Value: `0x${string}`): number[] => {

  // Remove 0x prefix
  const hex = bytes32Value.slice(2);

  if (hex.length !== 64) {
    throw new Error('Invalid bytes32 hex string length');
  }

  const result: number[] = [];

  // Extract each byte
  for (let i = 0; i < 32; i++) {
    const byteHex = hex.substring(i * 2, i * 2 + 2);
    result.push(parseInt(byteHex, 16));
  }

  return result;
};

export function getDifficulty(level: { playCount: bigint; completions: bigint }): 'easy' | 'medium' | 'hard' {
  const completionRate = Number(level.completions) / Number(level.playCount) * 100;
  if (completionRate > 75) return 'easy';
  if (completionRate > 25) return 'medium';
  return 'hard';
}

export const getEmoji = (tileType: TileType) => {
  switch (tileType) {
    case TileType.OBSTACLE: return '🪨';
    case TileType.GOAL: return '🏁';
    case TileType.COLLECTIBLE: return '🪴';
    case TileType.ROBOT: return '🤖';
    default: return '';
  }
};
// Define tile types
export enum TileType {
  EMPTY = 0,
  OBSTACLE = 1,
  GOAL = 2,
  ROBOT = 3,
  COLLECTIBLE = 4,
}


export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export type RobotState = {
  collected: number;
  state: 'off' | 'on' | 'error';
}

export const generateRandomLevel = (difficulty: Difficulty = Difficulty.BEGINNER) => {
  const LEVEL_SIZE = 32;
  const level = new Array(LEVEL_SIZE).fill(TileType.EMPTY);

  // Place ROBOT at a random position (preferably in the first half)
  const robotPos = Math.floor(Math.random() * (LEVEL_SIZE / 2));
  level[robotPos] = TileType.ROBOT;

  // Place GOAL at a random position (preferably in the second half)
  const goalPos = Math.floor(LEVEL_SIZE / 2 + Math.random() * (LEVEL_SIZE / 2));
  level[goalPos] = TileType.GOAL;

  // Configure difficulty parameters
  const difficultyConfig = {
    [Difficulty.BEGINNER]: {
      obstacleChance: 0.2,    // 20% chance for obstacles
      collectibles: 0,        // No collectibles
    },
    [Difficulty.INTERMEDIATE]: {
      obstacleChance: 0.3,    // 30% chance for obstacles
      collectibles: Math.floor(Math.random() * 3) + 1, // 1-3 collectibles
    },
    [Difficulty.ADVANCED]: {
      obstacleChance: 0.4,    // 40% chance for obstacles
      collectibles: Math.floor(Math.random() * 3) + 3, // 3-5 collectibles
    },
  };

  const config = difficultyConfig[difficulty];

  // Add COLLECTIBLES
  for (let i = 0; i < config.collectibles; i++) {
    let pos;
    do {
      pos = Math.floor(Math.random() * LEVEL_SIZE);
    } while (level[pos] !== TileType.EMPTY);
    level[pos] = TileType.COLLECTIBLE;
  }

  // Add OBSTACLES ensuring there's always a valid path
  for (let i = 0; i < LEVEL_SIZE; i++) {
    if (level[i] === TileType.EMPTY && Math.random() < config.obstacleChance) {
      // Check if placing obstacle here would block the path
      const prevIsObstacle = i > 0 && level[i - 1] === TileType.OBSTACLE;
      const nextIsObstacle = i < LEVEL_SIZE - 1 && level[i + 1] === TileType.OBSTACLE;

      if (!prevIsObstacle && !nextIsObstacle) {
        level[i] = TileType.OBSTACLE;
      }
    }
  }
  console.log("level", level);
  return level;
};

const luaCompiler = (commands: string[]) => {
  const validCommands = Object.values(COMMAND_CATEGORIES).flatMap(
    category => category.commands.map(cmd => cmd.command)
  );

  const validatedCommands = commands.map(cmd => {
    const cleanCommand = cmd.replace('robot:', '').trim();
    console.log("cleanCommand", cleanCommand);

    if (!validCommands.includes(cleanCommand as typeof validCommands[number])) {
      throw new Error(`Invalid command: ${cmd}`);
    }

    return cmd.trim();
  });

  return validatedCommands;
};

const javascriptCompiler = (commands: string[]) => {
  const validCommands = Object.values(COMMAND_CATEGORIES).flatMap(
    category => category.commands.map(cmd => cmd.command)
  );

  const validatedCommands = commands.map(cmd => {
    const cleanCommand = cmd.replace('robot:', '').trim();
    if (!validCommands.includes(cleanCommand as typeof validCommands[number])) {
      throw new Error(`Invalid command: ${cmd}`);
    }
    return cmd.trim();
  });

  return validatedCommands;
};

export const executeCode = (level: number[], command: string) => {
  //   I want that compileCode function return me not just the validatedCommands, I need to the actual instructtions that the robot needs to move so for exmaple

  // ['moverDerecha()', moverArriba(), MoverAbajo(), recolectar()]

  // I was thinking what if, compiling these commands I returned the the movements needed, based on the 
};

// Update compileCode function to handle CommandWithMeta objects
export const compileCode = (commands: string[] | CommandWithMeta[], language: 'lua' | 'javascript'): string[] => {
  const cleanCommands = Array.isArray(commands) ? 
    commands.map(cmd => typeof cmd === 'string' ? cmd : cmd.command) : 
    [];
    
  if (language === 'lua') {
    return luaCompiler(cleanCommands);
  } else if (language === 'javascript') {
    return javascriptCompiler(cleanCommands);
  }
  return cleanCommands;
};

export const moveRobot = (
  levelData: number[],
  robotState: RobotState,
  command: (typeof COMMANDS)[keyof typeof COMMANDS]
): { newLevel: number[], newRobotState: RobotState } => {
  const position = levelData.findIndex(tile => tile === TileType.ROBOT);
  let newPosition = position;

  // Calculate current x,y coordinates
  const x = position % GRID_WIDTH;
  const y = Math.floor(position / GRID_WIDTH);

  // Create a new array immediately to avoid mutations
  const newLevel = [...levelData];

  switch (command) {
    case 'encender()':
      return {
        newLevel,
        newRobotState: { ...robotState, state: 'on' }
      };
    case 'apagar()':
      return {
        newLevel,
        newRobotState: { ...robotState, state: 'off' }
      };
    case 'moverDerecha()':
      if (x < GRID_WIDTH - 1) newPosition = position + 1;
      break;
    case 'moverIzquierda()':
      if (x > 0) newPosition = position - 1;
      break;
    case 'moverArriba()':
      if (y > 0) newPosition = position - GRID_WIDTH;
      break;
    case 'moverAbajo()':
      if (y < 3) newPosition = position + GRID_WIDTH;
      break;
    case 'saltarDerecha()':
      if (x < GRID_WIDTH - 2) newPosition = position + 2;
      break;
    case 'saltarIzquierda()':
      if (x > 1) newPosition = position - 2;
      break;
    case 'saltarArriba()':
      if (y > 1) newPosition = position - (GRID_WIDTH * 2);
      break;
    case 'saltarAbajo()':
      if (y < 2) newPosition = position + (GRID_WIDTH * 2);
      break;
  }

  // Check if new position is valid and different from current position
  if (newPosition !== position && newLevel[newPosition] !== TileType.OBSTACLE) {
    // Update robot position in level data
    newLevel[position] = TileType.EMPTY;
    newLevel[newPosition] = TileType.ROBOT;

    return {
      newLevel,
      newRobotState: { ...robotState }
    };
  }

  // Return unchanged state if move was invalid
  return {
    newLevel,
    newRobotState: robotState
  };
};

// Enhance calculateNextPosition to properly handle the recolectar() command
const calculateNextPosition = (
  levelData: number[],
  command: string,
  initialLevelData: number[] = [] // Add initialLevelData as a parameter
): { newLevel: number[], validMove: boolean, collectibleCollected: boolean } => {
  const position = levelData.findIndex(tile => tile === TileType.ROBOT);
  let newPosition = position;
  let validMove = true;
  let collectibleCollected = false;

  // Create a new array immediately to avoid mutations
  const newLevel = [...levelData];

  // Calculate current x,y coordinates
  const x = position % GRID_WIDTH;
  const y = Math.floor(position / GRID_WIDTH);

  switch (command) {
    case 'robot = Robot.new()':
      return { newLevel, validMove: true, collectibleCollected: false };
    case 'encender()':
      return { newLevel, validMove: true, collectibleCollected: false };
    case 'apagar()':
      return { newLevel, validMove: true, collectibleCollected: false };
    case 'recolectar()':
      // If initialLevelData is provided, check if the robot's current position originally had a collectible
      if (initialLevelData.length > 0 && position !== -1) {
        if (initialLevelData[position] === TileType.COLLECTIBLE) {
          collectibleCollected = true;
        }
      } else {
        // Fallback to original logic if initialLevelData not provided
        collectibleCollected = position !== -1;
      }
      return { newLevel, validMove: true, collectibleCollected };
    case 'moverDerecha()':
      if (x < GRID_WIDTH - 1) newPosition = position + 1;
      else validMove = false;
      break;
    case 'moverIzquierda()':
      if (x > 0) newPosition = position - 1;
      else validMove = false;
      break;
    case 'moverArriba()':
      if (y > 0) newPosition = position - GRID_WIDTH;
      else validMove = false;
      break;
    case 'moverAbajo()':
      if (y < 3) newPosition = position + GRID_WIDTH;
      else validMove = false;
      break;
    case 'saltarDerecha()':
      if (x < GRID_WIDTH - 2) newPosition = position + 2;
      else validMove = false;
      break;
    case 'saltarIzquierda()':
      if (x > 1) newPosition = position - 2;
      else validMove = false;
      break;
    case 'saltarArriba()':
      if (y > 1) newPosition = position - (GRID_WIDTH * 2);
      else validMove = false;
      break;
    case 'saltarAbajo()':
      if (y < 2) newPosition = position + (GRID_WIDTH * 2);
      else validMove = false;
      break;
    default:
      validMove = false;
  }

  // Check if new position is valid and different from current position
  if (validMove && newPosition !== position) {
    if (newLevel[newPosition] === TileType.OBSTACLE) {
      validMove = false;
    } else {
      // Update robot position in level data
      newLevel[position] = TileType.EMPTY;
      newLevel[newPosition] = TileType.ROBOT;
    }
  }

  return { newLevel, validMove, collectibleCollected: false };
};

// Update commandsToMovementSequence to use initialLevelData
export const commandsToMovementSequence = (commands: string[], levelData: number[]): { 
  sequence: number[], 
  errorIndex: number | null,
  collectSteps: number[] // New array to track when to collect
} => {
  const sequence: number[] = [];
  const collectSteps: number[] = []; // Store indices of steps where collection happens
  let currentGrid = [...levelData];
  const initialLevelData = [...levelData]; // Keep a copy of the initial level data
  let errorIndex: number | null = null;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const cleanCommand = cmd.replace('robot:', '').trim();

    // Calculate the next position based on the command
    const { newLevel, validMove, collectibleCollected } = calculateNextPosition(
      currentGrid,
      cleanCommand,
      initialLevelData // Pass the initial level data
    );

    if (!validMove) {
      console.error(`Invalid move: ${cleanCommand}`);
      errorIndex = i;
      sequence.push(-1);
      return { sequence, errorIndex, collectSteps };
    }

    // If this is a collect command, mark this step regardless of whether something is collected
    // The CodeEditorSection will check if the robot is on a collectible when executing
    if (cleanCommand === 'recolectar()') {
      collectSteps.push(i);
    }

    // Update the current grid
    currentGrid = newLevel;

    // Find new robot position
    const newRobotPosition = currentGrid.findIndex(tile => tile === TileType.ROBOT);
    sequence.push(newRobotPosition);
  }

  return { sequence, errorIndex: null, collectSteps };
};

// Define an interface for command structure
export interface CommandWithMeta {
  command: string;
  isLoopStart?: boolean;
  isLoopEnd?: boolean;
  loopCount?: number;
  inLoop?: boolean;
  indentLevel?: number;
}

export const compileUserCode = (code: string): CommandWithMeta[] => {
  // Extract only the user code section
  const userCodeSection = code.split('-- Area de codigo para programar el robot')[1]?.split('-- class definition')[0];
  
  if (!userCodeSection) return [];
  
  const lines = userCodeSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('--')); // Remove comments and empty lines
  
  // Track variables defined in the code
  const variables: Record<string, number> = {};
  
  // Process for loops and preserve structure
  const structuredCommands: CommandWithMeta[] = [];
  let indentLevel = 0;
  let inForLoop = false;
  let forLoopStart = 0;
  let forLoopEnd = 0;
  let forLoopCommands: CommandWithMeta[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for variable assignments
    const varAssignmentMatch = line.match(/(\w+)\s*=\s*(\d+)/);
    if (varAssignmentMatch && !line.includes('for') && !line.includes('robot')) {
      const variableName = varAssignmentMatch[1];
      const variableValue = parseInt(varAssignmentMatch[2], 10);
      variables[variableName] = variableValue;
      continue;
    }
    
    // Check for for loop start with either literal numbers or variables
    const forLoopMatch = line.match(/for\s+(\w+)\s*=\s*(\w+|\d+)\s*,\s*(\w+|\d+)\s*do/);
    if (forLoopMatch) {
      inForLoop = true;
      indentLevel++;
      
      // Get start value (either a number or a variable)
      let startValue = forLoopMatch[2];
      if (/^\d+$/.test(startValue)) {
        forLoopStart = parseInt(startValue, 10);
      } else if (variables[startValue] !== undefined) {
        forLoopStart = variables[startValue];
      } else {
        // Default to 1 if variable not found
        forLoopStart = 1;
        console.warn(`Variable ${startValue} not found, using default value 1`);
      }
      
      // Get end value (either a number or a variable)
      let endValue = forLoopMatch[3];
      if (/^\d+$/.test(endValue)) {
        forLoopEnd = parseInt(endValue, 10);
      } else if (variables[endValue] !== undefined) {
        forLoopEnd = variables[endValue];
      } else {
        // Default to the start value if variable not found
        forLoopEnd = forLoopStart;
        console.warn(`Variable ${endValue} not found, using default value ${forLoopStart}`);
      }
      
      // Record the loop start in structured commands
      const loopCount = Math.max(0, forLoopEnd - forLoopStart + 1);
      structuredCommands.push({
        command: `for ${forLoopMatch[1]}=${forLoopStart},${forLoopEnd} do`,
        isLoopStart: true,
        loopCount: loopCount,
        indentLevel: indentLevel
      });
      
      forLoopCommands = [];
      continue;
    }
    
    // Check for end of for loop
    if (inForLoop && line === 'end') {
      inForLoop = false;
      
      // Add all loop commands to the structured commands with metadata
      forLoopCommands.forEach(cmd => {
        structuredCommands.push({
          ...cmd,
          inLoop: true,
          indentLevel: indentLevel
        });
      });
      
      // Record the loop end
      structuredCommands.push({
        command: 'end',
        isLoopEnd: true,
        indentLevel: indentLevel
      });
      
      indentLevel--;
      continue;
    }
    
    // Process commands inside or outside for loop
    if (line.includes('robot:') || line.includes('robot =') || line.includes('Robot.new')) {
      const cmdWithoutSemicolon = line.replace(/;$/, '');
      
      if (inForLoop) {
        // Store commands inside the loop temporarily
        forLoopCommands.push({
          command: cmdWithoutSemicolon,
          indentLevel: indentLevel
        });
      } else {
        // Add normal commands to the structured array
        structuredCommands.push({
          command: cmdWithoutSemicolon,
          indentLevel: 0
        });
      }
    }
  }
  
  return structuredCommands;
};

// Function to flatten the structured commands for execution
export const flattenCommands = (structuredCommands: CommandWithMeta[]): string[] => {
  const flatCommands: string[] = [];
  
  for (let i = 0; i < structuredCommands.length; i++) {
    const cmd = structuredCommands[i];
    
    if (cmd.isLoopStart && cmd.loopCount) {
      // Find the matching loop end
      let loopEndIndex = i + 1;
      let nestLevel = 1;
      
      while (nestLevel > 0 && loopEndIndex < structuredCommands.length) {
        if (structuredCommands[loopEndIndex].isLoopStart) nestLevel++;
        if (structuredCommands[loopEndIndex].isLoopEnd) nestLevel--;
        loopEndIndex++;
      }
      
      // Extract the loop body
      const loopBody = structuredCommands.slice(i + 1, loopEndIndex - 1);
      const filteredLoopBody = loopBody.filter(cmd => !cmd.isLoopStart && !cmd.isLoopEnd);
      
      // Repeat the loop body for loopCount times
      for (let j = 0; j < cmd.loopCount; j++) {
        filteredLoopBody.forEach(loopCmd => {
          flatCommands.push(loopCmd.command);
        });
      }
      
      // Skip to after the loop
      i = loopEndIndex - 1;
    } else if (!cmd.isLoopStart && !cmd.isLoopEnd) {
      flatCommands.push(cmd.command);
    }
  }
  
  return flatCommands;
};