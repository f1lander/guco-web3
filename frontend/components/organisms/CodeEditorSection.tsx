import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, GridIcon, ChevronRight, HelpCircle, X, Trophy, Check } from 'lucide-react';
import GameView from '../molecules/GameView';
import { CodeEditor } from '@/components/molecules/CodeEditor';
import Button from '@/components/atoms/Button';
import { Terminal } from '@/components/atoms/Terminal';
import { colorVariants } from '@/components/atoms/Button';
import { COMMAND_CATEGORIES, COMMANDS, GRID_WIDTH, INITIAL_CODE } from '@/lib/constants';
import { useGucoLevels } from '@/hooks/useGucoLevels';
import { useTranslation } from '@/providers/language-provider';
import { compileCode, RobotState, TileType, commandsToMovementSequence, compileUserCode, flattenCommands, CommandWithMeta } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  initAudio, 
  playRobotOnSound,
  playMoveSound, 
  playCollectSound, 
  playGoalSound,
  playBackgroundMusic,
  stopBackgroundMusic
} from '@/lib/sounds';
import { getLevel } from '@/lib/blockchain/contract-functions';
import { toast } from '@/components/ui/use-toast';
import { useAudioInit } from '@/hooks/useAudioInit';
import { useRobotSounds } from '@/hooks/useRobotSounds';
import { useCollectiblesInit } from '@/hooks/useCollectiblesInit';
import { useLevelCompletion } from '@/hooks/useLevelCompletion';

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

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, onClose, onConfirm, isPending }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <DialogTitle className="text-lg font-bold text-white">¡Nivel Completado!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center p-6 bg-slate-800/50 rounded-lg">
            <div className="text-6xl">🎉</div>
          </div>
          <DialogDescription className="text-slate-300 text-center">
            ¡Felicidades! Has completado este nivel con éxito.
          </DialogDescription>
          <p className="text-slate-400 text-sm text-center">
            Firma la transacción para guardar tu progreso en la blockchain.
          </p>
        </div>

        <DialogFooter className="bg-slate-800/50 p-4 -mx-6 -mb-6 mt-2 rounded-b-lg">
          <Button
            onClick={onConfirm}
            className="w-full"
            color="green"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Firmando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Confirmar Progreso
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CodeEditorSectionProps {
  levelData: number[];
  setLevelData: (levelData: number[]) => void;
  levelId?: number;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
  levelData,
  setLevelData,
  levelId = 0,
}) => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [robotState, setRobotState] = useState<RobotState>({ collected: 0, state: 'off' });
  const [showHelp, setShowHelp] = useState(false);
  const [commands, setCommands] = useState<CommandWithMeta[]>([]);
  const [flattenedCommands, setFlattenedCommands] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movementSequence, setMovementSequence] = useState<number[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [initialLevelData, setInitialLevelData] = useState<number[]>([...levelData]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [collectSteps, setCollectSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { updatePlayer, isPendingUpdate, getLevel } = useGucoLevels();

  // Use custom hooks
  const { audioInitialized } = useAudioInit();
  const { collectiblePositions, setCollectiblePositions, totalCollectibles } = useCollectiblesInit(initialLevelData);
  const { showSuccessDialog, setShowSuccessDialog } = useLevelCompletion(levelCompleted);
  
  // Apply robot sound effects
  useRobotSounds(robotState, audioInitialized);

  // Handle command click
  const handleCommandClick = (command: string) => {
    setCode(prevCode => prevCode + `\n${command};`);
  };

  // Handle execute code
  const handleExecuteCode = async () => {
    // Reset any previous execution state
    setError(null);
    setIsExecuting(false);
    setIsCompiling(true);
    setCurrentMoveIndex(0);
    setCommands([]);
    setFlattenedCommands([]);
    setMovementSequence([]);
    setLevelCompleted(false);
    setCollectSteps([]);
    setRobotState({ collected: 0, state: 'off' });
    
    // Reset level data to initial state
    setLevelData([...initialLevelData]);
    
    // Reset collectible positions
    const collectibles = initialLevelData
      .map((tile, index) => tile === TileType.COLLECTIBLE ? index : -1)
      .filter(index => index !== -1);
    setCollectiblePositions(collectibles);

    try {
      // Compile the user code to get structured commands
      const structuredCommands = compileUserCode(code);
      
      // Set the structured commands for display in the terminal
      setCommands(structuredCommands);
      
      // Create a flattened version of commands for execution
      const flattenedCommands = flattenCommands(structuredCommands);
      setFlattenedCommands(flattenedCommands);
      
      // If compilation is successful, begin execution
      setIsCompiling(false);
      setIsExecuting(true);

      // Convert commands to movement sequence
      const { sequence, errorIndex, collectSteps } = commandsToMovementSequence(flattenedCommands, initialLevelData);

      setMovementSequence(sequence);
      setCollectSteps(collectSteps);

      if (errorIndex !== null) {
        setError(`Error en el comando: ${flattenedCommands[errorIndex]}`);
      }

      // Check if robot has reached the goal
      const goalReached = checkGoalReached(sequence);
      const allCollectiblesCollected = robotState.collected === totalCollectibles; 
      
      if (goalReached && (allCollectiblesCollected || totalCollectibles === 0)) {
        setLevelCompleted(true);
        
        // Play goal reached sound
        if (audioInitialized) {
          playGoalSound();
        }
      }
    } catch (err) {
      setIsCompiling(false);
      setError((err as Error).message);
    }
  };

  // Handle confirm level completion
  const handleConfirmLevelCompletion = async () => {
    try {
      debugger;
      setIsSaving(true);
      
      if (levelId) {
        // Get the level data from the blockchain
        const level = await getLevel(levelId);
        
        // Update player progress using the hook method instead
        await updatePlayer(levelId, level);
        
        toast({
          title: "¡Progreso guardado!",
          description: "Tu avance ha sido registrado en la blockchain.",
        });
        
        // Close the dialog after successful update
        setShowSuccessDialog(false);
      }
    } catch (error) {
      console.error('Error updating player progress:', error);
      
      toast({
        title: "Error al guardar progreso",
        description: "Hubo un problema al registrar tu avance. Inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if robot has reached the goal
  const checkGoalReached = (newLevelData: number[]) => {
    // Find robot position
    const robotPos = newLevelData.findIndex(tile => tile === TileType.ROBOT);

    // Check if there's a goal in the level
    const hasGoal = initialLevelData.some(tile => tile === TileType.GOAL);

    // If there's no goal, we can't reach it
    if (!hasGoal) return false;

    // Check if the robot is at the position where the goal was in the initial level data
    const goalPos = initialLevelData.findIndex(tile => tile === TileType.GOAL);

    console.log("goalPos", goalPos);
    console.log("robotPos", robotPos);
    // If robot is at the goal position, level is completed
    return robotPos === goalPos;
  };

  // Update the movement sequence execution with original 500ms delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isExecuting && movementSequence.length > 0 && currentMoveIndex < movementSequence.length) {
      timeoutId = setTimeout(() => {
        // Make sure we have flattened commands available
        if (flattenedCommands.length === 0) return;
        
        // Get the current command (for state checks)
        const currentCommand = flattenedCommands[currentMoveIndex]?.replace('robot:', '').trim();
        
        // Skip the robot = Robot.new() command as it's just initialization
        if (currentCommand === 'robot = Robot.new()') {
          setCurrentMoveIndex(prev => prev + 1);
          return;
        }
        
        // Process robot state commands
        if (currentCommand === 'encender()') {
          // Turn on the robot
          setRobotState(prev => ({ ...prev, state: 'on' }));
          setCurrentMoveIndex(prev => prev + 1);
          return;
        } else if (currentCommand === 'apagar()') {
          // Turn off the robot
          setRobotState(prev => ({ ...prev, state: 'off' }));
          setCurrentMoveIndex(prev => prev + 1);
          return;
        }
        
        // Check if robot is turned on for all non-state commands
        if (robotState.state !== 'on') {
          setError("Error: El robot necesita ser encendido primero con 'encender()'");
          setIsExecuting(false);
          return;
        }
        
        // Create new level data array based on the current levelData
        const newLevelData = [...levelData];

        // Find the current robot position
        const currentPos = newLevelData.findIndex(tile => tile === TileType.ROBOT);

        // Get the position where the robot will move
        const newPos = movementSequence[currentMoveIndex];

        // Check if current command is a collect command
        const isCollectCommand = collectSteps.includes(currentMoveIndex);
        
        // If this is a collect command and robot is on a collectible position, collect it
        if (isCollectCommand) {
          // Check if the current position has a collectible in the initial level data
          // and it hasn't been collected yet
          const robotIsOnCollectible = initialLevelData[currentPos] === TileType.COLLECTIBLE;
          const isPositionNotCollectedYet = collectiblePositions.includes(currentPos);
          
          if (robotIsOnCollectible && isPositionNotCollectedYet) {
            // Collect the item
            setRobotState(prev => ({ ...prev, collected: prev.collected + 1 }));
            // Remove this position from collectible positions
            setCollectiblePositions(prev => prev.filter(pos => pos !== currentPos));
          }
        }

        // Clear previous position, restoring the original tile if needed
        if (initialLevelData[currentPos] === TileType.COLLECTIBLE && 
            collectiblePositions.includes(currentPos)) {
          // If this was a collectible position and it hasn't been collected yet, restore it
          newLevelData[currentPos] = TileType.COLLECTIBLE;
        } else {
          // Otherwise, set to empty
          newLevelData[currentPos] = TileType.EMPTY;
        }

        // Put robot in new position
        newLevelData[newPos] = TileType.ROBOT;

        // Play movement sound
        if (audioInitialized && robotState.state === 'on') {
          playMoveSound();
        }

        // Pass the new array directly to setLevelData
        setLevelData(newLevelData);

        // Check if robot has reached the goal and collected all collectibles
        const goalReached = checkGoalReached(newLevelData);
        const allCollectiblesCollected = robotState.collected === totalCollectibles; 
        
        if (goalReached && (allCollectiblesCollected || totalCollectibles === 0)) {
          setLevelCompleted(true);
          
          // Play goal reached sound
          if (audioInitialized) {
            playGoalSound();
          }
        }

        // Use original delay for animations
        setTimeout(() => {
          setCurrentMoveIndex(prev => prev + 1);
        }, 500); // Restore to original 500ms
        
      }, 500); // Restore to original 500ms
    } else if (currentMoveIndex >= movementSequence.length && movementSequence.length > 0) {
      setIsExecuting(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isExecuting, currentMoveIndex, movementSequence, levelData, collectiblePositions, 
      collectSteps, totalCollectibles, initialLevelData, robotState, flattenedCommands, audioInitialized]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    // If level was completed, show success dialog after a short delay
    if (levelCompleted) {
      timeoutId = setTimeout(() => {
        setShowSuccessDialog(true);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [levelCompleted]);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden w-full md:h-[800px]">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 bg-slate-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
          <span className="text-xs md:text-sm font-semibold text-slate-400">Panel de Control</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs md:text-sm font-medium text-yellow-400 flex items-center">
            <span className="mr-2">🪴</span>
            {robotState.collected} / {totalCollectibles}
          </div>
          <Button
            onClick={handleExecuteCode}
            className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm"
            icon={Play}
            disabled={isExecuting}
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
            <Terminal
              commands={commands}
              isExecuting={isExecuting}
              isCompiling={isCompiling}
              error={error}
              executeCommand={() => { }}
              currentCommandIndex={currentMoveIndex}
            />
          </div>
        </div>
      </div>

      {/* Help Dialog */}
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={handleConfirmLevelCompletion}
        isPending={isPendingUpdate}
      />
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
                    
                    {/* Add special description for variable assignment */}
                    {cmd.command === COMMANDS.variable_assign && (
                      <div className="mt-2 p-2 bg-slate-700/50 rounded border border-slate-600">
                        <p className="text-xs text-slate-300">
                          Asignación de variables:
                        </p>
                        <pre className="mt-1 text-xs font-mono text-green-400 overflow-x-auto p-2 bg-slate-800/50 rounded">
                          {`veces = 3
repeticiones = 5`}
                        </pre>
                        <p className="mt-2 text-xs text-slate-400">
                          Crea variables que pueden usarse en bucles for y otras partes del código.
                        </p>
                      </div>
                    )}
                    
                    {/* Add special description for for loops */}
                    {cmd.command === COMMANDS.for_loop && (
                      <div className="mt-2 p-2 bg-slate-700/50 rounded border border-slate-600">
                        <p className="text-xs text-slate-300">
                          Ejemplos de bucle for:
                        </p>
                        <pre className="mt-1 text-xs font-mono text-green-400 overflow-x-auto p-2 bg-slate-800/50 rounded">
                          {`-- Con números fijos
for i=1,3 do
  robot:moverDerecha()
end

-- Con variables
veces = 5
for i=1,veces do
  robot:moverDerecha()
end`}
                        </pre>
                        <p className="mt-2 text-xs text-slate-400">
                          Repite comandos un número específico de veces. Puedes usar números o variables para definir el rango.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Add additional examples section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Ejemplos Avanzados</h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <h4 className="font-medium text-blue-400">Variables y bucles</h4>
                <pre className="mt-2 text-xs font-mono text-green-400 overflow-x-auto p-2 bg-slate-700/50 rounded">
                  {`-- Definir variables para movimientos
movX = 2
movY = 3

-- Moverse a la derecha movX veces
for i=1,movX do
  robot:moverDerecha()
end

-- Moverse hacia abajo movY veces
for i=1,movY do
  robot:moverAbajo()
end`}
                </pre>
                <p className="mt-2 text-sm text-slate-300">
                  Este código usa variables para controlar el número de movimientos en cada dirección.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorSection;