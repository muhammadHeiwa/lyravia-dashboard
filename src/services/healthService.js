import { request } from "./apiClient";

export async function healthCheck() {
  return request("/api/health", { auth: false });
}
