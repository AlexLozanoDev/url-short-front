export interface ShortenUrlRequest {
  targetURL: string;
  alias: string | null;
}

export interface ShortenUrlResponse {
  shortCode: string
}
