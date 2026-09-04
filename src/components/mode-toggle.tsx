"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0">
        <span className="sr-only">Cargando tema</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Alternar tema de la interfaz"
      className="hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white transition-colors"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}
