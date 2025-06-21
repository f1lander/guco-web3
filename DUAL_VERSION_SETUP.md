# Guco Game - Dual Version Setup (Web3 + REST API)

This project supports two versions of the game:
1. **Web3 Version**: Uses smart contracts and wallet connections
2. **REST API Version**: Uses Supabase database with traditional authentication

## Table of Contents

- [Overview](#overview)
- [Web3 Version Setup](#web3-version-setup)
- [REST API Version Setup](#rest-api-version-setup)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Development](#development)
- [Architecture](#architecture)

## Overview

The game allows users to:
- Browse and play levels without authentication (both versions)
- Create levels (requires wallet connection in Web3 or account registration in REST)
- Complete levels and track progress (requires wallet connection in Web3 or login in REST)

### Key Differences

| Feature | Web3 Version | REST API Version |
|---------|--------------|------------------|
| Authentication | Wallet connection | Username/password |
| Data Storage | Blockchain (smart contract) | Supabase database |
| Level Creation | Transaction + gas fees | Free with account |
| Level Completion | Transaction + gas fees | Free with account |
| Anonymity | Pseudo-anonymous (wallet address) | Username-based |
| Persistence | Permanent on blockchain | Database-dependent |

## Web3 Version Setup

### Prerequisites

1. Deployed smart contract (already available in `contracts/` folder)
2. RPC endpoint (Infura, Alchemy, or custom)
3. Contract address on target network

### Environment Variables

```bash
# Enable Web3 mode
NEXT_PUBLIC_WEB3_ENABLED=true

# Blockchain configuration
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_GUCO_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### Setup Steps

1. **Deploy Smart Contract** (if not already deployed):
   ```bash
   cd contracts
   forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

2. **Update Contract Address**:
   - Copy the deployed contract address
   - Update `NEXT_PUBLIC_GUCO_CONTRACT_ADDRESS` in your `.env`

3. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

### Usage

1. **Browse Levels**: Anyone can view and play levels
2. **Connect Wallet**: Required for creating levels and saving progress
3. **Create Levels**: Costs gas fees, permanently stored on blockchain
4. **Complete Levels**: Costs gas fees, progress saved on blockchain

## REST API Version Setup

### Prerequisites

1. Supabase account and project
2. Database setup with provided schema

### Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the URL and anon key

2. **Setup Database**:
   - Go to SQL Editor in Supabase dashboard
   - Run the schema from `frontend/lib/supabase/schema.sql`

3. **Configure Authentication**:
   - Go to Authentication settings
   - Enable email authentication
   - Disable email confirmations for development (optional)

### Environment Variables

```bash
# Enable REST mode
NEXT_PUBLIC_WEB3_ENABLED=false

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Setup Steps

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env.local`
   - Update with your Supabase credentials

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

### Usage

1. **Browse Levels**: Anyone can view and play levels
2. **Create Account**: Username/password registration
3. **Login**: Access account and saved progress
4. **Create Levels**: Free with account, stored in database
5. **Complete Levels**: Free with account, progress saved in database

## Environment Configuration

### Switching Between Versions

The version is controlled by the `NEXT_PUBLIC_WEB3_ENABLED` environment variable:

```bash
# Web3 version
NEXT_PUBLIC_WEB3_ENABLED=true

# REST API version
NEXT_PUBLIC_WEB3_ENABLED=false
```

### Complete Environment Files

#### Web3 Version (.env.web3)
```bash
NEXT_PUBLIC_WEB3_ENABLED=true
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_GUCO_CONTRACT_ADDRESS=0xYourContractAddress
```

#### REST Version (.env.rest)
```bash
NEXT_PUBLIC_WEB3_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

### GitHub Pages Deployment

You can deploy both versions to different subdomains or paths:

1. **Web3 Version**:
   ```bash
   # Set environment for build
   cp .env.web3 .env.local
   npm run build
   npm run export  # For static export
   ```

2. **REST Version**:
   ```bash
   # Set environment for build
   cp .env.rest .env.local
   npm run build
   npm run export  # For static export
   ```

### Deployment Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build:web3": "cp .env.web3 .env.local && next build",
    "build:rest": "cp .env.rest .env.local && next build",
    "deploy:web3": "npm run build:web3 && gh-pages -d out -b gh-pages-web3",
    "deploy:rest": "npm run build:rest && gh-pages -d out -b gh-pages-rest"
  }
}
```

## Development

### Running Both Versions Locally

1. **Web3 Version**:
   ```bash
   cp .env.web3 .env.local
   npm run dev
   ```

2. **REST Version** (different terminal):
   ```bash
   cp .env.rest .env.local
   PORT=3001 npm run dev
   ```

### Testing

Both versions share the same core game logic, but have different data persistence:

```bash
# Test both versions
npm test

# Test specific components
npm test -- --testPathPattern=web3
npm test -- --testPathPattern=rest
```

## Architecture

### Service Layer

The system uses a service layer pattern with the following structure:

```
lib/services/
├── factory.ts          # Service factory based on environment
├── types.ts           # Common interfaces
├── web3-service.ts    # Web3 implementation
└── rest-service.ts    # REST API implementation
```

### Component Structure

```
components/
├── molecules/
│   ├── UnifiedConnectButton.tsx  # Handles both wallet & auth
│   ├── AuthModal.tsx            # Login/register for REST
│   └── CustomConnectButton.tsx  # Wallet connection for Web3
└── hooks/
    ├── useGameService.ts         # Unified game operations hook
    └── useGucoLevels.ts         # Legacy Web3 hook (deprecated)
```

### Data Flow

1. **Component** → calls `useGameService()`
2. **Hook** → calls `gameService` from factory
3. **Factory** → returns Web3Service or RestService based on env
4. **Service** → handles actual data operations

This ensures components work identically regardless of the backend implementation.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Ensure variables start with `NEXT_PUBLIC_`
   - Restart development server after changes

2. **Supabase Connection Errors**:
   - Verify URL and keys are correct
   - Check database schema is properly applied

3. **Web3 Connection Issues**:
   - Verify contract address is correct
   - Ensure RPC endpoint is accessible
   - Check network configuration

4. **Build Errors**:
   - Make sure all required environment variables are set
   - Check for missing dependencies

### Getting Help

- Check the console for detailed error messages
- Verify environment configuration
- Ensure all dependencies are installed
- Check network connectivity for external services

## Future Enhancements

- [ ] Hybrid mode that can sync between both versions
- [ ] Migration tools to move data between versions
- [ ] Enhanced analytics and metrics
- [ ] Social features and leaderboards
- [ ] Level verification system
- [ ] Tournament and competition modes