'use client';

import React, { useState } from 'react';
import CodeEditorSection from './CodeEditorSection';
import { RobotState, TileType } from '@/lib/utils';

interface PlayGameSectionProps {
  levelData: number[];  // Decoded bytes32 data from chain
}

const PlayGameSection = ({ levelData: initialLevelData }: PlayGameSectionProps) => {

  const [levelData, setLevelData] = useState<number[]>(initialLevelData);

  const [robotState, setRobotState] = useState<RobotState>({
    collected: 0,
    state: 'off',
  });
  
  return (
    <div id="playground" className="w-full md:min-h-[calc(100vh-200px)]">
      {/* Code Editor Area */}
      <CodeEditorSection
        levelData={levelData}
        setLevelData={setLevelData}
        robotState={robotState}
        setRobotState={setRobotState}
      />

    </div>
  );
};

export default PlayGameSection; 