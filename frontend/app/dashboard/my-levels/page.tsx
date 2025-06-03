"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getPlayerCreatedLevels } from "@/lib/blockchain/contract-functions";

import type { Level } from "@/lib/types";
import { LevelCard } from "@/components/molecules/LevelCard";
import { ProfileHeader } from "@/components/organisms/ProfileHeader";
import { GameInput } from "@/components/molecules/GameInput";
import { GameFilter } from "@/components/molecules/GameFilter";
import { LevelCardSkeleton } from "@/components/molecules/LevelCardSkeleton";
import { ProfileHeaderSkeleton } from "@/components/molecules/ProfileHeaderSkeleton";
import { useTranslation } from "@/providers/language-provider";
import { getDifficulty } from "@/lib/utils";

export default function MyLevels() {
  const { address, isConnecting } = useAccount();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "completion">("newest");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLevels = async () => {
      if (!address) return;

      try {
        setLoading(true);
        const playerLevels = await getPlayerCreatedLevels(address);
        setLevels(playerLevels);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [address]);

  const filteredLevels = levels.filter((level) =>
    level.levelData.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedAndFilteredLevels = filteredLevels
    .filter((level) =>
      difficulty === "all" ? true : getDifficulty(level) === difficulty,
    )
    .sort((a, b) => {
      if (sortBy === "completion") {
        return Number(b.completions) - Number(a.completions);
      }
      return 0; // For now, newest first is default
    });

  const stats = {
    levelsCreated: levels.length,
    totalPlays: levels.reduce((acc, level) => acc + Number(level.playCount), 0),
    completionRate:
      levels.length > 0
        ? Math.round(
            levels.reduce(
              (acc, level) =>
                acc +
                (Number(level.completions) * 100) / Number(level.playCount),
              0,
            ) / levels.length,
          )
        : 0,
    badges: 0, // This will be implemented later
  };

  if (isConnecting) {
    return (
      <div className="flex flex-col gap-20 mt-8">
        <ProfileHeaderSkeleton />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <LevelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">{t("myLevels.title")}</h1>
        <p className="text-gray-500">{t("myLevels.connectWallet")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-20 mt-8">
        <ProfileHeaderSkeleton />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <LevelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 mt-8 mx-8">
      {address && <ProfileHeader address={address} stats={stats} />}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">{t("myLevels.title")}</h2>
          <GameFilter
            onDifficultyChange={setDifficulty}
            onSortChange={setSortBy}
          />
        </div>
        <div className="w-full max-w-md">
          <GameInput
            placeholder={t("myLevels.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {sortedAndFilteredLevels.length === 0 ? (
        <p className="text-center text-gray-500">
          {levels.length === 0
            ? t("myLevels.noLevelsCreated")
            : t("myLevels.noLevelsMatch")}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredLevels.map((level, index) => (
            <LevelCard
              key={`${level.creator}-${index}`}
              level={level}
              index={index}
              color={
                index % 3 === 0 ? "yellow" : index % 3 === 1 ? "purple" : "blue"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
