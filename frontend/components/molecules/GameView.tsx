'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  const [previousRobotPos, setPreviousRobotPos] = useState<{ x: number, y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState<number>(0);
  
  // Calculate tile size on mount and window resize
  useEffect(() => {
    const updateTileSize = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        setTileSize(gridWidth / GRID_WIDTH);
      }
    };
    
    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, []);
  
  // Memoize robot position to prevent recalculation on every render
  const robotPosition = useMemo(() => {
    const robotIndex = level.findIndex(tile => tile === TileType.ROBOT);
    return {
      x: robotIndex % GRID_WIDTH,
      y: Math.floor(robotIndex / GRID_WIDTH)
    };
  }, [level]);
  
  // Update previousRobotPos when robotPosition changes
  useEffect(() => {
    if (previousRobotPos === null) {
      setPreviousRobotPos(robotPosition);
    } else if (robotPosition.x !== previousRobotPos.x || robotPosition.y !== previousRobotPos.y) {
      setPreviousRobotPos(robotPosition);
    }
  }, [robotPosition, previousRobotPos]);

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
  };

  // Create a clean grid without the robot
  const gridWithoutRobot = useMemo(() => {
    // Create a copy of the level without the robot
    const levelWithoutRobot = [...level];
    const robotIndex = level.findIndex(tile => tile === TileType.ROBOT);
    if (robotIndex !== -1) {
      levelWithoutRobot[robotIndex] = TileType.EMPTY;
    }
    
    // Convert to 2D grid
    return Array.from({ length: GRID_HEIGHT }, (_, rowIndex) =>
      Array.from({ length: GRID_WIDTH }, (_, colIndex) =>
        levelWithoutRobot[rowIndex * GRID_WIDTH + colIndex]
      )
    );
  }, [level]);

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl md:rounded-none overflow-hidden flex flex-col">
      <div 
        ref={gridRef}
        className={`flex-1 p-2 transition-transform duration-300 ${isRotated ? 'rotate-90 scale-[0.65]' : ''} relative`}
      >
        <div className="w-full min-w-full mx-auto">
          {gridWithoutRobot.map((row, rowIndex) => (
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
          
          {/* Animated Robot */}
          {tileSize > 0 && (
            <div 
              className="absolute transition-all duration-500 ease-in-out"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                top: `${robotPosition.y * tileSize}px`,
                left: `${robotPosition.x * tileSize}px`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className={`text-4xl transform transition-all duration-300 
                    ${robotState.state === 'on' ? 'scale-100' : 'scale-90 opacity-50'}`}
                >
                  🤖
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

GameView.displayName = 'GameView';

export default GameView;
