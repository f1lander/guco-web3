import React from 'react';
import { LessonContent } from './LessonContent';
import { LessonContent as LessonContentType } from '../lib/lessons';

interface LessonTemplateProps {
  lesson: LessonContentType;
  onStartLevel: () => void;
}

export const LessonTemplate: React.FC<LessonTemplateProps> = ({ lesson, onStartLevel }) => {
  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    
    // Handle youtu.be format
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Video Section */}
      {embedUrl && (
        <div className="mb-8">
          <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{lesson.title}</h1>
        <p className="text-xl text-gray-400 mb-6">{lesson.description}</p>
        <LessonContent content={lesson.content} />
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onStartLevel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          Comenzar Nivel
        </button>
      </div>
    </div>
  );
}; 