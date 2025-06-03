import { useState, useEffect } from "react";
import { TileType } from "@/lib/utils";

/**
 * Custom hook to initialize collectible positions and count from level data
 * @param initialLevelData The initial level data array
 * @returns Object containing collectible positions and total count
 */
export const useCollectiblesInit = (initialLevelData: number[]) => {
  const [collectiblePositions, setCollectiblePositions] = useState<number[]>(
    [],
  );
  const [totalCollectibles, setTotalCollectibles] = useState<number>(0);

  useEffect(() => {
    const collectibles = initialLevelData
      .map((tile, index) => (tile === TileType.COLLECTIBLE ? index : -1))
      .filter((index) => index !== -1);

    setCollectiblePositions(collectibles);
    setTotalCollectibles(collectibles.length);
  }, [initialLevelData]);

  return { collectiblePositions, setCollectiblePositions, totalCollectibles };
};
