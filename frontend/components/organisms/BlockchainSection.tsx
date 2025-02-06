'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';
import { Wallet, Code, Trophy, Database } from 'lucide-react';

const BlockchainSection = () => {
  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Identidad Digital',
      description: 'Tu progreso está vinculado a tu wallet, manteniendo un registro seguro de todos tus logros.',
      techDetail: 'mapping(address => Player) internal players'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Creación de Niveles',
      description: 'Crea y comparte tus propios niveles. Cada nivel creado se registra en la blockchain.',
      techDetail: 'mapping(uint256 => Level) public levels'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Logros Verificables',
      description: 'Tus niveles completados y logros son inmutables y verificables en la blockchain.',
      techDetail: 'mapping(address => mapping(uint256 => bool)) public playerCompletedLevels'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Estadísticas Globales',
      description: 'Seguimiento de estadísticas globales del juego y participación de la comunidad.',
      techDetail: 'mapping(address => uint256) public playerLevelCount'
    }
  ];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-center mb-12">
          Potenciado por Blockchain
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-primary">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <code className="text-xs bg-slate-800 p-2 rounded-lg block text-green-400">
                      {feature.techDetail}
                    </code>
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

export default BlockchainSection; 