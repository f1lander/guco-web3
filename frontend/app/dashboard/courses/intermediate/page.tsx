"use client";

import React, { useEffect, useState, Suspense } from "react";
import { LESSONS, isLessonUnlocked } from "../../../../lib/lessons";
import { useSearchParams, useRouter } from "next/navigation";
import { LessonTemplate } from "@/components/LessonTemplate";

function IntermediateLessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get("lessonId");
  const [mounted, setMounted] = useState(false);
  const [lesson, setLesson] = useState<
    (typeof LESSONS.intermediate)[0] | undefined
  >();

  useEffect(() => {
    setMounted(true);
    setLesson(LESSONS.intermediate.find((l) => l.id === lessonId));
  }, [lessonId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Cargando...
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col gap-20 p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Lección no encontrada
        </h1>
        <button
          onClick={() => router.push("/dashboard/courses")}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Volver a las lecciones
        </button>
      </div>
    );
  }

  if (!isLessonUnlocked(lesson.id)) {
    return (
      <div className="flex flex-col gap-20 p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Lección bloqueada
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Necesitas completar las lecciones anteriores para desbloquear esta.
        </p>
        <button
          onClick={() => router.push("/dashboard/courses")}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Volver a las lecciones
        </button>
      </div>
    );
  }

  const handleStartLevel = () => {
    router.push(
      `/dashboard/level?levelData=${encodeURIComponent(lesson.levelData)}&levelId=${lesson.levelId}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/dashboard/courses")}
          className="mb-8 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
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

        <LessonTemplate lesson={lesson} onStartLevel={handleStartLevel} />
      </div>
    </div>
  );
}

export default function IntermediateLessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">
            Cargando...
          </div>
        </div>
      }
    >
      <IntermediateLessonContent />
    </Suspense>
  );
}
