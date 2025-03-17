import { gucoAbi } from "@/lib/blockchain/abis/guco.abi";
import { GUCO_CONTRACT_ADDRESSES } from "@/lib/constants";
import { useWriteContract, useAccount } from "wagmi";
import { levelToBytes32 } from "@/lib/utils";

import { getLevels, getLevelCount, getLevel, isLevelCompleted, getPlayer } from "@/lib/blockchain/contract-functions";

type Level = {
  levelData: `0x${string}`,
  creator: `0x${string}`,
  playCount: bigint,
  completions: bigint,
  verified: boolean,
  createdAt: bigint
}

export const useGucoLevels = () => {

  const { address } = useAccount();

  const {
    writeContract: createGucoLevelWriteContract,
    isPending: isPendingCreate,
    isSuccess: isSuccessCreate,
    isError: isErrorCreate,
    data: dataCreate,
    
  } = useWriteContract();

  const {
    writeContract: completeGucoLevelWriteContract,
    isPending: isPendingComplete,
    isSuccess: isSuccessComplete,
    isError: isErrorComplete,
    data: dataComplete
  } = useWriteContract();

  const {
    writeContract: updatePlayerWriteContract,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    data: dataUpdate
  } = useWriteContract();


  // Write Functions
  const createGucoLevel = async (level: number[]) => {
    const bytes32Data = levelToBytes32(level);

    const tx = await createGucoLevelWriteContract({
      address: GUCO_CONTRACT_ADDRESSES,
      abi: gucoAbi,
      functionName: "createLevel",
      args: [bytes32Data],
    });

    return tx;
  };

  const updatePlayer = async (
    levelId: number,
    levelCompleted: Level
  ) => {
    if (!address) {
      throw new Error("No address found");
    }
    const tx = await updatePlayerWriteContract({
      address: GUCO_CONTRACT_ADDRESSES,
      abi: gucoAbi,
      functionName: "updatePlayer",
      args: [
        address,
        BigInt(levelId),
        levelCompleted
      ],
    });
    return tx;
  };

  // Read Functions
  const _isLevelCompleted = async (levelId: number) => {
    if (!address) {
      return false;
    }
    return isLevelCompleted(address, levelId);
  };

  return {
    // Write functions
    updatePlayer,
    isPendingUpdate,
    isSuccessUpdate,
    isErrorUpdate,
    dataUpdate,
    
    createGucoLevel,
    isPendingCreate,
    isSuccessCreate,
    isErrorCreate,
    isPendingComplete,
    isSuccessComplete,
    isErrorComplete,
    
    dataCreate,
    dataComplete,
    // Read functions
    getLevelCount,
    getLevel,
    getLevels,
    isLevelCompleted: _isLevelCompleted,
    getPlayer,
  };
};


