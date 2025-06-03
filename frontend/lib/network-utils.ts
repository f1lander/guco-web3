import { guco_devnet } from "./rainbow-config";

export const GUCO_DEVNET_PARAMS = {
  chainId: `0x${guco_devnet.id.toString(16)}`, // Convert to hex
  chainName: guco_devnet.name,
  nativeCurrency: guco_devnet.nativeCurrency,
  rpcUrls: guco_devnet.rpcUrls.default.http,
};

export const addDevnetToWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GUCO_DEVNET_PARAMS.chainId }],
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [GUCO_DEVNET_PARAMS],
        });
      } catch (addError) {
        throw new Error("Failed to add GUCO Devnet to wallet");
      }
    } else {
      throw new Error("Failed to switch to GUCO Devnet");
    }
  }
};

export const switchToDevnet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GUCO_DEVNET_PARAMS.chainId }],
    });
  } catch (error) {
    // If network doesn't exist, add it first
    await addDevnetToWallet();
  }
};
