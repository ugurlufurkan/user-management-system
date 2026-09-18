"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-zinc-200 animate-pulse"></div>;

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-xl border border-zinc-200/50 dark:border-zinc-700/50 transition-all hover:scale-110 focus:outline-none"
        title="Temayı Değiştir"
      >
        <Sun size={22} className="rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon size={22} className="absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </button>
    </div>
  );
}