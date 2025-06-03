"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function GameInput({
  className,
  onClear,
  value,
  onChange,
  ...props
}: GameInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl transition-all duration-200",
          "bg-emerald-400 border-2 border-emerald-600",
          "shadow-[inset_0_-4px_0_0_#059669]",
          isFocused && "shadow-[inset_0_-2px_0_0_#059669] translate-y-[2px]",
        )}
      />

      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-emerald-700" />

        <input
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-transparent px-12 py-3 outline-none",
            "text-emerald-900 placeholder:text-emerald-700/70",
            "font-medium",
          )}
        />

        {value && (
          <button
            onClick={onClear}
            className="absolute right-4 p-1 rounded-full 
              hover:bg-emerald-500/50 transition-colors"
          >
            <X className="w-4 h-4 text-emerald-700" />
          </button>
        )}
      </div>
    </div>
  );
}
