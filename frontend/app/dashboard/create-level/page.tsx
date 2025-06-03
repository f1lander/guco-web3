"use client";

import { useState } from "react";
import { useGucoLevels } from "@/hooks/useGucoLevels";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GameView from "@/components/molecules/GameView";
import { useTranslation } from "@/providers/language-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_LEVEL } from "@/lib/constants";
import { Difficulty, generateRandomLevel } from "@/lib/utils";
import { useAccount } from "wagmi";

export default function CreateLevel() {
  const { address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [generatedLevel, setGeneratedLevel] = useState<number[] | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const {
    createGucoLevel,
    isPendingCreate,
    isSuccessCreate,
    isErrorCreate,
    dataCreate,
  } = useGucoLevels();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleGenerateLevel = () => {
    setIsGenerating(true);
    try {
      const newLevel = generateRandomLevel(difficulty);
      setGeneratedLevel(newLevel);
    } catch (error) {
      console.error("Error generating level:", error);
      toast({
        title: t("createLevel.error"),
        description: t("createLevel.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitLevel = async () => {
    if (!generatedLevel) return;

    try {
      setTxHash(null);

      // Show pending toast
      toast({
        title: t("createLevel.pendingCreate"),
        description: t("createLevel.waitForConfirmation"),
      });

      // Submit transaction
      await createGucoLevel(generatedLevel);

      // Use the transaction hash from dataCreate if available, otherwise from tx
      if (dataCreate) {
        setTxHash(dataCreate);
      }

      // Show processing toast while waiting for confirmation
      if (isPendingCreate) {
        toast({
          title: t("createLevel.processing"),
          description: t("createLevel.transactionSubmitted"),
        });
      }

      // Show success toast with transaction hash
      if (isSuccessCreate && dataCreate) {
        toast({
          title: t("createLevel.successCreate"),
          description: (
            <div className="mt-2 flex flex-col gap-2">
              <p>{t("createLevel.successDesc")}</p>
              <p className="text-sm text-slate-500 break-all">
                Transaction:{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${dataCreate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-400"
                >
                  {dataCreate}
                </a>
              </p>
            </div>
          ),
          duration: 10000,
        });

        // Log transaction data
        console.log("Transaction data:", {
          hash: dataCreate,
        });

        setGeneratedLevel(null); // Reset after successful submission
      }

      if (isErrorCreate) {
        throw new Error(t("createLevel.errorCreate"));
      }
    } catch (error) {
      console.error("Error submitting level:", error);
      toast({
        title: t("createLevel.error"),
        description:
          error instanceof Error ? error.message : t("createLevel.errorDesc"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-3xl font-bold">{t("createLevel.title")}</h1>

      <div className="flex flex-col items-center gap-4 w-full">
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as Difficulty)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("createLevel.difficulty.label")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Difficulty.BEGINNER}>
              {t("createLevel.difficulty.beginner")}
            </SelectItem>
            <SelectItem value={Difficulty.INTERMEDIATE}>
              {t("createLevel.difficulty.intermediate")}
            </SelectItem>
            <SelectItem value={Difficulty.ADVANCED}>
              {t("createLevel.difficulty.advanced")}
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-4">
          <Button
            onClick={handleGenerateLevel}
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating
              ? t("createLevel.generating")
              : t("createLevel.generate")}
          </Button>

          {generatedLevel && address && (
            <Button
              onClick={handleSubmitLevel}
              disabled={isPendingCreate}
              className="min-w-[200px]"
              variant="secondary"
            >
              {isPendingCreate
                ? t("createLevel.pendingCreate")
                : t("createLevel.submit")}
            </Button>
          )}
        </div>

        {txHash && (
          <div className="text-sm text-slate-500">
            <p>{t("createLevel.transactionPending")}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400"
            >
              {t("createLevel.viewOnExplorer")}
            </a>
          </div>
        )}

        <p className="text-sm text-gray-500">{t("createLevel.description")}</p>

        <div className="max-w-xl w-full md:max-w-full aspect-video">
          <h2 className="text-xl font-semibold mb-4">
            {t("createLevel.preview")}
          </h2>
          <GameView
            editable={true}
            level={generatedLevel || DEFAULT_LEVEL}
            onLevelChange={(newLevel) => setGeneratedLevel(newLevel)}
            showControls={false}
          />
        </div>
      </div>
    </div>
  );
}
