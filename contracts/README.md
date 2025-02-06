# GUCO Game Smart Contracts

Smart contracts for the GUCO (Game Using Code) educational platform, where players can create, share, and complete coding challenges.


## Core Contracts

### GucoGame.sol
Main contract handling:
- Level creation and management
- Player progress tracking
- Achievement system
- Game state management

### IGucoGame.sol
Interface defining:
- Core data structures
- Events
- External function interfaces

## Development

### Prerequisites
- Foundry
- Node.js & bun

### Local Development
1. Install dependencies:
```bash
bun install

## Contract Structure
```
## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
