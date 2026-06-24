export function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getJudgeSubmittedCount(room) {
  if (!room?.scores) return 0;
  return Object.keys(room.scores).length;
}

export function createDefaultCriteria() {
  return [
    { id: generateId(), name: "Kreativitas" },
    { id: generateId(), name: "Suara" }
  ];
}