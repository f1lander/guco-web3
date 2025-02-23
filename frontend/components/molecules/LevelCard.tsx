'use client';

import { buildDataUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorVariants = {
  yellow: {
    card: "bg-yellow-400 border-yellow-600",
    shadow: "shadow-[inset_0_-8px_0_0_#B45309]",
    activeShadow: "active:shadow-[inset_0_-4px_0_0_#B45309]",
    header: "bg-purple-700 border-purple-900 shadow-[inset_0_-4px_0_0_#581C87]",
    headerText: "text-yellow-300",
    progress: "bg-yellow-500"
  },
  purple: {
    card: "bg-purple-400 border-purple-600",
    shadow: "shadow-[inset_0_-8px_0_0_#581C87]",
    activeShadow: "active:shadow-[inset_0_-4px_0_0_#581C87]",
    header: "bg-yellow-500 border-yellow-600 shadow-[inset_0_-4px_0_0_#B45309]",
    headerText: "text-purple-900",
    progress: "bg-purple-500"
  },
  blue: {
    card: "bg-blue-400 border-blue-600",
    shadow: "shadow-[inset_0_-8px_0_0_#1E40AF]",
    activeShadow: "active:shadow-[inset_0_-4px_0_0_#1E40AF]",
    header: "bg-yellow-500 border-yellow-600 shadow-[inset_0_-4px_0_0_#B45309]",
    headerText: "text-blue-900",
    progress: "bg-blue-500"
  }
} as const;

type ColorVariant = keyof typeof colorVariants;

type Level = {
  levelData: `0x${string}`;
  creator: `0x${string}`;
  playCount: bigint;
  completions: bigint;
  verified: boolean;
};

interface LevelCardProps {
  level: Level;
  index: number;
  color?: ColorVariant;
}

export function LevelCard({ level, index, color = 'yellow' }: LevelCardProps) {
  const creatorImage = buildDataUrl(level.creator);
  const completionRate = Number(level.completions) > 0 
    ? (Number(level.completions) * 100 / Number(level.playCount)).toFixed(1) 
    : 0;

  const colors = colorVariants[color];

  return (
    <Link 
      href={`/dashboard/level?levelData=${level.levelData}`}
      className={cn(
        "group relative p-6 transition-all duration-200",
        "rounded-lg border-2",
        colors.card,
        colors.shadow,
        colors.activeShadow,
        "active:translate-y-2",
        "hover:brightness-110"
      )}
    >
      {/* Header plate */}
      <div className={cn(
        "absolute -top-3 left-1/2 -translate-x-1/2 w-4/5 h-8",
        "rounded-md border-2",
        "flex items-center justify-center",
        colors.header
      )}>
        <span className={cn("font-bold", colors.headerText)}>
          Level {index + 1}
        </span>
      </div>

      <div className="relative flex flex-col gap-4 pt-4">
        {/* Creator info */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={creatorImage}
              alt={`Creator ${level.creator}`}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm text-purple-900 font-semibold">
            by {level.creator.slice(0, 6)}...{level.creator.slice(-4)}
          </p>
          {level.verified && (
            <Star className="h-5 w-5 text-yellow-600 ml-auto" fill="currentColor" />
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-900" />
            <span className="font-bold text-purple-900">
              {Number(level.playCount).toString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-purple-900" />
            <span className="font-bold text-purple-900">{completionRate}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className={cn("h-3 rounded-full", colors.progress)}>
          <div 
            className="h-full bg-purple-700 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </Link>
  );
} 