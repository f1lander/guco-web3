const getAlchemyRpcUrl = (network: 'mainnet' | 'sepolia' | 'holesky') => {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (!apiKey) {
    return `https://ethereum-${network}-rpc.publicnode.com`;
  }
  return `https://eth-${network}.g.alchemy.com/v2/${apiKey}`;
};

export const GUCO_CONTRACT_ADDRESSES =
  process.env.NEXT_PUBLIC_GUCO_CONTRACT_ADDRESS as `0x${string}` ||
  '0x0000000000000000000000000000000000000000'

export const NETWORK = {
  MAINNET: {
    chainId: 1,
    rpcUrl: getAlchemyRpcUrl('mainnet'),
  },
  SEPOLIA: {
    chainId: 11155111,
    rpcUrl: getAlchemyRpcUrl('sepolia'),
  },
  HOLESKY: {
    chainId: 17000,
    rpcUrl: getAlchemyRpcUrl('holesky'),
  },
  ANVIL: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
  },
  DEVNET: {
    chainId: 1337,
    rpcUrl: 'http://localhost:8545',
  },
} as const;

export type NETWORK_TYPE = (typeof NETWORK)[keyof typeof NETWORK];
export type NETWORK_NAME = keyof typeof NETWORK;

export const CHAIN_ID: NETWORK_TYPE['chainId'] =
  (Number(process.env.NEXT_PUBLIC_CHAIN_ID) as NETWORK_TYPE['chainId']) ||
  NETWORK.HOLESKY['chainId'];

export const DEFAULT_NETWORK_NAME = (
  Object.entries(NETWORK).find(
    ([, id]) => id.chainId === CHAIN_ID,
  )?.[0] || ''
).toLowerCase() as Lowercase<NETWORK_NAME>;

export const WALLET_CONNECTION_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECTION_PROJECT_ID || '';

export const PRIVATE_WALLET_KEY = (process.env.PRIVATE_WALLET_KEY ||
  '0x...') as `0x${string}`;

export const RPC_URL = (() => {
  if (process.env.NEXT_PUBLIC_RPC_URL) {
    return process.env.NEXT_PUBLIC_RPC_URL;
  }

  // Default to the RPC_URL of the selected network
  const selectedNetwork = Object.values(NETWORK).find(
    (network) => network.chainId === CHAIN_ID,
  );
  return selectedNetwork ? selectedNetwork.rpcUrl : undefined;
})();

export const isTestnet = (() => {
  switch (CHAIN_ID) {
    case NETWORK.HOLESKY.chainId:
    default:
      return false;
  }
})();

export const EXPLORER_BASE_URL = process.env.NEXT_PUBLIC_EXPLORER_BASE_URL
  ? process.env.NEXT_PUBLIC_EXPLORER_BASE_URL
  : 'https://etherscan.io';

export const featureFlags = {} as const;

export const GOOGLE_ANALYTICS_TOKEN =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';


// Example levels definition
export const LANDING_PAGE_LEVELS = [
  // Level 1
  [
    0, 1, 0, 1, 0, 0, 1, 2,  // row 1
    0, 0, 1, 0, 1, 0, 1, 1,  // row 2
    0, 1, 0, 1, 0, 1, 1, 1,  // row 3
    3, 1, 0, 1, 0, 1, 0, 1   // row 4
  ],
  // Level 2
  [
    3, 0, 0, 0, 0, 0, 0, 0,  // row 1
    1, 1, 1, 1, 1, 0, 1, 1,  // row 2
    1, 0, 1, 0, 1, 0, 1, 0,  // row 3
    1, 0, 0, 0, 0, 1, 2, 1   // row 4
  ],
  // Add more levels as needed
];

// Update DEFAULT_LEVEL to flat array
export const DEFAULT_LEVEL = [
  0, 0, 0, 0, 0, 0, 0, 2,  // row 1
  0, 0, 0, 0, 0, 0, 0, 0,  // row 2
  0, 0, 0, 0, 0, 0, 0, 0,  // row 3
  3, 4, 0, 0, 0, 0, 0, 0   // row 4
];


export const GRID_WIDTH = 8;
export const GRID_HEIGHT = 4;

export const COMMANDS = {
  // create_robot_instance: 'robot = Robot.new()',
  turn_on_robot: 'robot:encender()',
  turn_off_robot: 'robot:apagar()',

  move_right: 'robot:moverDerecha()',
  move_left: 'robot:moverIzquierda()',
  move_up: 'robot:moverArriba()',
  move_down: 'robot:moverAbajo()',

  jump_right: 'robot:saltarDerecha()',
  jump_left: 'robot:saltarIzquierda()',
  jump_up: 'robot:saltarArriba()',
  jump_down: 'robot:saltarAbajo()',

  collect_item: 'robot:recolectar()',
  variable_assign: 'veces = 3',
  for_loop: 'for i=1,veces do',
  end_loop: 'end',
  hayObstaculo: 'robot:hayObstaculo()',
  if_statement: 'if robot:hayObstaculo() then',
  else_statement: 'else',
} as const;

export const COMMAND_CATEGORIES = {
  basico: {
    label: 'basic',
    color: 'green',
    commands: [
      // { command: COMMANDS.create_robot_instance, description: 'create_robot_instance' },
      { command: COMMANDS.turn_on_robot, description: 'turn_on_robot' },
      { command: COMMANDS.turn_off_robot, description: 'turn_off_robot' },
    ]
  },
  movimiento: {
    label: 'movement',
    color: 'cyan',
    commands: [
      { command: COMMANDS.move_right, description: 'move_right' },
      { command: COMMANDS.move_left, description: 'move_left' },
      { command: COMMANDS.move_up, description: 'move_up' },
      { command: COMMANDS.move_down, description: 'move_down' },
      { command: COMMANDS.jump_right, description: 'jump_right' },
      { command: COMMANDS.jump_left, description: 'jump_left' },
      { command: COMMANDS.jump_up, description: 'jump_up' },
      { command: COMMANDS.jump_down, description: 'jump_down' },
    ]
  },
  acciones: {
    label: 'actions',
    color: 'yellow',
    commands: [
      { command: COMMANDS.collect_item, description: 'collect_item' },
    ]
  },
  control: {
    label: 'control',
    color: 'purple',
    commands: [
      { command: COMMANDS.variable_assign, description: 'set_variable', type: 'variable' },
      { command: COMMANDS.for_loop, description: 'repeat_command', type: 'loop' },
      { command: COMMANDS.end_loop, description: 'end_loop' },
    ]
  },
  // condicionales: {
  //   label: 'Condicionales',
  //   color: 'orange',
  //   commands: [
  //     { command: COMMANDS.hayObstaculo, description: 'Verifica si hay un obstáculo adelante' },
  //     { command: COMMANDS.if_statement, description: 'Inicio de bloque if' },
  //     { command: COMMANDS.else_statement, description: 'Bloque alternativo' },
  //     { command: COMMANDS.end_loop, description: 'Fin del bloque if' },
  //   ]
  // },
} as const;

export const INITIAL_CODE = `
-- Area de codigo para programar el robot
robot = Robot.new()

robot:encender()
robot:moverArriba()

-- Definir variable para el número de repeticiones
veces = 3

-- Ejemplo de bucle for con variable: moverse 'veces' veces a la izquierda
for i=1,veces do
  robot:moverIzquierda()
end

robot:saltarAbajo()
`;

