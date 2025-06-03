"use client";

import { cn } from "@/lib/utils";
import { Trophy, Star, GamepadIcon, Medal } from "lucide-react";

const colorVariants = {
  yellow: {
    card: "bg-yellow-300 border-yellow-500",
    shadow: "shadow-[inset_0_-6px_0_0_#B45309]",
    activeShadow: "active:shadow-[inset_0_-3px_0_0_#B45309]",
    icon: "text-yellow-800 bg-yellow-200",
  },
  purple: {
    card: "bg-purple-300 border-purple-500",
    shadow: "shadow-[inset_0_-6px_0_0_#581C87]",
    activeShadow: "active:shadow-[inset_0_-3px_0_0_#581C87]",
    icon: "text-purple-800 bg-purple-200",
  },
  blue: {
    card: "bg-blue-300 border-blue-500",
    shadow: "shadow-[inset_0_-6px_0_0_#1E40AF]",
    activeShadow: "active:shadow-[inset_0_-3px_0_0_#1E40AF]",
    icon: "text-blue-800 bg-blue-200",
  },
} as const;

type ColorVariant = keyof typeof colorVariants;

interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon: "trophy" | "star" | "gamepad" | "medal";
  color?: ColorVariant;
}

const icons = {
  trophy: Trophy,
  star: Star,
  gamepad: GamepadIcon,
  medal: Medal,
};

export function StatsWidget({
  title,
  value,
  icon,
  color = "yellow",
}: StatsWidgetProps) {
  const Icon = icons[icon];
  const colors = colorVariants[color];

  return (
    <div
      className={cn(
        "relative p-4 transition-all duration-200",
        "rounded-lg border-2",
        colors.card,
        colors.shadow,
        "hover:brightness-105 hover:-translate-y-1",
        "flex items-center gap-3",
      )}
    >
      <div className={cn("p-3 rounded-full", colors.icon, "shadow-inner")}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
