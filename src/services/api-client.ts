const BASE_URL =
  process.env.PUBLIC_API_URL ||
  "https://trmit.site";

export async function apiClient(
  endpoint: string,
  options?: RequestInit,
): Promise<string> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Error ${response.status}: Ocurrió un fallo en la petición`,
    );
  }

  const textData = await response.text();
  return textData.replace(/^"|"$/g, "").trim();
}
