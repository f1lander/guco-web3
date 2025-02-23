import { useState } from "react";
import { TileType, getEmoji, RobotState } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TILE_OPTIONS = [
  { value: TileType.EMPTY, label: 'Empty', emoji: getEmoji(TileType.EMPTY) },
  { value: TileType.OBSTACLE, label: 'Obstacle', emoji: getEmoji(TileType.OBSTACLE) },
  { value: TileType.GOAL, label: 'Goal', emoji: getEmoji(TileType.GOAL) },
  { value: TileType.ROBOT, label: 'Robot', emoji: getEmoji(TileType.ROBOT) },
  { value: TileType.COLLECTIBLE, label: 'Collectible', emoji: getEmoji(TileType.COLLECTIBLE) },
];

interface GameTileProps {
  type: TileType;
  onClick: (value: TileType) => void;
  editable: boolean;
  className?: string;
  robotState?: RobotState;
} 

export const GameTile = ({ type, onClick, editable, className, robotState }: GameTileProps) => {

  const handleClick = (value: string) => {
    if (editable) {
      onClick(Number(value) as TileType);
    }
  };

  // console.log(robotState);

  return <div className={`relative bg-slate-700/50 border border-slate-600/30 min-h-[2rem] md:min-h-[3rem] flex items-center justify-center hover:border-blue-500/50 transition-colors ${className}`}>
    {
      editable ? (
        <Select
          value={type.toString()}
          onValueChange={handleClick}
        >
          <SelectTrigger className="h-full w-full border-0 bg-transparent flex items-center justify-center data-[placeholder]:text-2xl md:data-[placeholder]:text-3xl [&>svg]:hidden">
            <SelectValue>
              <span className="text-2xl md:text-3xl">{getEmoji(type)}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TILE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm">{option.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
        : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl md:text-3xl ${robotState?.state === 'off' && type === TileType.ROBOT && 'grayscale'}`}>{getEmoji(type)}</span>
          </div>
        )
    }
  </div>
}