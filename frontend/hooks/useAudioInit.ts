import { useState, useEffect } from "react";
import { initAudio, stopBackgroundMusic } from "@/lib/sounds";

/**
 * Custom hook to handle audio initialization
 * @returns Object containing audioInitialized state
 */
export const useAudioInit = () => {
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!audioInitialized) {
        try {
          await initAudio();
          setAudioInitialized(true);
          document.removeEventListener("click", handleUserInteraction);
        } catch (error) {
          console.error("Failed to initialize audio:", error);
        }
      }
    };

    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      stopBackgroundMusic();
    };
  }, [audioInitialized]);

  return { audioInitialized };
};
