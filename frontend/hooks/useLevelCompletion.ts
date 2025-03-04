import { useState, useEffect } from 'react';

/**
 * Custom hook to handle level completion dialog
 * @param levelCompleted Whether the level has been completed
 * @returns Object containing dialog state and control functions
 */
export const useLevelCompletion = (levelCompleted: boolean) => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // If level was completed, show success dialog after a short delay
    if (levelCompleted) {
      timeoutId = setTimeout(() => {
        setShowSuccessDialog(true);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [levelCompleted]);

  return { 
    showSuccessDialog, 
    setShowSuccessDialog
  };
}; 