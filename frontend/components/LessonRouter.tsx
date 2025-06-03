import React from "react";
import { LessonTemplate } from "./LessonTemplate";
import { LESSONS, isLessonUnlocked } from "../lib/lessons";

type LessonRouterProps = {
  difficulty: "beginner" | "intermediate" | "advanced";
  lessonId: string;
  onBack: () => void;
};

export const LessonRouter: React.FC<LessonRouterProps> = ({
  difficulty,
  lessonId,
  onBack,
}) => {
  const [currentLesson, setCurrentLesson] = React.useState(
    LESSONS[difficulty].find((lesson) => lesson.id === lessonId),
  );

  const handleStartLevel = () => {
    if (currentLesson) {
      window.location.href = `/dashboard/level?levelData=${currentLesson.levelData}&levelId=${currentLesson.levelId}`;
    }
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lección no encontrada</h1>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a las lecciones
          </button>
        </div>
      </div>
    );
  }

  if (!isLessonUnlocked(currentLesson.id)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lección bloqueada</h1>
          <p className="text-gray-600 mb-4">
            Necesitas completar las lecciones anteriores para desbloquear esta.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver a las lecciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-8 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a las lecciones
        </button>

        <LessonTemplate
          lesson={currentLesson}
          onStartLevel={handleStartLevel}
        />
      </div>
    </div>
  );
};
