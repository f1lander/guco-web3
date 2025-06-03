import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle = ({ children, className = "" }: SectionTitleProps) => {
  return (
    <h2 className={`text-3xl font-bold mb-6 md:text-4xl ${className}`}>
      {children}
    </h2>
  );
};

export default SectionTitle;
