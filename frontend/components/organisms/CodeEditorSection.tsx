import React, { useState, useRef } from 'react';
import { Terminal, Play, GridIcon, ChevronRight, HelpCircle, X } from 'lucide-react';
import GameView from '../molecules/GameView';
import { CodeEditor } from '@/components/molecules/CodeEditor';
import Button from '@/components/atoms/Button';
import TerminalComponent from '@/components/atoms/Terminal';
import { colorVariants } from '@/components/atoms/Button';
import { COMMAND_CATEGORIES, COMMANDS, INITIAL_CODE } from '@/lib/constants';

import { useTranslation } from '@/providers/language-provider';
import { compileCode, RobotState, moveRobot, TileType } from '@/lib/utils';

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
  color: keyof typeof colorVariants;
  commands: Command[];
}

// Command Section with Updated Colors
const CommandSection: React.FC<CommandSectionProps> = ({ onSelectCommand }) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof COMMAND_CATEGORIES>('basico');
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-slate-800/50 border-t-2 border-slate-700 p-1 md:p-2">
      {/* Categories */}
      <div className="flex gap-1 md:gap-2 p-1 md:p-2 overflow-x-auto command-scroll items-center justify-center">
        {Object.entries(COMMAND_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            variant="command"
            color={selectedCategory === key ? category.color : 'slate'}
            onClick={() => setSelectedCategory(key as keyof typeof COMMAND_CATEGORIES)}
            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5"
          >
            {t(`game.commands.categories.${category.label}`)}
          </Button>
        ))}
      </div>

      {/* Commands */}
      <div className="overflow-x-auto command-scroll p-1 md:p-2">
        <div className="flex gap-1 md:gap-2">
          {COMMAND_CATEGORIES[selectedCategory].commands.map((cmd, index) => (
            <Button
              key={index}
              variant="command"
              color={COMMAND_CATEGORIES[selectedCategory].color}
              icon={ChevronRight}
              className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5"
              onClick={() => onSelectCommand(cmd.command)}
              title={t(`game.commands.descriptions.${cmd.description}`)}
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
  setLevelData: (levelData: number[]) => void;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
  levelData,
  setLevelData,
}) => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [robotState, setRobotState] = useState<RobotState>({ collected: 0, state: 'off' });

  const [showHelp, setShowHelp] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleCommandClick = (command: string) => {
    setCode(prevCode => prevCode + `\n${command};`);
  };

  const handleExecuteCode = async () => {
    try {

      setCommands([]);
      setError(null);
      const newCommands = code
        .split('-- Area de codigo para programar el robot')[1]
        .split('\n')
        .filter(line => !line.startsWith('--'))
        .filter(line => line.trim()); // Filter out empty lines
      setIsCompiling(true);
      const compiledCommands = compileCode(newCommands, 'lua');
      console.log(compiledCommands);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCommands(compiledCommands);
      setIsCompiling(false);
      setIsExecuting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset execution state after all commands are done
      setTimeout(() => {
        setIsExecuting(false);
      }, newCommands.length * 500 + 500); // Add extra 500ms for cleanup
    } catch (error) {
      console.error('Error executing code:', error);
      setError("Error al compilar el codigo");
    }
  };

  const handleExecuteCommand = async (command: (typeof COMMANDS)[keyof typeof COMMANDS]) => {
    debugger;
    const newRobotState = moveRobot(levelData, robotState, command);
    setRobotState(newRobotState.newRobotState);
    setLevelData(newRobotState.newLevel);
    console.log(newRobotState);
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden w-full md:h-[800px]">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 bg-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
          <span className="text-xs md:text-sm font-semibold text-slate-400">Panel de Control</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExecuteCode}
            className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm"
            icon={Play}
          >
            Ejecutar
          </Button>
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 md:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
          >
            <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid gap-4 h-full grid-cols-1 md:grid-cols-2">
        {/* Left Column - Editor & Commands */}
        <div className="flex flex-col h-full order-2 md:order-1">
          {/* Editor */}
          <div className="flex-1 h-full">
            <CodeEditor
              value={code}
              onChange={(newValue) => setCode(newValue || '')}
            />
          </div>
          <div className="min-h-[80px]">
            <CommandSection onSelectCommand={(cmd) => handleCommandClick(cmd)} />
          </div>
        </div>

        {/* Right Column - Game View */}
        <div className="flex flex-col h-full order-1 md:order-2">
          <div className="h-[57%]">
            <GameView
              level={levelData}
              robotState={robotState}
            />
          </div>
          <div className="h-[43%]">
            <TerminalComponent commands={commands} isExecuting={isExecuting} isCompiling={isCompiling} error={error} executeCommand={handleExecuteCommand} />
          </div>
        </div>
      </div>
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};


const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const allCommands = COMMAND_CATEGORIES;

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
                {COMMAND_CATEGORIES[category as keyof typeof COMMAND_CATEGORIES].commands.map((cmd, idx) => (
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