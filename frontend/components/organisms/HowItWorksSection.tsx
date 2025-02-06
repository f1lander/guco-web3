import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';

const steps = [
  {
    title: 'Escribe Código',
    description: 'Utiliza comandos simples en español para controlar tu robot virtual.',
    icon: '⌨️'
  },
  {
    title: 'Ejecuta y Observa',
    description: 'Ve cómo tu robot sigue tus instrucciones y completa los desafíos.',
    icon: '▶️'
  },
  {
    title: 'Aprende y Mejora',
    description: 'Descubre nuevos conceptos de programación mientras avanzas en los niveles.',
    icon: '📚'
  },
  {
    title: 'Gana Recompensas',
    description: 'Obtén logros y reconocimientos almacenados en la blockchain.',
    icon: '🏆'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 gap-8">
        <SectionTitle className="text-center mb-12">
          ¿Cómo Funciona GUCO?
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative bg-background">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;