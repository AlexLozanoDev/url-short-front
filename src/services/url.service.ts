import { apiClient } from "./api-client";
import { LinkItem, LinkStatsResponse, PagedResponse, ShortenUrlRequest, ShortenUrlResponse } from "../types/urls";
import { ApiResponse } from "@/types/ApiResponse";

export const urlService = {
  shortenUrl: (
    data: ShortenUrlRequest,
  ): Promise<ApiResponse<ShortenUrlResponse>> => {
    return apiClient("/v1/trimit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMyLinks: (
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PagedResponse<LinkItem>>> => {
    return fetch(`/api/links/mine?page=${page}&pageSize=${pageSize}`).then(
      async (res) => {
        if (!res.ok) throw new Error("Error al obtener los enlaces");
        return res.json();
      },
    );
  },

  getLinkStats: (code: string): Promise<ApiResponse<LinkStatsResponse>> => {
    return fetch(`/api/links/${code}/stats`).then(async (res) => {
      if (!res.ok) throw new Error("Error al obtener las estadísticas");
      return res.json();
    });
  },
};
