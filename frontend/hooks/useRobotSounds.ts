import { useEffect, useRef } from "react";
import { playRobotOnSound, playCollectSound } from "@/lib/sounds";

interface RobotState {
  collected: number;
  state: "on" | "off" | "error";
}

/**
 * Custom hook to handle robot sound effects
 * @param robotState Current robot state
 * @param audioInitialized Whether audio has been initialized
 * @returns void
 */
export const useRobotSounds = (
  robotState: RobotState,
  audioInitialized: boolean,
) => {
  const prevRobotStateRef = useRef<RobotState>({ collected: 0, state: "off" });

  useEffect(() => {
    if (!audioInitialized) return;

    // Play robot on/off sound
    if (prevRobotStateRef.current.state !== robotState.state) {
      if (robotState.state === "on") {
        playRobotOnSound();
      }
    }

    // Play collect sound
    if (robotState.collected > prevRobotStateRef.current.collected) {
      playCollectSound();
    }

    prevRobotStateRef.current = robotState;
  }, [robotState, audioInitialized]);
};
