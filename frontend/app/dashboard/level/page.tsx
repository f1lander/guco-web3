'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bytes32ToLevel } from '@/lib/utils';
import PlayGameSection from '@/components/organisms/PlayGameSection';

const LevelDetailHeader = ({ levelId, levelDescription, levelData, levelCompletions }: { levelId: number, levelDescription: string, levelData: string, levelCompletions: number }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Level Details</h1>

      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-500">Level ID: {levelId}</p>
        <p className="text-gray-500">Level Dec: {levelDescription}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-500">Level Data: {levelData}</p>
        <p className='text-gray-500'>Users who completed this level: {levelCompletions}</p>
      </div>
    </div>
  );
};

export default function LevelDetail() {
  const searchParams = useSearchParams();
  const levelData = searchParams.get('levelData');
  let level: number[] = [];

  if (!levelData) {
    return <div>No level data provided</div>;
  }

  try {
    level = bytes32ToLevel(levelData as `0x${string}`);
  } catch (error) {
    return <div>Invalid level data</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <LevelDetailHeader levelId={0} levelDescription={''} levelData={''} levelCompletions={0} /> */}

      <PlayGameSection levelData={level} />
    </div>
  );
}
