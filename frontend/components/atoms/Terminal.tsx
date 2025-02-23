import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, BookOpen } from 'lucide-react';
import { COMMANDS } from '@/lib/constants';
interface TerminalProps {
  commands: string[];
  isExecuting: boolean;
  isCompiling: boolean;
  error: string | null;
  executeCommand: (command: (typeof COMMANDS)[keyof typeof COMMANDS]) => void;
}

const TerminalComponent: React.FC<TerminalProps> = ({ commands, isExecuting, isCompiling, error, executeCommand }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'instructions'>('terminal');
  const [executingIndex, setExecutingIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExecuting && commands.length > 0) {
      setExecutingIndex(-1);
      const executeCommands = async () => {
        for (let i = 0; i < commands.length; i++) {
          setExecutingIndex(i);
          const command = commands[i].replace('robot:', '') as (typeof COMMANDS)[keyof typeof COMMANDS];
          await executeCommand(command);
        }
        setExecutingIndex(-1);
      };
      executeCommands();
    }
  }, [isExecuting, commands, executeCommand]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [executingIndex]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t-2 border-slate-700">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm ${
            activeTab === 'terminal'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('terminal')}
        >
          <TerminalIcon className="w-4 h-4" />
          Terminal
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm ${
            activeTab === 'instructions'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
          onClick={() => setActiveTab('instructions')}
        >
          <BookOpen className="w-4 h-4" />
          Instrucciones
        </button>
      </div>

      {/* Content */}
      {activeTab === 'terminal' ? (
        <div
          ref={terminalRef}
          className="h-full p-4 font-mono text-sm overflow-y-auto"
        >
          <div className="text-green-400 mb-2">$ Iniciando programa...</div>
          {isCompiling && (
            <div className="text-yellow-400 mb-2">$ Compilando...</div>
          )}
          {error && (
            <div className="text-red-400 mb-2">$ Error: {error}</div>
          )}
          {commands.map((cmd, index) => {
            const command = cmd.trim();
            if (!command) return null;
            
            return (
              <div
                key={index}
                className={`transition-all duration-200 ${
                  index === executingIndex
                    ? 'text-yellow-400 bg-slate-700/50 -mx-4 px-4 py-1'
                    : index < executingIndex
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {index === executingIndex && '> '}
                {command}
                {index < executingIndex && ' ✓'}
              </div>
            );
          })}
          {executingIndex === -1 && commands.length > 0 && (
            <div className="text-green-400 mt-2">$ Programa completado</div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            Instrucciones
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              ¡Bienvenido a Guco! En este nivel, tu misión es guiar al robot hasta
              la meta.
            </p>
            <div className="space-y-1">
              <p>Objetivos:</p>
              <ul className="list-disc list-inside pl-2 text-xs space-y-1">
                <li>Llega hasta la meta (cuadrado verde)</li>
                <li>Recolecta todas las estrellas en tu camino</li>
                <li>Esquiva los obstáculos (cuadrados rojos)</li>
                <li>Usa los comandos del panel izquierdo para programar al robot</li>
              </ul>
            </div>
            <p className="text-xs italic">
              Recuerda: ¡No olvides encender el robot antes de comenzar y apagarlo
              al terminar!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalComponent;
