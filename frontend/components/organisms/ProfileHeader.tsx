"use client";

import { StatsWidget } from "../molecules/StatsWidget";
import { useTranslation } from "@/providers/language-provider";

interface ProfileHeaderProps {
  address: `0x${string}`;
  stats: {
    levelsCreated: number;
    totalPlays: number;
    completionRate: number;
    badges: number;
  };
}

export function ProfileHeader({ address, stats }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div className="text-start">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
          {t("profile.greeting")} {address.slice(0, 6)}...{address.slice(-4)}!
        </h1>
        <p className="text-gray-400 mt-2">{t("profile.welcome")}</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          title={t("profile.stats.levelsCreated")}
          value={stats.levelsCreated}
          icon="gamepad"
          color="yellow"
        />
        <StatsWidget
          title={t("profile.stats.totalPlays")}
          value={stats.totalPlays}
          icon="trophy"
          color="purple"
        />
        <StatsWidget
          title={t("profile.stats.completionRate")}
          value={`${isNaN(stats.completionRate) ? 0 : stats.completionRate}%`}
          icon="star"
          color="blue"
        />
        <StatsWidget
          title={t("profile.stats.badges")}
          value={stats.badges}
          icon="medal"
          color="yellow"
        />
      </div>
    </div>
  );
}
