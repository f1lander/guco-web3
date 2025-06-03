"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Plus, Gamepad2, Layers, Menu, X, Book } from "lucide-react";
import { DEFAULT_NETWORK_NAME } from "@/lib/constants";
import Button from "../atoms/Button";
import { useTranslation } from "@/providers/language-provider";
import { CustomConnectButton } from "@/components/molecules/CustomConnectButton";

export function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLinks = [
    {
      label: t("nav.explorer"),
      href: "/dashboard",
      color: "purple",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: t("nav.createLevel"),
      color: "orange",
      href: "/dashboard/create-level",
      icon: <Plus className="w-4 h-4" />,
    },
    {
      label: t("nav.myLevels"),
      color: "blue",
      href: "/dashboard/my-levels",
      icon: <Gamepad2 className="w-4 h-4" />,
    },
    {
      label: t("nav.lessons"),
      color: "green",
      href: "/dashboard/courses",
      icon: <Book className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 transition-all duration-100 ease-in-out bg-slate-900 backdrop-blur-sm shadow-lg`}
      >
        <div className="flex items-center gap-8">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <Link
            href="/"
            className={`transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-90"}`}
          >
            <span className="text-xl font-bold text-guco-100">GÜCO</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`transition-transform duration-100 ${scrolled ? "scale-95" : "scale-100"}`}
          >
            <CustomConnectButton />
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <span className="text-xl font-bold text-guco-100">GÜCO</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Button color={link.color} className="w-full justify-start">
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNavbar;
