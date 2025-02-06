'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import GradientText from '../atoms/GradientText';

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center text-center px-4">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenido a <GradientText>GUCO</GradientText>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Aprende programación de forma divertida controlando robots en un mundo virtual
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Empezar a Programar
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Ver Tutorial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;