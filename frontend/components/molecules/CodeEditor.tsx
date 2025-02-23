import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import Button from '../atoms/Button';

// Available commands categorized by type
const ROBOT_COMMANDS = {
  initialization: [
    {
      command: 'var robot = new Robot();',
      description: 'Create new robot instance',
      snippet: 'var robot = new Robot();\n\nrobot.encender();\n\n// Your commands here\n\nrobot.apagar();'
    }
  ],
  basic: [
    { command: 'robot.encender()', description: 'Turn on the robot' },
    { command: 'robot.apagar()', description: 'Turn off the robot' }
  ],
  movement: [
    { command: 'robot.moveRight()', description: 'Move one step right' },
    { command: 'robot.moveLeft()', description: 'Move one step left' },
    { command: 'robot.moveUp()', description: 'Move one step up' },
    { command: 'robot.moveDown()', description: 'Move one step down' },
    { command: 'robot.jump()', description: 'Jump over obstacle' }
  ],
  actions: [
    { command: 'robot.collect()', description: 'Collect item at current position' },
    { command: 'robot.turnOnLight()', description: 'Turn on robot\'s light' },
    { command: 'robot.turnOffLight()', description: 'Turn off robot\'s light' },
    { command: 'robot.scan()', description: 'Scan surroundings for items' }
  ],
  conditions: [
    { command: 'robot.hasItemAhead()', description: 'Check if item is ahead' },
    { command: 'robot.isPathClear()', description: 'Check if path is clear' },
    { command: 'robot.isLightNeeded()', description: 'Check if light is needed' }
  ],
  loops: [
    {
      command: 'while (condition) {',
      description: 'Repeat while condition is true',
      snippet: 'while (robot.hasItemAhead()) {\n  // Commands here\n}'
    },
    {
      command: 'for (var i = 0; i < n; i++) {',
      description: 'Repeat n times',
      snippet: 'for (var i = 0; i < 3; i++) {\n  // Commands here\n}'
    }
  ]
};

const files = {
  'GameBoard.js': {
    name: 'GameBoard.js',
    language: 'javascript',
    value: `// Game board configuration
class GameBoard {
    constructor(width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.items = new Map(); // Stores positions of stars, targets, etc.
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    addItem(type, x, y) {
        const key = x + ',' + y;
        this.items.set(key, type);
    }

    hasItem(x, y) {
        return this.items.has(x + ',' + y);
    }

    removeItem(x, y) {
        this.items.delete(x + ',' + y);
    }
}`,
  },
  'Robot.js': {
    name: 'Robot.js',
    language: 'javascript',
    value: `class Robot {
    constructor(gameBoard) {
        this.x = 0;
        this.y = 0;
        this.gameBoard = gameBoard;
        this.collectedItems = [];
    }

    // Basic movement methods
    moverDerecha() {
        if (this.gameBoard.isValidPosition(this.x + 1, this.y)) {
            this.x += 1;
            this.checkCollision();
        }
    }

    moverIzquierda() {
        if (this.gameBoard.isValidPosition(this.x - 1, this.y)) {
            this.x -= 1;
            this.checkCollision();
        }
    }

    moverArriba() {
        if (this.gameBoard.isValidPosition(this.x, this.y - 1)) {
            this.y -= 1;
            this.checkCollision();
        }
    }

    moverAbajo() {
        if (this.gameBoard.isValidPosition(this.x, this.y + 1)) {
            this.y += 1;
            this.checkCollision();
        }
    }

    // Helper methods
    checkCollision() {
        if (this.gameBoard.hasItem(this.x, this.y)) {
            const item = this.gameBoard.items.get(this.x + ',' + this.y);
            if (item === 'star') {
                this.collectedItems.push('star');
                this.gameBoard.removeItem(this.x, this.y);
            } else if (item === 'goal') {
                this.reachedGoal = true;
            }
        }
    }

    hasReachedGoal() {
        return this.reachedGoal;
    }

    getCollectedStars() {
        return this.collectedItems.length;
    }
}`,

  },
  'GUCO.js': {
    name: 'GUCO.js',
    language: 'javascript',
    value: `// Initialize the game
function initializeGame(width = 8, height = 4) {
    const gameBoard = new GameBoard(width, height);
    const robot = new Robot(gameBoard);
    
    // Example setup - can be customized per level
    gameBoard.addItem('star', 3, 3);
    gameBoard.addItem('star', 5, 5);
    gameBoard.addItem('goal', 7, 7);
    
    return {
        robot,
        gameBoard
    };
}

// Here's where students will write their code
function studentCode() {
    const { robot } = initializeGame();
    
    // Students will write their commands here
    // Example:
    // robot.moverDerecha();
    // robot.moverArriba();
    // etc...
}

// Run the game
studentCode();`
  }
};


interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
  className?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  readOnly = false,
  className
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [fileName, setFileName] = useState('GUCO.js');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const options = {
    selectOnLineNumbers: false,
    lineNumbers: isMobile ? 'off' as const : 'on' as const,
    minimap: { enabled: true },
    fontSize: isMobile ? 14 : 12,
    lineHeight: isMobile ? 20 : 16,
    readOnly: readOnly,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 4, bottom: 4 },
    wordWrap: 'on' as const,
  };


  return (
    <div className={'h-[300px] md:h-full flex flex-col'}>
      {/* <div className="flex border-b border-slate-700">
        <div className="flex flex-row justify-between">
          {advancedMode && Object.keys(files).map((name) => (
            <Button
              key={name}
              onClick={() => setFileName(name)}
              className={`px-4 py-2 rounded-none border-r border-slate-700 ${fileName === name
                ? 'bg-slate-800 text-white border-b-2 border-b-blue-500'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
            >
              {name}
            </Button>
          ))}
        </div>
        <div className="flex w-full border-slate-700 justify-end p-1">
          <Button
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`px-4 py-1 m-2 rounded-full transition-colors text-xs ${advancedMode
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300'
              }`}
          >
            {advancedMode ? 'Simple' : 'Advanzado'}
          </Button>
        </div>
      </div> */}
      <Editor
        height="100%"
        defaultLanguage="lua"
        theme="vs-dark"
        defaultValue={value}
        options={options}
        onChange={onChange}
        loading={<div className="text-slate-700">Loading editor...</div>}
        onMount={(editor) => {
          (editorRef as React.MutableRefObject<any>).current = editor;

        }}
      />
    </div>
  );
};

CodeEditor.displayName = 'CodeEditor';
