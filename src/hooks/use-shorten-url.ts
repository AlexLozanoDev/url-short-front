import { useState } from "react";
import { urlService } from "@/services/url.service";
import { ShortenUrlResponse } from "@/types/urls";
import { ApiResponse } from "@/types/ApiResponse";

export function useShortenUrl() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shorten = async (
    targetURL: string,
    alias: string | null
  ): Promise<ApiResponse<ShortenUrlResponse> | null> => {
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
