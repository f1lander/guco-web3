import React, { useState, useRef } from 'react';
import { Terminal, Play, GridIcon, ChevronRight, HelpCircle, X } from 'lucide-react';
import GameView from '../molecules/GameView';
import { CodeEditor } from '@/components/molecules/CodeEditor';
import { LANDING_PAGE_LEVELS } from '@/lib/constants';
import Button from '@/components/atoms/Button';

interface HighlightedCodeProps {
  code: string;
}

interface CommandSectionProps {
  onSelectCommand: (command: string) => void;
}

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type RobotCommand = {
  command: string;
  description: string;
  snippet?: string;
};

interface CursorPosition {
  line: number;
  character: number;
}

// Define the ref type
interface CodeEditor2Ref {
  insertCommand: (command: string) => void;
}

// Syntax Highlighter Component
const HighlightedCode: React.FC<HighlightedCodeProps> = ({ code }) => {
  const keywords: Record<string, string> = {
    robot: 'text-purple-400',
    var: 'text-rose-400',
    nuevo: 'text-rose-400',
    si: 'text-rose-400',
    mientras: 'text-rose-400',
    para: 'text-rose-400',
    Robot: 'text-blue-400',
  };

  const methodsAndProps: Record<string, string> = {
    'encender': 'text-emerald-400',
    'apagar': 'text-emerald-400',
    'moverDerecha': 'text-cyan-400',
    'moverIzquierda': 'text-cyan-400',
    'moverArriba': 'text-cyan-400',
    'moverAbajo': 'text-cyan-400',
    'recolectar': 'text-yellow-400',
    'encenderLuz': 'text-yellow-400',
    'apagarLuz': 'text-yellow-400',
    'tieneItem': 'text-yellow-400',
    'puedeMover': 'text-yellow-400',
  };

  const processLine = (line: string) => {
    // Split by dots to handle object methods
    const parts = line.split('.');
    return parts.map((part, index) => {
      const words = part.split(/([(){};=\s])/);
      return words.map((word, wordIndex) => {
        if (keywords[word]) {
          return <span key={wordIndex} className={keywords[word]}>{word}</span>;
        } else if (methodsAndProps[word]) {
          return <span key={wordIndex} className={methodsAndProps[word]}>{word}</span>;
        } else if (word.match(/^[0-9]+$/)) {
          return <span key={wordIndex} className="text-orange-400">{word}</span>;
        } else if (word.match(/^["'`].*["'`]$/)) {
          return <span key={wordIndex} className="text-green-400">{word}</span>;
        }
        return word;
      });
    }).reduce((acc, curr, idx) => {
      if (idx > 0) {
        return [...acc, <span key={`dot-${idx}`} className="text-white">.</span>, ...curr];
      }
      return curr;
    }, []);
  };

  return (
    <div className="font-mono whitespace-pre">
      {code.split('\n').map((line, i) => (
        <div key={i} className="leading-6">
          {processLine(line)}
        </div>
      ))}
    </div>
  );
};

// Command Section with Updated Colors
const CommandSection: React.FC<CommandSectionProps> = ({ onSelectCommand }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('movimiento');

  interface Command {
    command: string;
    description: string;
  }

  interface Category {
    label: string;
    color: string;
    commands: Command[];
  }

  const commandCategories: Record<string, Category> = {
    basico: {
      label: 'Básico',
      color: 'emerald',
      commands: [
        { command: 'robot.encender()', description: 'Encender robot' },
        { command: 'robot.apagar()', description: 'Apagar robot' },
      ]
    },
    movimiento: {
      label: 'Movimiento',
      color: 'cyan',
      commands: [
        { command: 'robot.moverDerecha()', description: 'Mover a la derecha' },
        { command: 'robot.moverIzquierda()', description: 'Mover a la izquierda' },
        { command: 'robot.moverArriba()', description: 'Mover arriba' },
        { command: 'robot.moverAbajo()', description: 'Mover abajo' },
      ]
    },
    acciones: {
      label: 'Acciones',
      color: 'amber',
      commands: [
        { command: 'robot.recolectar()', description: 'Recolectar item' },
        { command: 'robot.encenderLuz()', description: 'Encender luz' },
        { command: 'robot.apagarLuz()', description: 'Apagar luz' },
      ]
    },
    logica: {
      label: 'Lógica',
      color: 'purple',
      commands: [
        { command: 'si (robot.tieneItem())', description: 'Verificar item' },
        { command: 'mientras (robot.puedeMover())', description: 'Mientras pueda moverse' },
      ]
    }
  };

  return (
    <div className="bg-slate-800/50 border-t-2 border-slate-700">
      {/* Categories */}
      <div className="flex gap-2 p-2 overflow-x-auto command-scroll">
        {Object.entries(commandCategories).map(([key, category]) => (
          <Button
            key={key}
            variant="command"
            color={selectedCategory === key ? category.color : 'slate'}
            onClick={() => setSelectedCategory(key)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Commands */}
      <div className="overflow-x-auto command-scroll p-2">
        <div className="flex gap-2">
          {commandCategories[selectedCategory].commands.map((cmd, index) => (
            <Button
              key={index}
              variant="command"
              color={commandCategories[selectedCategory].color}
              icon={ChevronRight}
              onClick={() => onSelectCommand(cmd.command)}
            >
              {cmd.command}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CodeEditorSectionProps {
  currentLevel: number;
  robotPosition: { x: number; y: number };
  onRobotMove: (position: { x: number; y: number }) => void;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
  currentLevel,
  robotPosition,
  onRobotMove
}) => {
  const [code, setCode] = useState(`var robot = nuevo Robot();
robot.encender();
robot.moverDerecha();
robot.recolectar();
robot.apagar();`);
  const [showHelp, setShowHelp] = useState(false);
  const editorRef = useRef<CodeEditor2Ref>(null);

  const handleCommandClick = (command: string) => {
    if (editorRef.current) {
      editorRef.current.insertCommand(command);
    }
  };

  const handleExecuteCode = () => {
    // TODO: Implement code execution
    console.log('Executing code...');
  };

  return (
    <div className="h-full p-4 flex flex-col bg-slate-900">
      {/* Editor Container */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-3 bg-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-400">Panel de Control del Robot</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExecuteCode}
              className="px-3 py-1.5"
              icon={Play}
            >
              Ejecutar
            </Button>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Editor & Commands */}
          <div className="flex flex-col">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                ref={editorRef}
                value={code}
                onChange={setCode}
              />
            </div>

            {/* Commands */}
            <CommandSection onSelectCommand={(cmd) => handleCommandClick(cmd)} />
          </div>

          {/* Right Column - Game View */}
          <div className="h-full">
            <GameView 
              level={LANDING_PAGE_LEVELS[currentLevel]}
              robotPosition={robotPosition}
              onMove={onRobotMove}
            />
          </div>
        </div>
      </div>

      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

// Add proper types for style jsx
declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

// Update HelpDialog with proper types
interface CommandCategory {
  [key: string]: Array<{
    command: string;
    description: string;
  }>;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const allCommands: CommandCategory = {
    'Controles Básicos': [
      { command: 'robot.encender()', description: 'Enciende el robot' },
      { command: 'robot.apagar()', description: 'Apaga el robot' }
    ],
    'Movimiento': [
      { command: 'robot.moverDerecha()', description: 'Mover un paso a la derecha' },
      { command: 'robot.moverIzquierda()', description: 'Mover un paso a la izquierda' },
      { command: 'robot.moverArriba()', description: 'Mover un paso arriba' },
      { command: 'robot.moverAbajo()', description: 'Mover un paso abajo' }
    ],
    'Acciones': [
      { command: 'robot.recolectar()', description: 'Recolectar item en la posición actual' },
      { command: 'robot.encenderLuz()', description: 'Encender la luz del robot' },
      { command: 'robot.apagarLuz()', description: 'Apagar la luz del robot' },
      { command: 'robot.escanear()', description: 'Escanear alrededores' }
    ],
    'Lógica': [
      { command: 'si (robot.tieneItem())', description: 'Verificar si hay un item presente' },
      { command: 'mientras (robot.puedeMover())', description: 'Repetir mientras se pueda mover' },
      { command: 'para (var i = 0; i < n; i++)', description: 'Repetir n veces' }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="fixed inset-4 bg-slate-900 rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Comandos Disponibles</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(allCommands).map(([category, commands]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-400 mb-3">{category}</h3>
              <div className="space-y-2">
                {commands.map((cmd, idx) => (
                  <div key={idx} className="p-3 bg-slate-800 rounded-lg">
                    <code className="font-mono text-blue-400">{cmd.command}</code>
                    <p className="mt-1 text-sm text-slate-300">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorSection;