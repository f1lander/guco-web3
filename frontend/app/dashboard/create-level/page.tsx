"use client";

import { useState, useEffect } from "react";
import { useGucoLevels } from "@/hooks/useGucoLevels";
import Button from "@/components/atoms/Button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LEVEL } from "@/lib/constants";
import { Difficulty, generateRandomLevel } from "@/lib/utils";
import { useAccount } from "wagmi";
import { Sparkles, Send, Eye, Zap } from "lucide-react";

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

  // Handle success state changes
  useEffect(() => {
    if (isSuccessCreate && dataCreate) {
      toast({
        title: "¡Nivel Creado Exitosamente! 🎉",
        description: (
          <div className="mt-2 flex flex-col gap-2">
            <p>Tu nivel ha sido publicado en la blockchain correctamente.</p>
            <p className="text-sm text-slate-400 break-all">
              Transacción:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${dataCreate}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-300 text-blue-400"
              >
                {dataCreate}
              </a>
            </p>
          </div>
        ),
        duration: 8000,
      });

      // Log transaction data
      console.log("Transaction successful:", {
        hash: dataCreate,
        timestamp: new Date().toISOString(),
      });

      // Reset form after successful submission
      setGeneratedLevel(null);
      setTxHash(null);
    }
  }, [isSuccessCreate, dataCreate, toast]);

  // Handle error state changes
  useEffect(() => {
    if (isErrorCreate) {
      toast({
        title: "Error al Crear Nivel ❌",
        description: "Hubo un problema al publicar tu nivel. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 6000,
      });
      setTxHash(null);
    }
  }, [isErrorCreate, toast]);

  const handleGenerateLevel = () => {
    setIsGenerating(true);
    try {
      const newLevel = generateRandomLevel(difficulty);
      setGeneratedLevel(newLevel);
    } catch (error) {
      console.error("Error generating level:", error);
      toast({
        title: "Error al Generar Nivel ❌",
        description: "Hubo un problema al generar el nivel. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitLevel = async () => {
    if (!generatedLevel) return;

    try {
      setTxHash(null);

      // Show initial toast
      toast({
        title: "Iniciando Transacción 🚀",
        description: "Por favor, confirma la transacción en tu wallet.",
        duration: 4000,
      });

      // Submit transaction
      await createGucoLevel(generatedLevel);
      
      // Show transaction submitted toast
      toast({
        title: "Transacción Enviada ⏳",
        description: "Tu nivel está siendo procesado en la blockchain...",
        duration: 5000,
      });

    } catch (error) {
      console.error("Error submitting level:", error);
      
      // Show error toast for transaction failures
      toast({
        title: "Error en la Transacción ❌",
        description: error instanceof Error ? error.message : "Error desconocido al enviar la transacción.",
        variant: "destructive",
        duration: 6000,
      });
      
      setTxHash(null);
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER:
        return "bg-green-900/50 text-green-300 border-green-600";
      case Difficulty.INTERMEDIATE:
        return "bg-yellow-900/50 text-yellow-300 border-yellow-600";
      case Difficulty.ADVANCED:
        return "bg-red-900/50 text-red-300 border-red-600";
      default:
        return "bg-gray-700/50 text-gray-300 border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Crear Nivel
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Diseña y publica tus propios niveles en la blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Creator Panel - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-lg border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Level Creator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Dificultad
                  </label>
                  <Select
                    value={difficulty}
                    onValueChange={(value) => setDifficulty(value as Difficulty)}
                  >
                    <SelectTrigger className="w-full border-2 border-gray-600 bg-gray-700 text-white focus:border-purple-400">
                      <SelectValue placeholder="Selecciona dificultad" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value={Difficulty.BEGINNER} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Principiante
                        </div>
                      </SelectItem>
                      <SelectItem value={Difficulty.INTERMEDIATE} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Intermedio
                        </div>
                      </SelectItem>
                      <SelectItem value={Difficulty.ADVANCED} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Avanzado
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateLevel}
                  disabled={isGenerating}
                  color="purple"
                  icon={Zap}
                  className="w-full"
                >
                  {isGenerating
                    ? "Generando..."
                    : "Generar Nivel"}
                </Button>

                {/* Submit to Blockchain Button */}
                {generatedLevel && address && (
                  <Button
                    onClick={handleSubmitLevel}
                    disabled={isPendingCreate}
                    color="blue"
                    icon={Send}
                    className="w-full"
                  >
                    {isPendingCreate
                      ? "Creando..."
                      : "Crear Nivel"}
                  </Button>
                )}

                {/* Transaction Status */}
                {txHash && (
                  <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-600">
                    <p className="text-sm font-medium text-blue-300 mb-2">
                      Transacción pendiente
                    </p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      Ver en explorador
                    </a>
                  </div>
                )}

                {/* Level Info */}
                {generatedLevel && (
                  <div className="p-4 bg-green-900/50 rounded-lg border border-green-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-300">
                        Nivel Generado
                      </span>
                    </div>
                    <p className="text-xs text-green-400">
                      Listo para crear en blockchain
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Preview - Main Area */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border-2 border-gray-600">
                  <GameView
                    editable={true}
                    level={generatedLevel || DEFAULT_LEVEL}
                    onLevelChange={(newLevel) => setGeneratedLevel(newLevel)}
                    showControls={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
