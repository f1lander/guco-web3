'use client';
import { COMMANDS } from '@/lib/constants';
import React, { useEffect, useRef, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { useScreenSize } from '@/hooks/useScreenSize';

// Add type declarations for dynamic Blockly properties
declare global {
  interface Window {
    Blockly: any;
    DarkTheme: any;
    define?: any;
  }
}

interface BlocklyWorkspaceProps {
  code: string;
  onGenerateCode: (code: string) => void;
}

const BlocklyRobotWorkspace = ({ code, onGenerateCode }: BlocklyWorkspaceProps) => {
  const blocklyContainerRef = useRef(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const { screenCategory, blocklyContainerHeight } = useScreenSize();
  const [mounted, setMounted] = useState(false);

  // Add effect to handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar scripts de Blockly y el tema oscuro dinámicamente
  useEffect(() => {
    const loadRequiredScripts = async () => {
      if (!blocklyLoaded) {
        try {
          // Cargar Blockly principal
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/blockly/9.3.1/blockly.min.js');

          // Cargar generador JavaScript
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/blockly/9.3.1/javascript.min.js');

          // Crear un script para cargar el tema oscuro manualmente
          const darkThemeScript = document.createElement('script');
          darkThemeScript.textContent = `
            if (window.Blockly) {
              window.DarkTheme = Blockly.Theme.defineTheme('darkBlockly', {
                'base': Blockly.Themes.Classic,
                'componentStyles': {
                  'workspaceBackgroundColour': '#1e1e1e',
                  'toolboxBackgroundColour': '#333',
                  'toolboxForegroundColour': '#fff',
                  'flyoutBackgroundColour': '#252526',
                  'flyoutForegroundColour': '#ccc',
                  'flyoutOpacity': 1,
                  'scrollbarColour': '#797979',
                  'insertionMarkerColour': '#fff',
                  'insertionMarkerOpacity': 0.3,
                  'scrollbarOpacity': 0.4,
                  'cursorColour': '#d0d0d0',
                },
                'blockStyles': {
                  'logic_blocks': {
                    'colourPrimary': '#01579B',
                    'colourSecondary': '#0288D1',
                    'colourTertiary': '#29B6F6',
                  },
                  'loop_blocks': {
                    'colourPrimary': '#33691E',
                    'colourSecondary': '#388E3C',
                    'colourTertiary': '#4CAF50',
                  },
                  'math_blocks': {
                    'colourPrimary': '#1A237E',
                    'colourSecondary': '#283593',
                    'colourTertiary': '#3949AB',
                  },
                  'text_blocks': {
                    'colourPrimary': '#880E4F',
                    'colourSecondary': '#AD1457',
                    'colourTertiary': '#D81B60',
                  },
                  'list_blocks': {
                    'colourPrimary': '#311B92',
                    'colourSecondary': '#4527A0',
                    'colourTertiary': '#5E35B1',
                  },
                  'variable_blocks': {
                    'colourPrimary': '#4A148C',
                    'colourSecondary': '#6A1B9A',
                    'colourTertiary': '#8E24AA',
                  },
                  'procedure_blocks': {
                    'colourPrimary': '#004D40',
                    'colourSecondary': '#00695C',
                    'colourTertiary': '#00897B',
                  },
                },
                'fontStyle': {
                  'family': 'sans-serif',
                  'weight': 'normal',
                  'size': 12,
                },
                'startHats': true,
              });
            }
          `;
          document.head.appendChild(darkThemeScript);

          setBlocklyLoaded(true);
          setThemeLoaded(true);
        } catch (error) {
          console.error('Error cargando scripts:', error);
        }
      }
    };

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        // Create a script element
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        // Add a data-manual attribute to prevent automatic loading as AMD module
        script.setAttribute('data-manual', 'true');

        // Before script loads, temporarily disable AMD define
        const originalDefine = window.define;
        if (window.define && window.define.amd) {
          window.define = undefined;
        }

        script.onload = () => {
          // Restore define after script is loaded
          if (originalDefine) {
            window.define = originalDefine;
          }
          resolve(true);
        };

        script.onerror = () => reject(new Error(`Error cargando script: ${src}`));
        document.body.appendChild(script);
      });
    };

    loadRequiredScripts();
  }, [blocklyLoaded]);

  // Inicializar Blockly con bloques personalizados cuando los scripts estén cargados
  useEffect(() => {
    if (blocklyLoaded && themeLoaded && window.Blockly && window.DarkTheme && blocklyContainerRef.current && !workspace) {
      // Definir bloques personalizados basados en los comandos del robot

      // Bloques de la categoría Básico
      window.Blockly.Blocks[COMMANDS.turn_on_robot] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Encender Robot");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(120); // verde
          this.setTooltip("Enciende el robot");
        }
      };

      window.Blockly.JavaScript[COMMANDS.turn_on_robot] = function () {
        return "robot:encender()\n";
      };

      window.Blockly.Blocks[COMMANDS.turn_off_robot] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Apagar Robot");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(120); // verde
          this.setTooltip("Apaga el robot");
        }
      };

      window.Blockly.JavaScript[COMMANDS.turn_off_robot] = function () {
        return "robot:apagar()\n";
      };

      // Bloques de la categoría Movimiento
      window.Blockly.Blocks[COMMANDS.move_right] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Mover Derecha");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Mueve el robot hacia la derecha");
        }
      };

      window.Blockly.JavaScript[COMMANDS.move_right] = function () {
        return "robot:moverDerecha()\n";
      };

      window.Blockly.Blocks[COMMANDS.move_left] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Mover Izquierda");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Mueve el robot hacia la izquierda");
        }
      };

      window.Blockly.JavaScript[COMMANDS.move_left] = function () {
        return "robot:moverIzquierda()\n";
      };

      window.Blockly.Blocks[COMMANDS.move_up] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Mover Arriba");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Mueve el robot hacia arriba");
        }
      };

      window.Blockly.JavaScript[COMMANDS.move_up] = function () {
        return "robot:moverArriba()\n";
      };

      window.Blockly.Blocks[COMMANDS.move_down] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Mover Abajo");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Mueve el robot hacia abajo");
        }
      };

      window.Blockly.JavaScript[COMMANDS.move_down] = function () {
        return "robot:moverAbajo()\n";
      };

      window.Blockly.Blocks[COMMANDS.jump_right] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Saltar Derecha");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Hace que el robot salte hacia la derecha");
        }
      };

      window.Blockly.JavaScript[COMMANDS.jump_right] = function () {
        return "robot:saltarDerecha()\n";
      };

      window.Blockly.Blocks[COMMANDS.jump_left] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Saltar Izquierda");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Hace que el robot salte hacia la izquierda");
        }
      };

      window.Blockly.JavaScript[COMMANDS.jump_left] = function () {
        return "robot:saltarIzquierda()\n";
      };

      window.Blockly.Blocks[COMMANDS.jump_up] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Saltar Arriba");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Hace que el robot salte hacia arriba");
        }
      };

      window.Blockly.JavaScript[COMMANDS.jump_up] = function () {
        return "robot:saltarArriba()\n";
      };

      window.Blockly.Blocks[COMMANDS.jump_down] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Saltar Abajo");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160); // cian
          this.setTooltip("Hace que el robot salte hacia abajo");
        }
      };

      window.Blockly.JavaScript[COMMANDS.jump_down] = function () {
        return "robot:saltarAbajo()\n";
      };

      // Bloques de la categoría Acciones
      window.Blockly.Blocks[COMMANDS.collect_item] = {
        init: function () {
          this.appendDummyInput()
            .appendField("Recolectar Objeto");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(60); // amarillo
          this.setTooltip("Recoge un objeto en la posición del robot");
        }
      };

      window.Blockly.JavaScript[COMMANDS.collect_item] = function () {
        return "robot:recolectar()\n";
      };

      // Bloques de la categoría Control
      window.Blockly.Blocks[COMMANDS.variable_assign] = {
        init: function () {
          this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("establecer variable")
            .appendField(new window.Blockly.FieldTextInput("x"), "VAR")
            .appendField("a");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(270); // púrpura
          this.setTooltip("Asigna un valor a una variable");
        }
      };

      window.Blockly.JavaScript[COMMANDS.variable_assign] = function (block: any) {
        const variable = block.getFieldValue('VAR');
        const value = window.Blockly.JavaScript.valueToCode(block, 'VALUE', window.Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
        return `local ${variable} = ${value}\n`;
      };

      window.Blockly.Blocks[COMMANDS.for_loop] = {
        init: function () {
          this.appendValueInput("TIMES")
            .setCheck("Number")
            .appendField("repetir");
          this.appendDummyInput()
            .appendField("veces");
          this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("hacer");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(270); // púrpura
          this.setTooltip("Repite los comandos encerrados un número específico de veces");
        }
      };

      window.Blockly.JavaScript[COMMANDS.for_loop] = function (block: any) {
        const times = window.Blockly.JavaScript.valueToCode(block, 'TIMES', window.Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
        const statements = window.Blockly.JavaScript.statementToCode(block, 'DO');
        return `for i=1,${times} do\n${statements}end\n`;
      };

      // Configuración del toolbox basada en las categorías de comandos
      const toolbox = {
        kind: 'categoryToolbox',
        size: 'small',
        contents: [
          {
            kind: 'category',
            name: 'Inicio',
            colour: '120', // verde
            contents: [
              { kind: 'block', type: COMMANDS.turn_on_robot },
              { kind: 'block', type: COMMANDS.turn_off_robot },
            ],
          },
          {
            kind: 'category',
            name: 'Movimiento',
            colour: '160', // cian
            contents: [
              { kind: 'block', type: COMMANDS.move_right },
              { kind: 'block', type: COMMANDS.move_left },
              { kind: 'block', type: COMMANDS.move_up },
              { kind: 'block', type: COMMANDS.move_down },
            ],
          },
          {
            kind: 'category',
            name: 'Saltos',
            colour: '180', // azul
            contents: [
              { kind: 'block', type: COMMANDS.jump_right },
              { kind: 'block', type: COMMANDS.jump_left },
              { kind: 'block', type: COMMANDS.jump_up },
              { kind: 'block', type: COMMANDS.jump_down },
            ],
          },
          {
            kind: 'category',
            name: 'Acciones',
            colour: '60', // amarillo
            contents: [
              { kind: 'block', type: COMMANDS.collect_item },
            ],
          },
          {
            kind: 'category',
            name: 'Control',
            colour: '270', // púrpura
            contents: [
              { kind: 'block', type: COMMANDS.variable_assign },
              { kind: 'block', type: COMMANDS.for_loop },
              { kind: 'block', type: 'math_number' },
            ],
          },
        ],
      };

      // Get scale based on screen size
      const getStartScale = () => {
        switch (screenCategory) {
          case 'xs': return 0.7;
          case 'sm': return 0.9;
          case 'md': 
          case 'lg': return 1.0;
          default: return 0.8;
        }
      };

      const newWorkspace = window.Blockly.inject(blocklyContainerRef.current, {
        toolbox: toolbox,
        theme: window.DarkTheme,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#555',
          snap: true,
        },
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: getStartScale(),
          maxScale: 3,
          minScale: 0.3,
        },
        // Especificar la ruta correcta para los íconos
        media: 'https://blockly-demo.appspot.com/static/media/',
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true
          },
          drag: true,
          wheel: true
        },
      });

      setWorkspace(newWorkspace);

      // Crear algunos bloques iniciales
      const startBlocks = `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="${COMMANDS.turn_on_robot}" x="20" y="20">
            <next>
              <block type="${COMMANDS.move_right}">
                <next>
                  <block type="${COMMANDS.for_loop}">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">3</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="${COMMANDS.jump_up}">
                        <next>
                          <block type="${COMMANDS.collect_item}"></block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="${COMMANDS.turn_off_robot}"></block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>
      `;

      // Cargar bloques iniciales
      const xml = window.Blockly.utils.xml.textToDom(startBlocks);
      window.Blockly.Xml.domToWorkspace(xml, newWorkspace);

      // Agregar un listener de cambios para generar código
      newWorkspace.addChangeListener(() => {
        // Obtener JavaScript y convertir a Lua
        let jsCode = window.Blockly.JavaScript.workspaceToCode(newWorkspace);

        // Asegurarse de que esto no se ejecute en un bucle
        // setGeneratedCode(jsCode);
        onGenerateCode(jsCode);
      });

      // Corrección para el problema de la barra de desplazamiento y z-index
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        .blocklyToolboxDiv {
          overflow-x: hidden !important;
          background-color: #333 !important;
          color: #fff !important;
          z-index: 50 !important; /* Lower z-index for toolbox */
        }
        .blocklyFlyout {
          overflow: hidden !important;
          z-index: 49 !important; /* Lower z-index for flyout */
        }
        .blocklyFlyoutScrollbar {
          display: none !important;
        }
        
        /* Control z-index for dropdown elements */
        .blocklyWidgetDiv {
          z-index: 51 !important; /* Higher than toolbox but lower than app dialogs */
        }
        
        /* Control z-index for the main blockly workspace */
        .blocklyWorkspace {
          z-index: 10 !important;
        }
        
        /* Control z-index for tooltips */
        .blocklyTooltipDiv {
          z-index: 52 !important; /* Higher than widgets but lower than app dialogs */
        }
        
        /* Ensure your app dialogs have z-index higher than 100 */
        .app-dialog, .modal, .dialog, [role="dialog"] {
          z-index: 1000 !important; /* Much higher than any Blockly component */
        }
        
        /* Asegurarse de que los íconos de la papelera y zoom sean visibles */
        .blocklyTrash {
          opacity: 1 !important;
          z-index: 40 !important;
        }
        .blocklyZoom {
          opacity: 1 !important;
          z-index: 40 !important;
        }
        
        /* Mejorar la visibilidad de los iconos en tema oscuro */
        .blocklyTrash, .blocklyZoom {
          filter: invert(1);
        }
      `;
      document.head.appendChild(style);
    }
  }, [blocklyLoaded, themeLoaded, workspace, screenCategory]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={blocklyContainerRef}
        className="flex flex-col"
        style={{ height: mounted ? `${blocklyContainerHeight}px` : 'auto' }}
      />
      <div className="flex-grow hidden sm:block">
        <CodeBlock
          language="lua"
          filename="robot.lua"
          code={code}
        />
      </div>
    </div>
  );
};

export default BlocklyRobotWorkspace;