export interface ShortenUrlRequest {
  targetURL: string;
  alias: string | null;
}

export interface ShortenUrlResponse {
  shortCode: string
}

export interface PagedResponse<T>{
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LinkItem{
  code: string,
  targetUrl: string,
  isCustomAlias: boolean,
  totalClicks: number,
  createdAt: string
}

export interface ClickStatsItems{
  clickedAt: string,
  ipAddress?: string | null,
  userAgent?: string | null
}

export interface LinkStatsResponse {
  code: string;
  targetUrl: string;
  totalClicksAllTime: number;
  stats: ClickStatsItems[];
}
