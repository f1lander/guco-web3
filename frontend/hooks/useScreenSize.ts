// use screen size hook
import { useState, useEffect } from 'react';


const getEditorContainerHeight = (height: number, width: number) => {

  console.log(height);
  // For very short devices
  if (width < 480) {
    if (height < 600) {
      return 'h-[200px]';
    }
    // For medium-height phones
    else if (height < 750) {
      return 'h-[270px]';
    }
    // For taller phones like iPhone 14 (932px)
    else if (height < 1000 ) {
      return 'h-[450px]';
    }
    // For tablets and small laptops
    else if (height < 1200) {
      return 'h-[550px]';
    }
  }
  // For larger screens
  else {
    return 'h-[900px]';
  }
};

const getBlocklyContainerHeight = (height: number, width: number) => {
  console.log(height);
  // For very short devices
  if (width < 480) {
    if (height < 600) {
      return 'h-[200px]';
    }
    // For medium-height phones
    else if (height < 750) {
      return 'h-[270px]';
    }
    // For taller phones like iPhone 14 (932px)
    else if (height < 1000 ) {
      return 'h-[450px]';
    }
    // For tablets and small laptops
    else if (height < 1200) {
      return 'h-[550px]';
    }
  }
  // For larger screens
  else {
    return 'h-[500px]';
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

  // Add this to return the editor container height class along with other screen properties
  const editorContainerHeightClass = getEditorContainerHeight(screenSize.height, screenSize.width);
  const blocklyContainerHeightClass = getBlocklyContainerHeight(screenSize.height, screenSize.width);
  return { ...screenSize, screenCategory, editorContainerHeightClass, blocklyContainerHeightClass };
};

// Export the standalone function as well if needed
export { getEditorContainerHeight };
