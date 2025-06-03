// BlocklyEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Edit2 } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { COMMAND_CATEGORIES, COMMANDS } from '@/lib/constants';

interface BlocklyEditorProps {
  value: string;
  onChange: (code: string) => void;
}

interface Block {
  id: string;
  type: 'command' | 'loop' | 'if' | 'else' | 'variable';
  command: string;
  inputs?: {
    [key: string]: string;
  };
  children?: Block[];
}

const BlocklyEditor: React.FC<BlocklyEditorProps> = ({ value, onChange }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeCategory, setActiveCategory] = useState<keyof typeof COMMAND_CATEGORIES>('basico');
  const [draggingBlock, setDraggingBlock] = useState<Block | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<{id: string, input: string} | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Parse initial code when component mounts or value changes from outside
  useEffect(() => {
    if (value && isInitialRender.current) {
      try {
        const parsedBlocks = parseCodeToBlocks(value);
        setBlocks(parsedBlocks);
      } catch (error) {
        console.error("Failed to parse code:", error);
      }
      isInitialRender.current = false;
    }
  }, [value]);

  // Generate code whenever blocks change and update parent
  useEffect(() => {
    if (isInitialRender.current) return;
    
    const generatedCode = generateCode(blocks);
    const codeWithBoilerplate = addBoilerplate(generatedCode);
    
    if (!codeEquivalent(codeWithBoilerplate, value)) {
      onChange(codeWithBoilerplate);
    }
  }, [blocks]);

  // Focus on input when editing a block
  useEffect(() => {
    if (editingBlock && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingBlock]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, command: string, blockType: Block['type'], blockId: string | null = null) => {
    let newBlock: Block;
    
    if (blockId) {
      // Existing block
      newBlock = findBlockById(blocks, blockId)!;
    } else {
      // New block
      newBlock = {
        id: generateId(),
        type: blockType,
        command: command,
      };
      
      // Add specific properties based on block type
      if (blockType === 'loop') {
        // Extract loop parameters from command if it's a for loop
        const forLoopMatch = command.match(/for\s+(\w+)\s*=\s*(\w+|\d+)\s*,\s*(\w+|\d+)\s*do/);
        if (forLoopMatch) {
          const [_, iterator, start, end] = forLoopMatch;
          newBlock.inputs = {
            iterator: iterator || 'i',
            start: start || '1',
            end: end || '3'
          };
          newBlock.children = [];
        }
      } 
      else if (blockType === 'variable') {
        // Extract variable name and value
        const varMatch = command.match(/(\w+)\s*=\s*(\d+)/);
        if (varMatch) {
          const [_, name, value] = varMatch;
          newBlock.inputs = {
            name: name || 'veces',
            value: value || '3'
          };
        }
      }
      else if (blockType === 'if' || blockType === 'else') {
        newBlock.children = [];
      }
    }
    
    setDraggingBlock(newBlock);
    e.dataTransfer.setData('text/plain', command);
  };

  // Also, you might want to update your findBlockById function to be more robust:
  const findBlockById = (blockList: Block[], id: string): Block | null => {
    if (!blockList || !Array.isArray(blockList)) return null;
    
    for (const block of blockList) {
      if (!block || typeof block !== 'object') continue;
      if (block.id === id) return block;
      if (block.children && Array.isArray(block.children)) {
        const found = findBlockById(block.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update a block by ID (for input editing)
  const updateBlockById = (blockList: Block[], id: string, update: Partial<Block>): Block[] => {
    return blockList.map(block => {
      if (block.id === id) {
        return { ...block, ...update };
      }
      if (block.children) {
        return {
          ...block,
          children: updateBlockById(block.children, id, update)
        };
      }
      return block;
    });
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetId: string | null = null) => {
    e.preventDefault();
    
    if (!draggingBlock) return;
    
    const newBlocks = [...blocks];
    
    if (!targetId) {
      // Dropping at the root level
      if (!findBlockById(newBlocks, draggingBlock.id)) {
        newBlocks.push({...draggingBlock});
      }
    } else {
      // Dropping inside another block
      const findAndUpdate = (blockList: Block[]): boolean => {
        for (let i = 0; i < blockList.length; i++) {
          const block = blockList[i];
          
          if (block.id === targetId) {
            if (block.children) {
              // Don't add if already there
              if (!findBlockById(block.children, draggingBlock.id)) {
                block.children.push({...draggingBlock});
              }
              return true;
            }
            return false;
          }
          
          if (block.children && findAndUpdate(block.children)) {
            return true;
          }
        }
        return false;
      };
      
      findAndUpdate(newBlocks);
    }
    
    setBlocks(newBlocks);
    setDraggingBlock(null);
    setDropTarget(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, targetId: string | null = null) => {
    e.preventDefault();
    setDropTarget(targetId);
  };

  // Generate a unique ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Parse code to blocks - more robust implementation
  const parseCodeToBlocks = (code: string): Block[] => {
    // Filter out comment lines and empty lines
    const lines = code.split('\n')
                      .map(line => line.trim())
                      .filter(line => line && !line.startsWith('--') && line !== '-- Area de codigo para programar el robot' && !line.includes('-- class definition'));
    
    const blocks: Block[] = [];
    const blockStack: {blocks: Block[], type: string}[] = [{blocks, type: 'root'}];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/;$/, ''); // Remove trailing semicolons
      
      // Always ensure we have a valid stack
      if (blockStack.length === 0) {
        blockStack.push({blocks, type: 'root'});
      }
      
      // Check for for loop
      const forLoopMatch = line.match(/for\s+(\w+)\s*=\s*(\w+|\d+)\s*,\s*(\w+|\d+)\s*do/);
      if (forLoopMatch) {
        const [_, iterator, start, end] = forLoopMatch;
        
        const newBlock: Block = {
          id: generateId(),
          type: 'loop',
          command: line,
          inputs: {
            iterator: iterator || 'i',
            start: start || '1',
            end: end || '3'
          },
          children: []
        };
        
        // Make sure blockStack[0] exists before accessing
        if (blockStack[0] && blockStack[0].blocks) {
          blockStack[0].blocks.push(newBlock);
          blockStack.unshift({blocks: newBlock.children!, type: 'loop'});
        }
      }
      // Check for variable assignment
      else if (line.match(/^\w+\s*=\s*\d+$/)) {
        const varMatch = line.match(/(\w+)\s*=\s*(\d+)/);
        if (varMatch) {
          const [_, name, value] = varMatch;
          
          const newBlock: Block = {
            id: generateId(),
            type: 'variable',
            command: line,
            inputs: {
              name: name,
              value: value
            }
          };
          
          if (blockStack[0] && blockStack[0].blocks) {
            blockStack[0].blocks.push(newBlock);
          }
        }
      }
      // Check for if statement
      else if (line.includes('if') && line.includes('then')) {
        const newBlock: Block = {
          id: generateId(),
          type: 'if',
          command: line,
          children: []
        };
        
        if (blockStack[0] && blockStack[0].blocks) {
          blockStack[0].blocks.push(newBlock);
          blockStack.unshift({blocks: newBlock.children!, type: 'if'});
        }
      }
      // Check for else
      else if (line === 'else') {
        if (blockStack.length > 1 && blockStack[0].type === 'if') {
          blockStack.shift();
          
          const newBlock: Block = {
            id: generateId(),
            type: 'else',
            command: line,
            children: []
          };
          
          if (blockStack[0] && blockStack[0].blocks) {
            blockStack[0].blocks.push(newBlock);
            blockStack.unshift({blocks: newBlock.children!, type: 'else'});
          }
        }
      }
      // Check for end
      else if (line === 'end') {
        if (blockStack.length > 1) {
          blockStack.shift();
        }
      }
      // Regular command
      else if (line) {
        if (blockStack[0] && blockStack[0].blocks) {
          blockStack[0].blocks.push({
            id: generateId(),
            type: 'command',
            command: line
          });
        }
      }
    }
    
    return blocks;
  };

  const generateCode = (blockList: Block[], indentLevel: number = 0): string => {
    if (!blockList || !Array.isArray(blockList)) return '';
    
    let code = '';
    const indent = '  '.repeat(indentLevel);
    
    blockList.forEach(block => {
      if (!block || typeof block !== 'object') return;
      
      if (block.type === 'command') {
        // Add semicolon for command statements
        const needsSemicolon = 
          block.command.includes('robot:') || 
          block.command.includes('=') && !block.command.includes('for');
          
        code += `${indent}${block.command}${needsSemicolon ? ';' : ''}\n`;
      } 
      else if (block.type === 'variable') {
        // Handle variable assignment with inputs
        const name = block.inputs?.name || 'veces';
        const value = block.inputs?.value || '3';
        code += `${indent}${name} = ${value};\n`;
      }
      else if (block.type === 'loop') {
        // Handle for loop with inputs
        const iterator = block.inputs?.iterator || 'i';
        const start = block.inputs?.start || '1';
        const end = block.inputs?.end || '3';
        
        code += `${indent}for ${iterator}=${start},${end} do\n`;
        
        if (block.children && block.children.length > 0) {
          code += generateCode(block.children, indentLevel + 1);
        }
        
        code += `${indent}end\n`;
      }
      else if (block.type === 'if') {
        code += `${indent}${block.command}\n`;
        
        if (block.children && block.children.length > 0) {
          code += generateCode(block.children, indentLevel + 1);
        }
        
        code += `${indent}end\n`;
      }
      else if (block.type === 'else') {
        code += `${indent}else\n`;
        
        if (block.children && block.children.length > 0) {
          code += generateCode(block.children, indentLevel + 1);
        }
      }
    });
    
    return code;
  };
  

  // Delete a block
  const deleteBlock = (blockId: string) => {
    const removeBlock = (blockList: Block[]): Block[] => {
      return blockList.filter(block => {
        if (block.id === blockId) {
          return false;
        }
        
        if (block.children) {
          block.children = removeBlock(block.children);
        }
        
        return true;
      });
    };
    
    setBlocks(removeBlock([...blocks]));
  };

  // Start editing a block input
  const startEditingInput = (blockId: string, inputName: string) => {
    setEditingBlock({ id: blockId, input: inputName });
  };

  // Get color for block based on type and category
  const getBlockColor = (command: string, blockType: Block['type']): string => {
    if (blockType === 'variable') {
      return 'bg-red-400 border-red-500';
    } else if (blockType === 'loop') {
      return 'bg-green-500 border-green-600';
    } else if (blockType === 'if' || blockType === 'else') {
      return 'bg-orange-500 border-orange-600';
    } else if (command.includes('mover') || command.includes('saltar')) {
      return 'bg-cyan-600 border-cyan-700';
    } else if (command.includes('encender') || command.includes('apagar') || command.includes('Robot.new')) {
      return 'bg-green-600 border-green-700';
    } else if (command.includes('recolectar')) {
      return 'bg-yellow-600 border-yellow-700';
    } else if (command.includes('hayObstaculo')) {
      return 'bg-orange-600 border-orange-700';
    }
    return 'bg-blue-600 border-blue-700';
  };

  // Get color for category button
  const getCategoryColor = (key: string): string => {
    switch (key) {
      case 'basico': return 'green';
      case 'movimiento': return 'cyan';
      case 'acciones': return 'yellow';
      case 'control': return 'purple';
      case 'condicionales': return 'orange';
      default: return 'slate';
    }
  };

  // Render input field for editable blocks
  const renderInput = (block: Block, inputName: string, label: string) => {
    const isEditing = editingBlock?.id === block.id && editingBlock?.input === inputName;
    const inputValue = block.inputs?.[inputName] || '';
    
    if (isEditing) {
      return (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (inputRef.current) {
              const updatedBlocks = updateBlockById(blocks, block.id, {
                inputs: {
                  ...(block.inputs || {}),
                  [inputName]: inputRef.current.value
                }
              });
              setBlocks(updatedBlocks);
              setEditingBlock(null);
            }
          }}
          className="inline-block"
        >
          <input 
            ref={inputRef}
            type="text" 
            defaultValue={inputValue}
            className="w-16 px-1 py-0.5 rounded bg-white border border-gray-400 text-black text-xs"
            onBlur={(e) => {
              const updatedBlocks = updateBlockById(blocks, block.id, {
                inputs: {
                  ...(block.inputs || {}),
                  [inputName]: e.target.value
                }
              });
              setBlocks(updatedBlocks);
              setEditingBlock(null);
            }}
          />
        </form>
      );
    }
    
    return (
      <span 
        className="px-2 py-0.5 mx-1 bg-white/20 rounded cursor-pointer hover:bg-white/30 flex items-center"
        onClick={() => startEditingInput(block.id, inputName)}
      >
        {inputValue}
        <Edit2 className="w-3 h-3 ml-1 opacity-70" />
      </span>
    );
  };

  // Render a block
  const renderBlock = (block: Block, isNested: boolean = false) => {
    // Check if block is valid to prevent infinite recursion
    if (!block || typeof block !== 'object') {
      console.error('Invalid block object:', block);
      return null;
    }
  
    const blockColor = getBlockColor(block.command, block.type);
    let blockClasses = `flex flex-col p-1 rounded-md border-2 mb-2 ${blockColor}`;
    
    if (dropTarget === block.id) {
      blockClasses += ' ring-2 ring-yellow-400';
    }
    
    return (
      <div 
        key={block.id}
        className={blockClasses}
        draggable
        onDragStart={(e) => handleDragStart(e, block.command, block.type, block.id)}
        onDragOver={(e) => handleDragOver(e, block.id)}
        onDrop={(e) => handleDrop(e, block.id)}
      >
        <div className="flex items-center justify-between p-1 text-white">
          {block.type === 'variable' ? (
            <div className="font-mono text-xs md:text-sm flex items-center">
              {renderInput(block, 'name', 'Variable')} = {renderInput(block, 'value', 'Value')}
            </div>
          ) : block.type === 'loop' ? (
            <div className="font-mono text-xs md:text-sm flex items-center">
              for {renderInput(block, 'iterator', 'Iterator')}={renderInput(block, 'start', 'Start')},{renderInput(block, 'end', 'End')} do
            </div>
          ) : (
            <span className="font-mono text-xs md:text-sm">{typeof block.command === 'string' ? block.command : JSON.stringify(block.command)}</span>
          )}
          
          {!isNested && (
            <button 
              onClick={() => deleteBlock(block.id)}
              className="p-1 text-white opacity-80 hover:opacity-100"
            >
              ×
            </button>
          )}
        </div>
        
        {block.children && Array.isArray(block.children) && (
          <div className="ml-4 pl-2 border-l-2 border-white border-opacity-40 mt-1">
            {block.children.map(child => 
              child && typeof child === 'object' ? renderBlock(child, true) : null
            )}
            <div 
              className="text-xs text-white text-opacity-70 p-2 border border-dashed border-white border-opacity-30 rounded mt-1 italic"
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDrop={(e) => handleDrop(e, block.id)}
            >
              Arrastra bloques aquí
            </div>
          </div>
        )}
      </div>
    );
  };
  

  // Helper function to add boilerplate code
  const addBoilerplate = (code: string): string => {
    let result = code;
    
    if (!result.includes('-- Area de codigo para programar el robot')) {
      result = `-- Area de codigo para programar el robot\n${result}`;
    }
    
    if (!result.includes('-- class definition')) {
      result += '\n-- class definition\n';
    }
    
    return result;
  };

  // Helper function to check if codes are equivalent (ignoring formatting)
  const codeEquivalent = (code1: string, code2: string): boolean => {
    // Remove comments, whitespace, and common boilerplate
    const normalize = (code: string) => {
      return code
        .replace(/--.*$/gm, '') // Remove comments
        .replace(/\s+/g, '')    // Remove whitespace
        .replace(/;/g, '')      // Remove semicolons (optional)
        // Remove common boilerplate
        .replace(/--Areacodigorobot/g, '')
        .replace(/--classdefinition/g, '');
    };
    
    return normalize(code1) === normalize(code2);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Command Categories */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-800 border-b border-slate-700">
        {Object.entries(COMMAND_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            variant="command"
            color={activeCategory === key ? getCategoryColor(key) : 'slate'}
            onClick={() => setActiveCategory(key as keyof typeof COMMAND_CATEGORIES)}
            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5"
          >
            {category.label}
          </Button>
        ))}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Command Palette */}
        <div className="w-1/3 bg-slate-800/50 border-r border-slate-700 p-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 mb-2">{COMMAND_CATEGORIES[activeCategory].label}</h3>
          <div className="flex flex-col gap-1">
            {COMMAND_CATEGORIES[activeCategory].commands.map((cmd, index) => {
              // Add null check to handle undefined command properties
              const commandStr = cmd?.command || '';
              
              const blockType = commandStr.includes('for') ? 'loop' : 
                              (commandStr.includes('if') ? 'if' : 
                              (commandStr.includes('else') ? 'else' : 
                              (commandStr.includes('=') && !commandStr.includes('for') ? 'variable' : 'command')));
              
              const blockColor = getBlockColor(commandStr, blockType);
              return (
                <div
                  key={index}
                  className={`p-1 rounded text-white text-xs md:text-sm cursor-move ${blockColor}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, commandStr, blockType)}
                >
                  <div className="flex items-center">
                    <ChevronRight className="w-3 h-3 mr-1" />
                    <span className="font-mono">{commandStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Workspace */}
        <div 
          ref={workspaceRef}
          className="flex-1 bg-slate-900 p-4 overflow-y-auto"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}
        >
          {blocks.map(block => renderBlock(block))}
          
          {blocks.length === 0 && (
            <div className="border-2 border-dashed border-slate-700 rounded-md p-4 text-center text-slate-500">
              Arrastra comandos aquí para empezar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocklyEditor;