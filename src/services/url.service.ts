import { apiClient } from "./api-client";
import { ShortenUrlRequest, ShortenUrlResponse } from "../types/urls";

export const urlService = {
  shortenUrl: (data: ShortenUrlRequest): Promise<ApiResponse<ShortenUrlResponse>> => {
    return apiClient("/v1/trimit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
