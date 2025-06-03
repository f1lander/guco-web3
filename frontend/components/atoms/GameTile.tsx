import { useState, useEffect } from "react";
import { TileType, getEmoji, RobotState } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TILE_OPTIONS = [
  { value: TileType.EMPTY, label: "Empty", emoji: getEmoji(TileType.EMPTY) },
  {
    value: TileType.OBSTACLE,
    label: "Obstacle",
    emoji: getEmoji(TileType.OBSTACLE),
  },
  { value: TileType.GOAL, label: "Goal", emoji: getEmoji(TileType.GOAL) },
  { value: TileType.ROBOT, label: "Robot", emoji: getEmoji(TileType.ROBOT) },
  {
    value: TileType.COLLECTIBLE,
    label: "Collectible",
    emoji: getEmoji(TileType.COLLECTIBLE),
  },
];

interface GameTileProps {
  type: TileType;
  onClick: (value: TileType) => void;
  editable: boolean;
  className?: string;
  robotState?: RobotState;
  isColliding?: boolean;
}

export const GameTile = ({
  type,
  onClick,
  editable,
  className,
  robotState,
  isColliding = false,
}: GameTileProps) => {
  // Animation states for collision sequence
  const [animationStage, setAnimationStage] = useState(0);
  const [showRobot, setShowRobot] = useState(true);
  const [showExplosion, setShowExplosion] = useState(false);

  const handleClick = (value: string) => {
    if (editable) {
      onClick(Number(value) as TileType);
    }
  };

  // Manage collision animation sequence
  useEffect(() => {
    if (isColliding && type === TileType.ROBOT) {
      // Reset animation state
      setAnimationStage(1);
      setShowRobot(true);
      setShowExplosion(false);

      // Stage 1: Buzzing animation (robot is red and shaking)
      const timer1 = setTimeout(() => {
        // Stage 2: Show explosion, hide robot
        setAnimationStage(2);
        setShowRobot(false);
        setShowExplosion(true);
      }, 1200);

      // Stage 3: Larger explosion
      const timer2 = setTimeout(() => {
        setAnimationStage(3);
      }, 1800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (!isColliding) {
      // Reset animation state when not colliding
      setAnimationStage(0);
      setShowRobot(true);
      setShowExplosion(false);
    }
  }, [isColliding, type]);

  // Determine robot style based on state and animation stage
  const getRobotClass = () => {
    if (type !== TileType.ROBOT) return "";

    if (robotState?.state === "error" || animationStage === 1) {
      return "animate-buzz text-red-500 brightness-110";
    } else if (robotState?.state === "off") {
      return "grayscale";
    }

    return "";
  };

  // Handle explosion animation classes
  const getExplosionClass = () => {
    if (!showExplosion) return "hidden";

    return animationStage === 3
      ? "text-4xl md:text-5xl animate-pulse text-orange-500"
      : "text-3xl md:text-4xl text-yellow-500";
  };

  return (
    <div
      className={`relative bg-slate-700/50 border border-slate-600/30 min-h-[2rem] md:min-h-[3rem] flex items-center justify-center hover:border-blue-500/50 transition-colors ${className}`}
    >
      {editable ? (
        <Select value={type.toString()} onValueChange={handleClick}>
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
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Show robot if not in explosion phase */}
          {(showRobot || !isColliding) && (
            <span
              className={`text-2xl md:text-3xl transition-all duration-300 ${getRobotClass()}`}
            >
              {getEmoji(type)}
            </span>
          )}

          {/* Show explosion animation during collision sequence */}
          {type === TileType.ROBOT && isColliding && (
            <span
              className={`absolute z-10 transition-all duration-300 ${getExplosionClass()}`}
            >
              💥
            </span>
          )}
        </div>
      )}
    </div>
  );
};
