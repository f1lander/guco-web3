'use client';

import React, { useState, useEffect } from 'react';
import { GridIcon, Play } from 'lucide-react';

interface GameViewProps {
  showControls?: boolean;
  gridSize?: number;
  robotPosition?: { x: number, y: number };
  obstacles?: Array<{ type: string; position: { x: number, y: number } }>;
  onMove?: (position: { x: number, y: number }) => void;
  commands?: string[];
  currentCommand?: number;
  customRobotRender?: () => React.ReactNode;
}

const GameView: React.FC<GameViewProps> = ({ 
  showControls = true,
  gridSize = 8,
  robotPosition: initialPosition = { x: 0, y: 0 },
  obstacles = [],
  onMove,
  commands = [],
  currentCommand = -1,
  customRobotRender,
}) => {
  const [robotPosition, setRobotPosition] = useState(initialPosition);

  const getEmoji = (type: string) => {
    switch(type) {
      case 'wall': return '🧱';
      case 'goal': return '🎯';
      case 'item': return '⭐';
      case 'light': return '💡';
      default: return '';
    }
  };

  useEffect(() => {
    if (onMove) {
      onMove(robotPosition);
    }
  }, [robotPosition, onMove]);

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl overflow-hidden">
      {showControls && (
        <div className="absolute top-2 left-2 flex items-center gap-2 text-slate-400">
          <GridIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">Vista del Juego</span>
        </div>
      )}
      
      <div className={`grid grid-cols-${gridSize} gap-1 p-4 aspect-square`}>
        {Array(gridSize * gridSize).fill(0).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isRobotHere = x === robotPosition.x && y === robotPosition.y;
          const obstacle = obstacles.find(o => o.position.x === x && o.position.y === y);
          
          return (
            <div 
              key={i} 
              className={`relative bg-slate-700/50 rounded-sm aspect-square border border-slate-600/30
                ${isRobotHere ? 'bg-blue-500/20' : ''}`}
            >
              {isRobotHere && (
                customRobotRender ? customRobotRender() : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                )
              )}
              {obstacle && !isRobotHere && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">{getEmoji(obstacle.type)}</span>
                </div>
              )}
            </div>
          );
        })}
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

      {showControls && (
        <div className="absolute bottom-2 right-2">
          <button className="game-button flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-500 rounded-lg">
            <Play className="w-4 h-4" />
            Ejecutar Código
          </button>
        </div>
      )}
    </div>
  );
};

export default GameView;
