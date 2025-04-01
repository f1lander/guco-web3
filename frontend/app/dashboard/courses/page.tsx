'use client';

import React from 'react';
import { LESSONS, isLessonUnlocked } from '../../../lib/lessons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewState = 'list' | 'lesson';

const DifficultyCard: React.FC<{
  title: string;
  description: string;
  lessons: typeof LESSONS.beginner;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isUnlocked: boolean;
  onLessonClick: (lessonId: string) => void;
}> = ({ title, description, lessons, difficulty, isUnlocked, onLessonClick }) => {
  return (
    <div className={`rounded-lg p-6 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 ${!isUnlocked ? 'opacity-50' : ''}`}>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          // For beginner lessons, only the first one is unlocked by default
          // For other difficulties, check if the difficulty level is unlocked first
          const isUnlockedLesson = difficulty === 'beginner' 
            ? (index === 0 || isLessonUnlocked(lesson.id))
            : (isUnlocked && isLessonUnlocked(lesson.id));

          return (
            <div
              key={lesson.id}
              className={`p-4 rounded-lg border ${
                isUnlockedLesson
                  ? 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => {
                if (isUnlockedLesson) {
                  onLessonClick(lesson.id);
                }
              }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
              {(!isUnlocked || !isUnlockedLesson) && (
                <div className="mt-2">
                  <span className="text-sm text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                    {!isUnlocked 
                      ? 'Completa el nivel anterior primero'
                      : 'Bloqueado'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const router = useRouter();

  // Only unlock first beginner lesson on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlockedLessons = JSON.parse(localStorage.getItem('unlockedLessons') || '[]');
      const firstBeginnerLesson = LESSONS.beginner[0];
      
      if (firstBeginnerLesson && !unlockedLessons.includes(firstBeginnerLesson.id)) {
        unlockedLessons.push(firstBeginnerLesson.id);
        localStorage.setItem('unlockedLessons', JSON.stringify(unlockedLessons));
      }
    }
  }, []);

  const handleLessonClick = (difficulty: 'beginner' | 'intermediate' | 'advanced', lessonId: string) => {
    router.push(`/dashboard/courses/${difficulty}?lessonId=${lessonId}`);
  };

  // Check if all beginner lessons are completed to unlock intermediate
  const isIntermediateUnlocked = LESSONS.beginner.every((lesson) => isLessonUnlocked(lesson.id));
  
  // Check if all intermediate lessons are completed to unlock advanced
  const isAdvancedUnlocked = isIntermediateUnlocked && LESSONS.intermediate.every((lesson) => isLessonUnlocked(lesson.id));

  return (
    <div className="flex flex-col gap-20 p-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Lecciones de Programación</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Beginner Level */}
        <DifficultyCard
          title="🌱 Principiante"
          description="Aprende los conceptos básicos de la programación"
          lessons={LESSONS.beginner}
          difficulty="beginner"
          isUnlocked={true}
          onLessonClick={(lessonId) => handleLessonClick('beginner', lessonId)}
        />

        {/* Intermediate Level */}
        <DifficultyCard
          title="🚀 Intermedio"
          description="Mejora tus habilidades con conceptos más avanzados"
          lessons={LESSONS.intermediate}
          difficulty="intermediate"
          isUnlocked={isIntermediateUnlocked}
          onLessonClick={(lessonId) => handleLessonClick('intermediate', lessonId)}
        />

        {/* Advanced Level */}
        <DifficultyCard
          title="⭐ Avanzado"
          description="Domina técnicas avanzadas de programación"
          lessons={LESSONS.advanced}
          difficulty="advanced"
          isUnlocked={isAdvancedUnlocked}
          onLessonClick={(lessonId) => handleLessonClick('advanced', lessonId)}
        />
      </div>
    </div>
  );
};

export default CoursesPage; 