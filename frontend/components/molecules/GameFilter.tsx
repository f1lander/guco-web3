'use client';

import { cn } from '@/lib/utils';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/providers/language-provider';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type SortBy = 'newest' | 'completion';

interface GameFilterProps {
  onDifficultyChange: (difficulty: Difficulty) => void;
  onSortChange: (sort: SortBy) => void;
}

export function GameFilter({ onDifficultyChange, onSortChange }: GameFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all');
  const [selectedSort, setSelectedSort] = useState<SortBy>('newest');
  const { t } = useTranslation();

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'all', label: t('filters.difficulty.all'), color: 'bg-gray-500' },
    { value: 'easy', label: t('filters.difficulty.easy'), color: 'bg-green-500' },
    { value: 'medium', label: t('filters.difficulty.medium'), color: 'bg-yellow-500' },
    { value: 'hard', label: t('filters.difficulty.hard'), color: 'bg-red-500' }
  ];

  const sorts = [
    { value: 'newest', label: t('filters.sort.newest'), icon: ArrowUpDown },
    { value: 'completion', label: t('filters.sort.completion'), icon: ArrowUpDown }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {/* Sort Button */}
      {sorts.map((sort) => (
        <button
          key={sort.value}
          onClick={() => {
            setSelectedSort(sort.value as SortBy);
            onSortChange(sort.value as SortBy);
          }}
          className={cn(
            "h-11 px-4 py-2 rounded-xl transition-all duration-200",
            "border-2 border-emerald-700/30",
            "flex items-center gap-2 whitespace-nowrap",
            selectedSort === sort.value 
              ? "bg-emerald-600/20 shadow-[inset_0_-4px_0_0_rgba(5,150,105,0.2)]"
              : "bg-emerald-500/10 hover:bg-emerald-500/20"
          )}
        >
          <sort.icon className="w-4 h-4 text-gray-200/90" />
          <span className="text-sm font-medium text-gray-100">{sort.label}</span>
        </button>
      ))}

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-11 px-4 py-2 rounded-xl transition-all duration-200",
            "border-2 border-emerald-700/30",
            "flex items-center gap-2 whitespace-nowrap",
            isOpen 
              ? "bg-emerald-600/20 shadow-[inset_0_-4px_0_0_rgba(5,150,105,0.2)]"
              : "bg-emerald-500/10 hover:bg-emerald-500/20"
          )}
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-200/90" />
          <span className="text-sm font-medium text-gray-100">{t('filters.difficulty.title')}</span>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)} 
            />
            {/* Dropdown */}
            <div className="absolute top-full mt-2 right-0 w-48 p-2 rounded-xl 
              bg-gray-800/90 backdrop-blur-sm border-2 border-emerald-700/30 shadow-lg
              z-50 sm:right-0 right-[-50px]"
            >
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => {
                    setSelectedDifficulty(diff.value);
                    onDifficultyChange(diff.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-left text-sm font-medium",
                    "flex items-center gap-2",
                    selectedDifficulty === diff.value 
                      ? "bg-emerald-500/10" 
                      : "hover:bg-emerald-500/5"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", diff.color)} />
                  <span className="text-gray-200">{diff.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 