const BASE_URL = process.env.PUBLIC_API_URL || "https://trmit.site/api";

function notifyLoading(loading: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app-loading", { detail: { loading } }),
    );
  }
}

export async function appFetch(input: RequestInfo | URL, init?: RequestInit) {
  notifyLoading(true);
  try {
    const response = await fetch(input, init);
    return response;
  } finally {
    notifyLoading(false);
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  notifyLoading(true);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Error ${response.status}: Ocurrió un fallo en la petición`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.title || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    const textData = await response.text();
    const cleanedText = textData.replace(/^"|"$/g, "").trim();

    return cleanedText as unknown as T;
  } finally {
    notifyLoading(false);
  }
}
