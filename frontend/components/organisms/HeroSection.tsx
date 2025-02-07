'use client';

import React from 'react';
import GradientText from '../atoms/GradientText';
import { Github } from 'lucide-react';
import Button from '@/components/atoms/Button';

const HeroSection = () => {
  const scrollToPlayground = () => {
    const playgroundSection = document.getElementById('playground');
    if (playgroundSection) {
      playgroundSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[90vh] md:min-h-[80vh] flex items-center justify-center text-center p-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
          Bienvenido a <GradientText>GÜCO</GradientText>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 px-2">
          Aprende programación de forma divertida controlando robots en un mundo virtual
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Button 
            className="w-full sm:w-auto"
            onClick={scrollToPlayground}
          >
            ¿Cómo Funciona?
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-auto"
            icon={Github}
            onClick={() => window.open('https://github.com/yourusername/guco', '_blank')}
          >
            Ver en GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;