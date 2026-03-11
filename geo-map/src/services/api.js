const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").trim();

export const API_BASE_URL = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

export async function apiRequest(path, options = {}) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${API_BASE_URL}${normalizedPath}`;
    const { body, headers, ...rest } = options;

    const response = await fetch(url, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    const responseText = await response.text();
    let payload = null;

    if (responseText) {
        try {
            payload = JSON.parse(responseText);
        } catch {
            throw new Error("Received an invalid JSON response from the API.");
        }
    }

    if (!response.ok) {
        throw new Error(payload?.message || `Request failed with status ${response.status}.`);
    }

    return payload;
}
