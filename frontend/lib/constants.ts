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
  create_robot_instance: 'robot = Robot.new()',
  turn_on_robot: 'encender()',
  turn_off_robot: 'apagar()',

  move_right: 'moverDerecha()',
  move_left: 'moverIzquierda()',
  move_up: 'moverArriba()',
  move_down: 'moverAbajo()',

  jump_right: 'saltarDerecha()',
  jump_left: 'saltarIzquierda()',
  jump_up: 'saltarArriba()',
  jump_down: 'saltarAbajo()'
  ,
  collect_item: 'recolectar()',

} as const;

export const COMMAND_CATEGORIES = {
  basico: {
    label: 'basic',
    color: 'green',
    commands: [
      { command: COMMANDS.create_robot_instance, description: 'create_robot_instance' },
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
} as const;

export const INITIAL_CODE = `
-- Area de codigo para programar el robot
robot = Robot.new()

robot:encender()
robot:moverArriba()
robot:moverIzquierda()
robot:moverIzquierda()
robot:moverIzquierda()
robot:saltarAbajo()

-- class definition
--------------------------------    
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------
--------------------------------


-- Robot class
Robot = {}
Robot.__index = Robot

function Robot.new()
    local self = setmetatable({}, Robot)
    self.x = 0
    self.y = 0
    self.stars = 0
    return self
end

function Robot:moverDerecha()
    self.x = self.x + 1
end

function Robot:moverIzquierda()
    self.x = self.x - 1
end

function Robot:moverArriba()
    self.y = self.y - 1
end

function Robot:moverAbajo()
    self.y = self.y + 1
end

function Robot:recolectar()
    self.stars = self.stars + 1
end

function Robot:encender()
    self.state = 'on'
end

function Robot:apagar()
    self.state = 'off'
end
`;

