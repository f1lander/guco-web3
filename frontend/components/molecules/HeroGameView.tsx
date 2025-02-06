'use client';

import React, { useState, useEffect } from 'react';
import GameView from './GameView';

const commands = [
  'robot.encender()',
  'robot.moverDerecha()',
  'robot.moverDerecha()',
  'robot.moverAbajo()',
  'robot.recolectar()',
  'robot.moverDerecha()',
  'robot.moverAbajo()',
];

const obstacles = [
  { type: 'item', position: { x: 2, y: 1 } },
  { type: 'wall', position: { x: 1, y: 2 } },
  { type: 'goal', position: { x: 3, y: 2 } },
];

interface RobotState {
  position: { x: number, y: number };
  isOn: boolean;
  isCollecting: boolean;
}

const HeroGameView = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [robotState, setRobotState] = useState<RobotState>({
    position: { x: 0, y: 0 },
    isOn: false,
    isCollecting: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= commands.length) {
          // Reset animation
          setRobotState({
            position: { x: 0, y: 0 },
            isOn: false,
            isCollecting: false
          });
          return -1;
        }

        // Update robot state based on command
        const command = commands[next];
        setRobotState(prevState => {
          switch(command) {
            case 'robot.encender()':
              return { ...prevState, isOn: true };
            case 'robot.moverDerecha()':
              return { 
                ...prevState, 
                position: { 
                  ...prevState.position, 
                  x: Math.min(prevState.position.x + 1, 3) 
                }
              };
            case 'robot.moverIzquierda()':
              return { 
                ...prevState, 
                position: { 
                  ...prevState.position, 
                  x: Math.max(prevState.position.x - 1, 0) 
                }
              };
            case 'robot.moverArriba()':
              return { 
                ...prevState, 
                position: { 
                  ...prevState.position, 
                  y: Math.max(prevState.position.y - 1, 0) 
                }
              };
            case 'robot.moverAbajo()':
              return { 
                ...prevState, 
                position: { 
                  ...prevState.position, 
                  y: Math.min(prevState.position.y + 1, 3) 
                }
              };
            case 'robot.recolectar()':
              return { ...prevState, isCollecting: true };
            default:
              return prevState;
          }
        });
        
        return next;
      });
    }, 1500); // Slower animation for better visualization

    return () => clearInterval(interval);
  }, []);

  // Custom render function for robot with different states
  const renderRobot = () => {
    const baseClasses = "absolute inset-0 flex items-center justify-center transition-all duration-300";
    const scale = robotState.isOn ? 'scale-125' : 'scale-100';
    const collecting = robotState.isCollecting ? 'text-yellow-400' : '';
    
    return (
      <div className={`${baseClasses} ${scale} ${collecting}`}>
        <span className="text-2xl transform transition-transform">
          🤖
        </span>
      </div>
    );
  };

  return (
    <GameView 
      showControls={false}
      gridSize={4}
      robotPosition={robotState.position}
      obstacles={obstacles}
      commands={commands}
      currentCommand={currentStep}
      customRobotRender={renderRobot}
    />
  );
};

export default HeroGameView; 