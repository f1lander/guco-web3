'use client';

import React from 'react';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturesSection from '@/components/organisms/FeaturesSection';
import TutorialSection from '@/components/organisms/TutorialSection';
import GameSection from '@/components/organisms/GameSection';
import BlockchainSection from '@/components/organisms/BlockchainSection';
import LeaderboardSection from '@/components/organisms/LeaderboardSection';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen gap-8">
      <HeroSection />
      <FeaturesSection />
      <GameSection />
      <BlockchainSection />
      <LeaderboardSection />
      <TutorialSection />
    </div>
  );
}