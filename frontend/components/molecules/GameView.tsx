'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LEVEL, GRID_WIDTH, GRID_HEIGHT } from '@/lib/constants';
import { TileType } from '@/lib/utils';
import { GameTile } from '../atoms/GameTile';

interface GameViewProps {
  showControls?: boolean;
  level?: number[];
  onMove?: (position: { x: number, y: number }) => void;
  robotState?: { collected: number, state: 'off' | 'on' | 'error' };
  editable?: boolean;
  onLevelChange?: (newLevel: number[]) => void;
}

const GameView: React.FC<GameViewProps> = ({
  robotState = { collected: 0, state: 'off' },
  level = DEFAULT_LEVEL,
  onMove = () => { },
  editable = false,
  onLevelChange = () => { },
}) => {
  const [isRotated, setIsRotated] = useState(false);
  // Memoize robot position to prevent recalculation on every render
  const robotPosition = useMemo(() => {
    const robotIndex = level.findIndex(tile => tile === TileType.ROBOT);
    return {
      x: robotIndex % GRID_WIDTH,
      y: Math.floor(robotIndex / GRID_WIDTH)
    };
  }, [level]);

  // Move callback with proper dependency array
  useEffect(() => {
    onMove(robotPosition);
  }, [robotPosition, onMove]);

  // Simple handler, no need for memoization
  const handleTileChange = (index: number, value: TileType) => {
    const newLevel = [...level];

    // If placing a robot or goal, remove the existing one first
    if (value === TileType.ROBOT || value === TileType.GOAL) {
      const existingIndex = level.findIndex(tile => tile === value);
      if (existingIndex !== -1) {
        newLevel[existingIndex] = TileType.EMPTY;
      }
    }

    newLevel[index] = value;
    onLevelChange(newLevel);
    console.log("newLevel", newLevel);
  };

  // Create 2D grid from flat array
  const grid = Array.from({ length: GRID_HEIGHT }, (_, rowIndex) =>
    Array.from({ length: GRID_WIDTH }, (_, colIndex) =>
      level[rowIndex * GRID_WIDTH + colIndex]
    )
  );

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl md:rounded-none overflow-hidden flex flex-col">
      <div className={`flex-1 p-2 transition-transform duration-300 ${isRotated ? 'rotate-90 scale-[0.65]' : ''}`}>
        <div className="w-full min-w-full mx-auto">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex flex-row w-full">
              {row.map((tile, colIndex) => (
                <GameTile
                  key={`${rowIndex}-${colIndex}`}
                  type={tile as TileType}
                  onClick={(value) => handleTileChange(rowIndex * GRID_WIDTH + colIndex, value)}
                  editable={editable}
                  className="flex-1 aspect-square"
                  robotState={robotState}
                />
              ))}
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

GameView.displayName = 'GameView';

export default GameView;
