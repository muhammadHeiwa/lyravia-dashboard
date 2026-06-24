import { request } from "./apiClient";

export async function createRoom(payload) {
  return request("/api/rooms", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function getRoom(roomCode, sessionId) {
  const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : "";
  return request(`/api/rooms/${roomCode}${query}`, { auth: false });
}

export async function joinRoom(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/join`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function updateParticipantName(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/participant`, {
    method: "PATCH",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function toggleLock(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/lock`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function revealScores(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/reveal`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function resetRound(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/reset`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function kickMember(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/kick`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}

export async function submitScore(roomCode, payload) {
  return request(`/api/rooms/${roomCode}/scores`, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload)
  });
}
