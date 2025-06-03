"use client";

import React from "react";
import GradientText from "../atoms/GradientText";
import { Github, Layers, Plus, Gamepad2, Book } from "lucide-react";
import Button from "@/components/atoms/Button";
import { useTranslation } from "@/providers/language-provider";
import Link from "next/link";

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToPlayground = () => {
    const playgroundSection = document.getElementById("playground");
    if (playgroundSection) {
      playgroundSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigationButtons = [
    {
      label: t("nav.explorer"),
      href: "/dashboard",
      color: "purple",
      icon: Layers,
    },
    {
      label: t("nav.createLevel"),
      color: "orange",
      href: "/dashboard/create-level",
      icon: Plus,
    },
    {
      label: t("nav.myLevels"),
      color: "blue",
      href: "/dashboard/my-levels",
      icon: Gamepad2,
    },
    {
      label: "Lecciones",
      href: "/dashboard/courses",
      color: "green",
      icon: Book,
    },
  ];

  return (
    <section className="min-h-[90vh] md:min-h-[80vh] flex items-center justify-center text-center p-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
          {t("hero.welcome")} <GradientText>GÜCO</GradientText>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 px-2">
          {t("hero.subtitle")}
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6">
          {navigationButtons.map((button) => (
            <Link key={button.href} href={button.href}>
              <Button
                className="w-full sm:w-[200px] h-[200px] flex flex-col gap-4 items-center justify-center p-8"
                color={button.color}
                icon={button.icon}
              >
                <span className="text-xl font-semibold">{button.label}</span>
              </Button>
            </Link>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Button
            variant="link"
            className="w-full sm:w-auto"
            onClick={scrollToPlayground}
          >
            {t("hero.howItWorks")}
          </Button>
          <Button
            variant="link"
            className="w-full sm:w-auto"
            icon={Github}
            onClick={() =>
              window.open("https://github.com/f1lander/guco-web3", "_blank")
            }
          >
            {t("hero.viewOnGithub")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
