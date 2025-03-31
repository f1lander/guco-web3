// use screen size hook
'use client';
import { useState, useEffect } from 'react';


const getEditorContainerHeight = (height: number, width: number) => {
  // For very short devices
  if (width < 480) {
    if (height < 600) {
      return 200; // Return pixel value instead of Tailwind class
    }
    // For medium-height phones
    else if (height < 750) {
      return 270;
    }
    // For taller phones like iPhone 14 (932px)
    else if (height < 1000 ) {
      return 450;
    }
    // For tablets and small laptops
    else if (height < 1200) {
      return 550;
    }
  }
  // For larger screens
  else {
    return 900;
  }
};

const getBlocklyContainerHeight = (height: number, width: number) => {
  // For very short devices
  if (width < 480) {
    if (height < 600) {
      return 200;
    }
    // For medium-height phones
    else if (height < 750) {
      return 270;
    }
    // For taller phones like iPhone 14 (932px)
    else if (height < 1000 ) {
      return 450;
    }
    // For tablets and small laptops
    else if (height < 1200) {
      return 550;
    }
  }
  // For larger screens
  else {
    return 500;
  }
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [screenCategory, setScreenCategory] = useState('md');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine screen category based on width
      if (width < 480) {
        setScreenCategory('xs'); // Extra small (most small phones)
      } else if (width < 768) {
        setScreenCategory('sm'); // Small (larger phones, small tablets)
      } else if (width < 992) {
        setScreenCategory('md'); // Medium (tablets)
      } else {
        setScreenCategory('lg'); // Large (desktops)
      }
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return numeric height values instead of classes
  const editorContainerHeight = getEditorContainerHeight(screenSize.height, screenSize.width);
  const blocklyContainerHeight = getBlocklyContainerHeight(screenSize.height, screenSize.width);
  
  return { 
    ...screenSize, 
    screenCategory, 
    editorContainerHeight, 
    blocklyContainerHeight 
  };
};

// Export the standalone function as well if needed
export { getEditorContainerHeight };
