'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CodeEditorSection from './CodeEditorSection';
import SectionTitle from '../atoms/SectionTitle';
import { DEFAULT_LEVEL, GRID_WIDTH } from '@/lib/constants';


const GameSection = () => {
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });

  // Find initial robot position from level data
  useEffect(() => {
    const robotIndex = level.findIndex(tile => tile === 3); // ROBOT
    if (robotIndex !== -1) {
      setRobotPosition({
        x: robotIndex % GRID_WIDTH,
        y: Math.floor(robotIndex / GRID_WIDTH)
      });
    }
  }, [level]);

  return (
    <section id="playground" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-8 md:mb-20">
          Playground de Programación
        </SectionTitle>

        {/* Code Editor Area */}
        <Card className="bg-slate-800/50 backdrop-blur-sm h-[85vh] lg:h-[70vh] mb-4">
          <CodeEditorSection
            levelData={level}
            onRobotMove={setRobotPosition}
          />
        </Card>

        {/* Controls and Status - Mobile only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          <Card className="bg-slate-800/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Estado del Robot</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Posición: ({robotPosition.x}, {robotPosition.y})</p>
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