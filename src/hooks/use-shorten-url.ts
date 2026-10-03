import { useState } from "react";
import { urlService } from "@/services/url.service";

export function useShortenUrl() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shorten = async (
    targetURL: string,
    alias: string | null
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await urlService.shortenUrl({ targetURL, alias });
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al acortar la URL";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { shorten, isLoading, error };
}
