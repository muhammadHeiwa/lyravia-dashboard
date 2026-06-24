const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

let authToken = "";

export function setAuthToken(token) {
  authToken = token || "";
}

export function getAuthToken() {
  return authToken;
}

function createUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function normalizeErrorMessage(data, status) {
  const message = data?.message || "";
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("etimedout") ||
    lowerMessage.includes("econnrefused") ||
    lowerMessage.includes("network")
  ) {
    return "Koneksi server sedang bermasalah. Pastikan backend dan database aktif, lalu coba lagi.";
  }

  if (status >= 500) {
    return "Server sedang mengalami kendala. Coba lagi beberapa saat lagi.";
  }

  return message || "Request gagal";
}

export async function request(path, options = {}) {
  const { auth = true, headers: requestHeaders = {}, ...fetchOptions } = options;

  let response;

  try {
    response = await fetch(createUrl(path), {
      headers: {
        "Content-Type": "application/json",
        ...(auth && authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...requestHeaders
      },
      ...fetchOptions
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server. Pastikan backend aktif, lalu coba lagi.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(data, response.status));
  }

  return data;
}
