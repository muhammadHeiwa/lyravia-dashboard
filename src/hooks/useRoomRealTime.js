import { useEffect } from "react";
import { getRoom } from "../utils/api";

export function useRoomRealtime(roomCode, sessionId, setRoom, setMessage, onInvalidSession) {
  useEffect(() => {
    if (!roomCode) return;

    let active = true;

    const loadRoom = async () => {
      try {
        const { room, member } = await getRoom(roomCode, sessionId);

        if (!active) return;

        if (member?.status === "kicked") {
          setRoom(null);
          setMessage("Kamu dikeluarkan dari room ini");
          onInvalidSession?.();
          return;
        }

        setRoom(room);
      } catch (error) {
        if (!active) return;

        setRoom(null);
        setMessage(error.message || "Room tidak ditemukan atau sudah dihapus");
        onInvalidSession?.();
      }
    };

    loadRoom();
    const timer = window.setInterval(loadRoom, 2500);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [roomCode, sessionId, setRoom, setMessage, onInvalidSession]);
}