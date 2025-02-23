'use client';

import { cn } from '@/lib/utils';

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="text-start">
        <div className="h-12 w-64 bg-gray-800 rounded-lg" />
        <div className="h-6 w-48 bg-gray-800 rounded-lg mt-2" />
      </div>

      {/* Stats Widgets Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "relative p-4 rounded-lg border-2",
              "bg-gray-800 border-gray-700",
              "flex items-center gap-3"
            )}
          >
            {/* Icon Skeleton */}
            <div className="p-3 rounded-full bg-gray-700">
              <div className="w-6 h-6" />
            </div>
            {/* Text Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-6 w-24 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 