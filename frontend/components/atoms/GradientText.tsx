"use client";

import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText = ({ children, className = "" }: GradientTextProps) => {
  return (
    <span
      className={`bg-gradient-to-r from-primary to-guco-600 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;
