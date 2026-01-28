"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = storage.getTheme() as "light" | "dark" | null;
    const systemTheme =
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const initial = saved ?? systemTheme;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    storage.setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <>
      {children}
      <button
        onClick={toggleTheme}
        className="
          fixed bottom-6 right-6 z-[9999]
          flex h-12 w-12 items-center justify-center
          rounded-full border
          bg-white shadow
          dark:bg-zinc-900 dark:text-white
        "
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </>
  );
}
