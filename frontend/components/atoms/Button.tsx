import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'command';
  color?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const colorVariants = {
  blue: {
    shadow: "shadow-[0_7px_0_0_#1E40AF]", // blue-800
    activeShadow: "active:shadow-none"
  },
  yellow: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  purple: {
    shadow: "shadow-[0_7px_0_0_#581C87]", // purple-800
    activeShadow: "active:shadow-none"
  },
  orange: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  red: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  green: {
    shadow: "shadow-[0_7px_0_0_#16A34A]", // green-800
    activeShadow: "active:shadow-none"
  },
  pink: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  cyan: {
    shadow: "shadow-[0_7px_0_0_#1E40AF]", // blue-800
    activeShadow: "active:shadow-none"
  },
  brown: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  gray: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  black: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  },
  white: {
    shadow: "shadow-[0_7px_0_0_#B45309]", // yellow-800
    activeShadow: "active:shadow-none"
  }
} as const;

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  color = 'blue',
  icon: Icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = cn(
    "relative flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg",
    "transition-all duration-[31ms] cubic-bezier(.5, .7, .4, 1)",
    colorVariants[color as keyof typeof colorVariants]?.shadow,
    colorVariants[color as keyof typeof colorVariants]?.activeShadow,
    "active:translate-y-[7px]",
    "active:transition-[35ms]"
  );
  
  const variants = {
    default: cn(
      `bg-${color}-500 text-white`,
    ),
    command: cn(
      `flex-shrink-0 bg-${color}-500 text-white font-mono text-sm`
    )
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button; 