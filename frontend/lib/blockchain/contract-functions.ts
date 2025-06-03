import client from "./client";
import { getAccount, writeContract, waitForTransaction } from "@wagmi/core";
import { gucoAbi } from "./abis/guco.abi";
import { GUCO_CONTRACT_ADDRESSES } from "@/lib/constants";
import { Level } from "../types";

export const getLevels = async (
  offset: number,
  limit: number,
): Promise<Level[]> => {
  try {
    console.log("Fetching levels with params:", { offset, limit });
    const data = await client.readContract({
      address: GUCO_CONTRACT_ADDRESSES,
      abi: gucoAbi,
      functionName: "getLevelsWithId",
      args: [BigInt(offset), BigInt(limit)],
    });
    // Convert the timestamp to a Date object
    const formattedLevels = data.map((level) => ({
      ...level.level,
      id: Number(level.id),
      createdAt: new Date(Number(level.level.createdAt) * 1000), // Convert from Unix timestamp to JS Date
    }));

    console.log("Formatted levels:", formattedLevels);
    return formattedLevels;
  } catch (error) {
    console.log("No levels found or contract not initialized");
    return [];
  }
};

export const getLevelCount = async () => {
  const count = await client.readContract({
    address: GUCO_CONTRACT_ADDRESSES,
    abi: gucoAbi,
    functionName: "getLevelCount",
  });

  return Number(count);
};

export const getLevel = async (levelId: number) => {
  const level = await client.readContract({
    address: GUCO_CONTRACT_ADDRESSES,
    abi: gucoAbi,
    functionName: "getLevel",
    args: [BigInt(levelId)],
  });

  return level;
};

export const getPlayer = async (playerAddress: `0x${string}`) => {
  const player = await client.readContract({
    address: GUCO_CONTRACT_ADDRESSES,
    abi: gucoAbi,
    functionName: "getPlayer",
    args: [playerAddress],
  });

  return player;
};

export const isLevelCompleted = async (
  playerAddress: `0x${string}`,
  levelId: number,
) => {
  const data = await client.readContract({
    address: GUCO_CONTRACT_ADDRESSES,
    abi: gucoAbi,
    functionName: "isLevelCompleted",
    args: [playerAddress, BigInt(levelId)],
  });
  return data;
};

export const getPlayerCreatedLevels = async (playerAddress: `0x${string}`) => {
  try {
    const levelCount = await getLevelCount();
    const allLevels = await getLevels(0, levelCount);

    // Filter levels where the creator matches the player address
    return allLevels.filter(
      (level) => level.creator.toLowerCase() === playerAddress.toLowerCase(),
    );
  } catch (error) {
    console.error("Error fetching player created levels:", error);
    return [];
  }
};
