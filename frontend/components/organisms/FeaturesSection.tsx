import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '../atoms/SectionTitle';

const FeaturesSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="flex flex-col container mx-auto px-4 gap-8">
        <SectionTitle className="text-center mb-8 md:mb-12 px-2">
          Características Principales
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🤖</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Programación Intuitiva
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Controla robots virtuales usando comandos simples y aprende conceptos de programación
              </p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎮</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Aprendizaje Gamificado
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Supera desafíos, gana recompensas y aprende mientras te diviertes
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">⛓️</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Tecnología Blockchain
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
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
