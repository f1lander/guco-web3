import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, BookOpen } from 'lucide-react';
import { COMMANDS } from '@/lib/constants';
import { CommandWithMeta } from '@/lib/utils';

interface TerminalProps {
  commands: CommandWithMeta[];
  isExecuting: boolean;
  isCompiling: boolean;
  error: string | null;
  executeCommand: (command: (typeof COMMANDS)[keyof typeof COMMANDS]) => void;
  currentCommandIndex: number;
}

const TerminalComponent: React.FC<TerminalProps> = ({ commands, isExecuting, isCompiling, error, executeCommand, currentCommandIndex }) => {
  type TabType = 'terminal' | 'instructions';
  const [activeTab, setActiveTab] = useState<TabType>('terminal');
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Keep track of which command is executing and which iteration if in a loop
  const [highlightedCommandInfo, setHighlightedCommandInfo] = useState<{
    commandIndex: number;
    loopIteration?: number;
  }>({
    commandIndex: -1,
    loopIteration: undefined
  });
  
  // Update highlighted command based on currentCommandIndex
  useEffect(() => {
    if (!isExecuting || commands.length === 0 || currentCommandIndex < 0) {
      setHighlightedCommandInfo({
        commandIndex: -1,
        loopIteration: undefined
      });
      return;
    }
    
    // Map the flattened command index to the original command index
    let flatIndex = 0;
    let foundCommandIndex = -1;
    let currentLoopIteration = undefined;
    
    // Loop through commands to find which one corresponds to currentCommandIndex
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      
      if (cmd.isLoopStart && cmd.loopCount) {
        // If we're at the loop start command
        if (flatIndex === currentCommandIndex) {
          foundCommandIndex = i;
          break;
        }
        flatIndex++;
        
        // Find the end of the loop
        let nestLevel = 1;
        let loopEndIndex = i + 1;
        while (nestLevel > 0 && loopEndIndex < commands.length) {
          if (commands[loopEndIndex].isLoopStart) nestLevel++;
          if (commands[loopEndIndex].isLoopEnd) nestLevel--;
          if (nestLevel === 0) break;
          loopEndIndex++;
        }
        
        // Extract loop body commands (exclude nested loops)
        const loopBody = commands.slice(i + 1, loopEndIndex);
        const loopCommands = loopBody.filter(c => !c.isLoopStart && !c.isLoopEnd);
        
        // Calculate which iteration and which command in the loop is highlighted
        if (flatIndex <= currentCommandIndex && currentCommandIndex < flatIndex + (loopCommands.length * cmd.loopCount)) {
          const positionInLoop = (currentCommandIndex - flatIndex) % loopCommands.length;
          const iterationNumber = Math.floor((currentCommandIndex - flatIndex) / loopCommands.length) + 1;
          
          foundCommandIndex = commands.indexOf(loopCommands[positionInLoop]);
          currentLoopIteration = iterationNumber;
          break;
        }
        
        // Skip past all commands in all iterations of the loop
        flatIndex += loopCommands.length * cmd.loopCount;
        
        // Skip to after the loop end
        i = loopEndIndex;
      } else if (!cmd.isLoopStart && !cmd.isLoopEnd) {
        // Regular command outside of a loop
        if (flatIndex === currentCommandIndex) {
          foundCommandIndex = i;
          break;
        }
        flatIndex++;
      }
    }
    
    setHighlightedCommandInfo({
      commandIndex: foundCommandIndex,
      loopIteration: currentLoopIteration
    });
    
  }, [commands, currentCommandIndex, isExecuting]);

  // Scroll to keep current command in view - restrict scroll to terminal container only
  useEffect(() => {
    if (terminalRef.current && highlightedCommandInfo.commandIndex >= 0 && isExecuting) {
      const currentElement = terminalRef.current.querySelector(`[data-command-index="${highlightedCommandInfo.commandIndex}"]`);
      if (currentElement && terminalRef.current) {
        // Only scroll within the terminal container, not the page
        const container = terminalRef.current.querySelector('.terminal-content');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = currentElement.getBoundingClientRect();
          
          // Calculate if element is out of view
          if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
            currentElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    }
  }, [highlightedCommandInfo.commandIndex, isExecuting]);

  if (activeTab === 'instructions' as TabType) {
    return (
      <div className="flex flex-col h-full bg-slate-950 border-t-2 border-slate-700">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              activeTab === ('terminal' as TabType)
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
              activeTab === ('instructions' as TabType)
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t-2 border-slate-700" ref={terminalRef}>
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm ${
            activeTab === ('terminal' as TabType)
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
            activeTab === ('instructions' as TabType)
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
      <div className="h-full p-4 font-mono text-sm overflow-y-auto terminal-content">
        <div className="text-green-400 mb-2">$ Iniciando programa...</div>
        
        {isCompiling && (
          <div className="text-yellow-400 mb-2">$ Compilando...</div>
        )}
        
        {error && (
          <div className="text-red-400 mb-2">$ Error: {error}</div>
        )}
        
        {/* Display commands with original UI but improved tracking */}
        {commands.map((cmd, index) => {
          // Is this command currently highlighted?
          const isHighlighted = index === highlightedCommandInfo.commandIndex;
          
          // Is this command inside a loop?
          const isInLoop = cmd.indentLevel && cmd.indentLevel > 0;
          
          // For indentation
          const indentation = cmd.indentLevel && cmd.indentLevel > 0 
            ? '\u00A0\u00A0'.repeat(cmd.indentLevel) 
            : '';
          
          // For loop headers
          if (cmd.isLoopStart) {
            // Is this loop currently executing one of its iterations?
            const isLoopExecuting = isHighlighted && highlightedCommandInfo.loopIteration !== undefined;
            
            return (
              <div 
                key={`header-${index}`}
                data-command-index={index}
                className={`transition-all duration-200 ${
                  isHighlighted
                    ? 'text-yellow-400 bg-slate-700/50 -mx-4 px-4 py-1'
                    : index < highlightedCommandInfo.commandIndex || 
                      (currentCommandIndex > 0 && !isExecuting)
                    ? 'text-purple-400 font-semibold'
                    : 'text-purple-300 font-semibold'
                }`}
              >
                {isHighlighted && '> '}
                repetir comandos {cmd.loopCount} veces
              </div>
            );
          }
          
          // For regular commands (not loop start/end)
          if (!cmd.isLoopStart && !cmd.isLoopEnd) {
            let textColorClass = isInLoop ? 'text-cyan-600' : 'text-slate-500';
            
            if (isHighlighted) {
              textColorClass = 'text-yellow-400';
            } else if (index < highlightedCommandInfo.commandIndex || 
                      (currentCommandIndex > 0 && !isExecuting)) {
              textColorClass = isInLoop ? 'text-cyan-400' : 'text-slate-400';
            }
            
            // Calculate indentation - add more spacing for loop body commands
            const displayIndent = isInLoop 
              ? '\u00A0\u00A0'.repeat((cmd.indentLevel || 0) + 1) // Extra indent for loop body commands
              : indentation;
            
            return (
              <div
                key={`cmd-${index}`}
                data-command-index={index}
                className={`transition-all duration-200 whitespace-pre ${
                  isHighlighted ? 'bg-slate-700/50 -mx-4 px-4 py-1' : ''
                } ${textColorClass}`}
              >
                {isHighlighted && '> '}
                {displayIndent}{cmd.command}
                {(index < highlightedCommandInfo.commandIndex || 
                  (currentCommandIndex > 0 && !isExecuting)) && ' ✓'}
                
                {/* Only show iteration for commands inside loops that are executing */}
                {isHighlighted && isInLoop && highlightedCommandInfo.loopIteration !== undefined ? (
                  <span className="ml-2 text-xs bg-slate-800/50 px-2 py-0.5 rounded-full">
                    iteración {highlightedCommandInfo.loopIteration} 
                  </span>
                ) : null}
              </div>
            );
          }
          
          // Skip loop end commands
          return null;
        })}
        
        {!isExecuting && currentCommandIndex > 0 && (
          <div className="text-green-400 mt-2">$ Programa completado</div>
        )}
      </div>
    </div>
  );
};

export const Terminal = React.memo(TerminalComponent);
