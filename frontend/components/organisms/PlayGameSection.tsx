'use client';

import React, { useState, useEffect } from 'react';
import CodeEditorSection from './CodeEditorSection';
import { useGucoLevels } from '@/hooks/useGucoLevels';

interface PlayGameSectionProps {
  levelData: number[];  // Decoded bytes32 data from chain
  levelId: number;
}

const PlayGameSection = ({ levelData: initialLevelData, levelId }: PlayGameSectionProps) => {

  const [levelData, setLevelData] = useState<number[]>(initialLevelData);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  console.log('levelId', levelId);

  const { isLevelCompleted } = useGucoLevels();

  useEffect(() => {
    const checkLevelCompletion = async () => {
      const isCompleted = await isLevelCompleted(levelId);
      console.log('isCompleted', isCompleted);
      setIsCompleted(isCompleted);
    };
    checkLevelCompletion();
  }, [isLevelCompleted, levelId]);

  return (
    <div id="playground" className="w-full md:min-h-[calc(100vh-200px)]">
      {/* Code Editor Area */}
      <CodeEditorSection
        levelId={levelId}
        levelData={levelData}
        setLevelData={setLevelData}
        isCompleted={isCompleted}
      />

    </div>
  );
};

export default PlayGameSection; 