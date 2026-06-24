import { request } from "./apiClient";

export async function registerAuth(payload) {
  return request("/api/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function loginAuth(payload) {
  return request("/api/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function getAuthMe() {
  return request("/api/auth/me");
}

export async function logoutAuth() {
  return request("/api/auth/logout", {
    method: "POST"
  });
}
