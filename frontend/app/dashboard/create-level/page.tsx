"use client";

import { useState, useEffect } from "react";
import { useGameService } from "@/hooks/useGameService";
import Button from "@/components/atoms/Button";
import { useToast } from "@/components/ui/use-toast";
import GameView from "@/components/molecules/GameView";
import { useTranslation } from "@/providers/language-provider";
import { UnifiedConnectButton } from "@/components/molecules/UnifiedConnectButton";
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
import { Sparkles, Send, Eye, Zap } from "lucide-react";
import { GamePlayer } from "@/lib/services/types";

export default function CreateLevel() {
  // ✅ NEW: Use unified service and user management
  const { createLevel, isLoading, error, getCurrentUser, isWeb3Mode } = useGameService();
  const [user, setUser] = useState<GamePlayer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [generatedLevel, setGeneratedLevel] = useState<number[] | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // ✅ NEW: Load current user
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, [getCurrentUser]);

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

    if (!user) {
      toast({
        title: "Authentication Required",
        description: isWeb3Mode 
          ? "Please connect your wallet to create levels" 
          : "Please login to create levels",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setTxHash(null);

      // Show initial toast
      toast({
        title: isWeb3Mode ? "Iniciando Transacción 🚀" : "Creando Nivel 🚀",
        description: isWeb3Mode 
          ? "Por favor, confirma la transacción en tu wallet."
          : "Tu nivel está siendo creado...",
        duration: 4000,
      });

      // ✅ NEW: Use unified createLevel
      const result = await createLevel(generatedLevel);
      
      if (result) {
        toast({
          title: "¡Nivel Creado Exitosamente! 🎉",
          description: isWeb3Mode ? (
            <div className="mt-2 flex flex-col gap-2">
              <p>Tu nivel ha sido publicado en la blockchain correctamente.</p>
              <p className="text-sm text-slate-400 break-all">
                Transacción:{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-300 text-blue-400"
                >
                  {result.txHash}
                </a>
              </p>
            </div>
          ) : (
            "Tu nivel ha sido creado exitosamente en la base de datos."
          ),
          duration: 8000,
        });

        setGeneratedLevel(null);
        setTxHash(null);
      }

    } catch (error) {
      console.error("Error submitting level:", error);
      
      toast({
        title: "Error al Crear Nivel ❌",
        description: error instanceof Error ? error.message : "Error desconocido al crear el nivel.",
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
            Crear Nivel {isWeb3Mode ? "(Web3)" : "(REST)"}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Diseña y publica tus propios niveles {isWeb3Mode ? "en la blockchain" : ""}
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

                {/* Submit Button */}
                {generatedLevel && user && (
                  <Button
                    onClick={handleSubmitLevel}
                    disabled={isLoading}
                    color="blue"
                    icon={Send}
                    className="w-full"
                  >
                    {isLoading
                      ? "Creando..."
                      : "Crear Nivel"}
                  </Button>
                )}

                {/* Authentication Required */}
                {!user && (
                  <div className="p-4 bg-yellow-900/50 rounded-lg border border-yellow-600">
                    <p className="text-sm font-medium text-yellow-300 mb-2">
                      Authentication Required
                    </p>
                    <UnifiedConnectButton />
                  </div>
                )}

                {/* Transaction Status */}
                {txHash && (
                  <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-600">
                    <p className="text-sm font-medium text-blue-300 mb-2">
                      Transaction Hash:
                    </p>
                    <p className="text-xs text-blue-400 break-all">{txHash}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Preview Area */}
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
