"use client";

import { http, createStorage, cookieStorage } from "wagmi";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WALLET_CONNECTION_PROJECT_ID, RPC_URL } from "@/lib/constants";

// Define the GUCO devnet chain
const guco_devnet = defineChain({
  id: 1337,
  name: "GUCO Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [RPC_URL || "https://geth.devnet.drosera.io"],
    },
  },
  testnet: true,
});

export const rainbowConfig = getDefaultConfig({
  appName: "Guco Web3",
  projectId: WALLET_CONNECTION_PROJECT_ID,
  chains: [guco_devnet], // Only support devnet
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [guco_devnet.id]: http(),
  },
});

// Export the devnet chain for use in other parts of the app
export { guco_devnet };
