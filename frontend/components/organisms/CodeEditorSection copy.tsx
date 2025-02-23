import React, { useState, useRef } from 'react';
import { Terminal, Play, GridIcon, ChevronRight, HelpCircle, X } from 'lucide-react';
import GameView from '../molecules/GameView';
import { CodeEditor } from '@/components/molecules/CodeEditor';
import Button from '@/components/atoms/Button';


interface CommandSectionProps {
  onSelectCommand: (command: string) => void;
}

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  command: string;
  description: string;
}

interface Category {
  label: string;
  color: string;
  commands: Command[];
}

// Command Section with Updated Colors
const CommandSection: React.FC<CommandSectionProps> = ({ onSelectCommand }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('movimiento');


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
    <div className="flex flex-col bg-slate-800/50 border-t-2 border-slate-700">
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
  levelData: number[];
  onRobotMove: (position: { x: number; y: number }) => void;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
  levelData,
  onRobotMove
}) => {
  const [code, setCode] = useState(`
var robot = nuevo Robot();
robot.encender();
robot.moverDerecha();
robot.recolectar();
robot.apagar();`);
  const [showHelp, setShowHelp] = useState(false);

  const handleCommandClick = (command: string) => {
    setCode(prevCode => prevCode + `\n${command};`);
  };

  const handleExecuteCode = () => {
    // TODO: Implement code execution
    console.log('Executing code...');

    code.split('\n').forEach(line => {
      console.log(line);
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden w-full">
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
      <div className="flex-1 grid gap-4 h-full grid-cols-1 md:grid-cols-2">
        {/* Left Column - Editor & Commands */}
        <div className="flex flex-col h-full">
          {/* Editor */}
          <div className="flex-1 container_editor_area">
            <CodeEditor
              value={code}
              onChange={setCode}
              className="container__editor"
            />
          </div>
          <div className="h-[20%] min-h-[80px]">
            <CommandSection onSelectCommand={(cmd) => handleCommandClick(cmd)} />
          </div>
        </div>

        {/* Right Column - Game View */}
        <div className="h-full">
          <GameView
            level={levelData}
            onMove={onRobotMove}
          />
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