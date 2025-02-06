'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import CodeEditorSection from './CodeEditorSection';
import SectionTitle from '../atoms/SectionTitle';
import GameView from '../molecules/GameView';

const GameSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-20">
          Playground de Programación
        </SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Visualization Area */}

          {/* Code Editor Area */}
          <Card className="bg-slate-800/50 backdrop-blur-sm">
            <CodeEditorSection />
          </Card>

          <Card className="aspect-square bg-slate-800/50 backdrop-blur-sm">
            <GameView />
          </Card>

        </div>

        {/* Controls and Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Estado del Robot</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Posición: (0, 0)</p>
              <p>Energía: 100%</p>
              <p>Items Recolectados: 0</p>
            </div>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Nivel Actual</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Nivel: 1</p>
              <p>Objetivo: Mover el robot hasta la meta</p>
              <p>Progreso: 0/3 objetivos completados</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GameSection; 