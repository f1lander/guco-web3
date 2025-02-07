'use client';

import React, { useState, useEffect } from 'react';
import { GridIcon, Play } from 'lucide-react';

// Define tile types
export enum TileType {
  EMPTY = 0,
  OBSTACLE = 1,
  GOAL = 2,
  ROBOT = 3,
  COLLECTIBLE = 4,
}

// Define default values outside the component
const DEFAULT_LEVEL = [
  [0, 0, 0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0],
];

const DEFAULT_ROBOT_POSITION = { x: 0, y: 3 }; // Matches DEFAULT_LEVEL robot position
const DEFAULT_COMMANDS: string[] = [];
const DEFAULT_CURRENT_COMMAND = -1;

interface GameViewProps {
  showControls?: boolean;
  level?: number[][];
  robotPosition?: { x: number, y: number };
  onMove?: (position: { x: number, y: number }) => void;
  commands?: string[];
  currentCommand?: number;
}

const GameView: React.FC<GameViewProps> = ({ 
  showControls = true,
  level = DEFAULT_LEVEL,
  robotPosition = DEFAULT_ROBOT_POSITION,
  onMove = () => {},
  commands = DEFAULT_COMMANDS,
  currentCommand = DEFAULT_CURRENT_COMMAND,
}) => {
  const getEmoji = (tileType: TileType) => {
    switch(tileType) {
      case TileType.OBSTACLE: return '🧱';
      case TileType.GOAL: return '🎯';
      case TileType.COLLECTIBLE: return '⭐';
      case TileType.ROBOT: return '🤖';
      default: return '';
    }
  };

  useEffect(() => {
    if (onMove) {
      onMove(robotPosition);
    }
  }, [robotPosition, onMove]);

  const gridSize = level[0].length; // Assuming square grid

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl md:rounded-none overflow-hidden flex flex-col">
      {showControls && (
        <div className="p-2 flex items-center gap-2 text-slate-400">
          <GridIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">Vista del Juego</span>
        </div>
      )}
      
      <div className="flex-1 p-2">
        <div 
          className="w-full h-full grid gap-0.5" 
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${level.length}, 1fr)`
          }}
        >
          {level.map((row, y) => 
            row.map((tile, x) => {
              const isRobotHere = x === robotPosition.x && y === robotPosition.y;
              
              return (
                <div 
                  key={`${x}-${y}`} 
                  className={`relative bg-slate-700/50 border border-slate-600/30
                    ${isRobotHere ? 'bg-blue-500/20' : ''}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">
                      {isRobotHere ? '🤖' : getEmoji(tile as TileType)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {commands.length > 0 && (
        <div className="absolute left-2 bottom-2 flex flex-col gap-1 bg-slate-900/50 p-2 rounded-lg">
          {commands.map((cmd, idx) => (
            <div
              key={idx}
              className={`text-sm font-mono ${
                idx === currentCommand ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              {cmd}
            </div>
          ))}
        </div>
      )}

      {/* {showControls && (
        // <div className="absolute bottom-2 right-2">
        //   <button className="game-button flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-lg">
        //     <Play className="w-4 h-4" />
        //     Ejecutar Código
        //   </button>
        // </div>
      )} */}
    </div>
  );
};


export default GameView;
