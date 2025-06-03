"use client";

import { useState, useEffect } from "react";
import { useGucoLevels } from "@/hooks/useGucoLevels";
import { LevelCard } from "@/components/molecules/LevelCard";
import { useTranslation } from "@/providers/language-provider";
import { GameInput } from "@/components/molecules/GameInput";
import { LevelCardSkeleton } from "@/components/molecules/LevelCardSkeleton";
import { GameFilter } from "@/components/molecules/GameFilter";
import { Level } from "@/lib/types";

export default function LevelsExplorer() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 20;
  const { t } = useTranslation();
  const { getLevels, getLevelCount } = useGucoLevels();
  const [levels, setLevels] = useState<Level[]>([]);
  const [totalLevels, setTotalLevels] = useState(0);
  const [difficulty, setDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "completion">("newest");

  const loadLevels = async () => {
    try {
      setLoading(true);
      const count = await getLevelCount();
      setTotalLevels(count);
      const data = await getLevels(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
      setLevels(data);
    } catch (error) {
      console.error("Error loading levels:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Total levels:", totalLevels);

  useEffect(() => {
    loadLevels();
  }, [page]);

  if (loading) {
    return (
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold">
              {t("dashboard.exploreLevels")}
            </h2>
            <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="w-full max-w-md">
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <LevelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">{t("dashboard.exploreLevels")}</h2>
          <GameFilter
            onDifficultyChange={setDifficulty}
            onSortChange={setSortBy}
          />
        </div>
        <div className="w-full max-w-md">
          <GameInput
            placeholder={t("dashboard.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {levels.map((level, index) => (
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
    </div>
  );
}
