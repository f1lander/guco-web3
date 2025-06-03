import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "../atoms/SectionTitle";
import { useTranslation } from "@/providers/language-provider";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      emoji: "🤖",
      translationKey: "intuitiveProgramming",
    },
    {
      emoji: "🎮",
      translationKey: "gamifiedLearning",
    },
    {
      emoji: "⛓️",
      translationKey: "blockchain",
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="flex flex-col container mx-auto px-4 gap-8">
        <SectionTitle className="text-center mb-8 md:mb-12 px-2">
          {t("features.title")}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <Card key={feature.translationKey} className="backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                  {feature.emoji}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {t(`features.${feature.translationKey}.title`)}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {t(`features.${feature.translationKey}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
