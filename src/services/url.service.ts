import { apiClient } from "./api-client";
import { ShortenUrlRequest } from "../types/urls";

export const urlService = {
  shortenUrl: (data: ShortenUrlRequest): Promise<string> => {
    return apiClient("/v1/links", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
