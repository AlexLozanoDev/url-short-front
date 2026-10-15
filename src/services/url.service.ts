import { appFetch } from "./api-client";
import { LinkItem, LinkStatsResponse, PagedResponse, ShortenUrlRequest, ShortenUrlResponse } from "../types/urls";
import { ApiResponse } from "@/types/ApiResponse";

export const urlService = {
  shortenUrl: (
    data: ShortenUrlRequest,
  ): Promise<ApiResponse<ShortenUrlResponse>> => {
    return appFetch("/api/trmit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Error al acortar la URL");
      }
      return responseData;
    });
  },

  getMyLinks: (
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PagedResponse<LinkItem>>> => {
    return appFetch(`/api/links/mine?page=${page}&pageSize=${pageSize}`).then(
      async (res) => {
        if (!res.ok) throw new Error("Error al obtener los enlaces");
        return res.json();
      },
    );
  },

  getLinkStats: (code: string): Promise<ApiResponse<LinkStatsResponse>> => {
    return appFetch(`/api/links/${code}/stats`).then(async (res) => {
      if (!res.ok) throw new Error("Error al obtener las estadísticas");
      return res.json();
    });
  },
};
