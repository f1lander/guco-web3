import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Sparkles, Command, Power, Lightbulb, Loader } from 'lucide-react';

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

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  ref?: React.RefObject<CodeEditor2Ref>;
}

interface CodeEditor2Ref {
  insertCommand: (command: string) => void;
}

export const CodeEditor = React.forwardRef<CodeEditor2Ref, CodeEditorProps>(({ 
  value, 
  onChange,
  readOnly = false,
  className = '' 
}, ref) => {
  const [inlineSuggestions, setInlineSuggestions] = useState<{ command: string; description: string; }[]>([]);
  const [showInlineSuggestions, setShowInlineSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, character: 0 });
  const editorRef = useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => ({
    insertCommand: (command: string) => {
      if (editorRef.current) {
        const cursorPos = editorRef.current.selectionStart;
        const textBefore = value.substring(0, cursorPos);
        const textAfter = value.substring(cursorPos);
        const newValue = textBefore + command + '\n' + textAfter;
        onChange(newValue);
        
        // Set new cursor position after the inserted command and newline
        const newCursorPos = cursorPos + command.length + 1;
        // Use setTimeout to ensure the textarea has updated
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
            editorRef.current.setSelectionRange(newCursorPos, newCursorPos);
            
            // Update cursor position state
            const lines = newValue.substring(0, newCursorPos).split('\n');
            setCursorPosition({
              line: lines.length - 1,
              character: lines[lines.length - 1].length
            });
          }
        }, 0);
      }
    }
  }));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Get current cursor position
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLineNumber = lines.length - 1;
    const currentLine = lines[currentLineNumber];
    
    // Update cursor position
    setCursorPosition({
      line: currentLineNumber,
      character: currentLine.length
    });
    
    // Show suggestions if typing "robot."
    if (currentLine.trim().endsWith('robot.')) {
      const allCommands = [...ROBOT_COMMANDS.movement, ...ROBOT_COMMANDS.actions]
        .map(cmd => ({
          ...cmd,
          command: cmd.command.replace('robot.', '')
        }));
      setInlineSuggestions(allCommands);
      setShowInlineSuggestions(true);
    } else {
      setShowInlineSuggestions(false);
    }
  };

  return (
    <textarea
      ref={editorRef}
      value={value}
      onChange={handleTextChange}
      readOnly={readOnly}
      className={`w-full p-4 bg-transparent text-white outline-none resize-none font-mono ${className}`}
      style={{ 
        minHeight: '300px',
        lineHeight: '1.5em'
      }}
    />
  );
});

CodeEditor.displayName = 'CodeEditor';
