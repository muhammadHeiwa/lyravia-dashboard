const STORAGE_KEY = "lyravia-auth-token";

export function loadAuthToken() {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveAuthToken(token) {
  if (typeof window === "undefined") return;

  if (!token) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
}