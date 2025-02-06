'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';

const LeaderboardSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-12">
          Tabla de Clasificación
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Mejores Creadores</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Los niveles creados se almacenan en el smart contract usando:
                </p>
                <code className="text-xs bg-slate-800 p-2 rounded-lg block text-green-400">
                  event LevelCreated(uint256 indexed levelId, address indexed creator);
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Logros Desbloqueados</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Los niveles completados se registran usando:
                </p>
                <code className="text-xs bg-slate-800 p-2 rounded-lg block text-green-400">
                  event LevelCompleted(uint256 indexed levelId, address indexed userAddress, uint256 completionTime);
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection; 