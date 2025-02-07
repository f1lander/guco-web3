import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'command';
  color?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

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
    "shadow-[0_7px_0_0_hsl(210deg_87%_36%)]",
    "hover:shadow-[0_7px_0_0_hsl(210deg_87%_36%)]",
    "active:shadow-none active:translate-y-[7px]",
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