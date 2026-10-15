/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setRequestCount] = useState(0);

  useEffect(() => {
    // Escuchamos el evento personalizado global de carga
    const handleLoading = (event: CustomEvent<{ loading: boolean }>) => {
      setRequestCount((prev) => {
        const next = event.detail.loading ? prev + 1 : Math.max(0, prev - 1);
        setIsLoading(next > 0);
        return next;
      });
    };

    window.addEventListener("app-loading" as any, handleLoading);
    return () => {
      window.removeEventListener("app-loading" as any, handleLoading);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md transition-all animate-in fade-in-0">
        <Loader2 className="w-8 h-8 text-zinc-800 dark:text-zinc-200 animate-spin" />
    </div>
  );
}
