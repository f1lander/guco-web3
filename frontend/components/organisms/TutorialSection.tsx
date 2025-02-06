import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';

const tutorials = [
  {
    title: 'Movimientos Básicos',
    description: 'Aprende a mover el robot usando comandos simples como moverDerecha() y moverIzquierda().',
    code: 'robot.moverDerecha();\nrobot.moverIzquierda();',
    level: 'Principiante'
  },
  {
    title: 'Recolección de Items',
    description: 'Descubre cómo recolectar items del mundo virtual usando el comando recolectar().',
    code: 'robot.moverDerecha();\nrobot.recolectar();',
    level: 'Principiante'
  },
  {
    title: 'Bucles Simples',
    description: 'Aprende a repetir acciones usando bucles mientras y para.',
    code: 'mientras (robot.puedeMover()) {\n  robot.moverDerecha();\n}',
    level: 'Intermedio'
  },
  {
    title: 'Condiciones',
    description: 'Usa condiciones para tomar decisiones basadas en el entorno del robot.',
    code: 'si (robot.tieneItem()) {\n  robot.recolectar();\n}',
    level: 'Intermedio'
  }
];

const TutorialSection = () => {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-12">
          Tutoriales y Ejemplos
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{tutorial.title}</h3>
                  <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                    {tutorial.level}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  {tutorial.description}
                </p>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-green-400">
                    {tutorial.code}
                  </code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorialSection; 