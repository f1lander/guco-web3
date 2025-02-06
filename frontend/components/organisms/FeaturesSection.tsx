import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';

const FeaturesSection = () => {
  return (
    <section className="p-20">
      <div className="flex flex-col container mx-auto px-4 gap-8">
        <SectionTitle className="text-center mb-12">
          Características Principales
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Programación Intuitiva</h3>
              <p className="text-muted-foreground">
                Controla robots virtuales usando comandos simples y aprende conceptos de programación
              </p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Aprendizaje Gamificado</h3>
              <p className="text-muted-foreground">
                Supera desafíos, gana recompensas y aprende mientras te diviertes
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-4xl mb-4">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">Tecnología Blockchain</h3>
              <p className="text-muted-foreground">
                Tus logros y progreso quedan registrados de forma segura en la blockchain
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
