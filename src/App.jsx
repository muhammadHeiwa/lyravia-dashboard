import { useCallback, useEffect, useMemo, useState } from "react";

import AuthPanel from "./components/AuthPanel";
import LandingPage from "./components/LandingPage";
import Topbar from "./components/Topbar";
import HostPanel from "./components/HostPanel";
import JudgePanel from "./components/JudgePanel";
import Scoreboard from "./components/Scoreboard";
import OperatorPanel from "./components/PresenterPanel";

import { useRoomRealtime } from "./hooks/useRoomRealTime";
import { createDefaultCriteria, getJudgeSubmittedCount } from "./utils/roomUtils";
import {
  createRoom as apiCreateRoom,
  getAuthMe as apiGetAuthMe,
  healthCheck as apiHealthCheck,
  joinRoom as apiJoinRoom,
  kickMember as apiKickMember,
  loginAuth as apiLoginAuth,
  logoutAuth as apiLogoutAuth,
  resetRound as apiResetRound,
  registerAuth as apiRegisterAuth,
  revealScores as apiRevealScores,
  submitScore as apiSubmitScore,
  toggleLock as apiToggleLock,
  updateParticipantName as apiUpdateParticipantName
} from "./utils/api";
import {
  setAuthToken as setApiAuthToken
} from "./utils/api";
import {
  clearAuthToken,
  loadAuthToken,
  saveAuthToken
} from "./utils/authStore";
import {
  clearRoomSession,
  createSessionId,
  loadRoomSession,
  saveRoomSession
} from "./utils/sessionStore";

function normalizeAuthUser(payload) {
  if (!payload) return null;

  return payload.user || payload.data || payload.account || payload.profile || payload;
}

export default function App() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Lomba Audisi");
  const [judgeCount, setJudgeCount] = useState(3);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [operatorRoomCodeInput, setOperatorRoomCodeInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState("home");
  const [participantName, setParticipantName] = useState("");
  const [criteria, setCriteria] = useState(createDefaultCriteria());
  const [scoreForm, setScoreForm] = useState({});
  const [authMode, setAuthMode] = useState("login");
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authBusy, setAuthBusy] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const savedSession = loadRoomSession();

    if (savedSession) {
      const restoredRole = savedSession.role === "presenter" ? "operator" : savedSession.role || "";

      setRole(restoredRole);
      setName(savedSession.name || "");
      setRoomCode(savedSession.roomCode || "");
      setSessionId(savedSession.sessionId || "");
      setView(savedSession.view || restoredRole || "home");
      setParticipantName(savedSession.participantName || "");
    }

    const savedToken = loadAuthToken();

    if (savedToken) {
      setAuthToken(savedToken);
      setApiAuthToken(savedToken);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkApi = async () => {
      try {
        await apiHealthCheck();
        if (!cancelled) setApiStatus("online");
      } catch {
        if (!cancelled) setApiStatus("offline");
      }
    };

    checkApi();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setApiAuthToken(authToken);
    saveAuthToken(authToken);
  }, [authToken]);

  useEffect(() => {
    if (!hydrated || !authToken) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await apiGetAuthMe();

        if (!cancelled) {
          setAuthUser(normalizeAuthUser(response));
        }
      } catch (error) {
        if (!cancelled) {
          setAuthUser(null);
          setAuthToken("");
          clearAuthToken();
          setMessage(error.message || "Sesi auth tidak valid");
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authToken, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    if (roomCode && role && sessionId) {
      saveRoomSession({
        role,
        name,
        roomCode,
        sessionId,
        view,
        participantName
      });
      return;
    }

    clearRoomSession();
  }, [hydrated, role, name, roomCode, sessionId, view, participantName]);

  const resetLocalRoom = useCallback(() => {
    clearRoomSession();
    setRole("");
    setName("");
    setTitle("Lomba Audisi");
    setJudgeCount(3);
    setRoomCodeInput("");
    setOperatorRoomCodeInput("");
    setRoomCode("");
    setRoom(null);
    setSessionId("");
    setView("home");
    setParticipantName("");
    setScoreForm({});
  }, []);

  useRoomRealtime(roomCode, sessionId, setRoom, setMessage, resetLocalRoom);

  useEffect(() => {
    if (role === "host") {
      setParticipantName(room?.participantName || "");
    }
  }, [room?.participantName, role]);

  useEffect(() => {
    if (!room?.criteria?.length) return;
    if (role !== "judge") return;

    const existing = room?.scores?.[sessionId]?.criteriaScores || {};

    setScoreForm((prev) => {
      const nextState = {};

      room.criteria.forEach((criterion) => {
        nextState[criterion.id] = prev[criterion.id] ?? existing[criterion.id] ?? "";
      });

      return nextState;
    });
  }, [room?.criteria, room?.scores, role, sessionId]);

  const submittedCount = useMemo(() => getJudgeSubmittedCount(room), [room]);

  const averageScore = useMemo(() => {
    if (!room?.revealed || !room?.scores) return "0.00";

    const values = Object.values(room.scores);
    if (!values.length) return "0.00";

    const total = values.reduce(
      (acc, item) => acc + Number(item.totalScore || 0),
      0
    );

    return (total / values.length).toFixed(2);
  }, [room]);

  const hasSubmittedMyScore = useMemo(() => {
    if (!room?.scores || !sessionId) return false;
    return !!room.scores[sessionId];
  }, [room, sessionId]);

  const addCriterion = () => {
    setCriteria((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`, name: "" }
    ]);
  };

  const updateCriterionName = (id, value) => {
    setCriteria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const removeCriterion = (id) => {
    setCriteria((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleAuthSubmit = async () => {
    const email = authForm.email.trim();
    const password = authForm.password.trim();
    const nameValue = authForm.name.trim();

    if (authMode === "register" && !nameValue) {
      setMessage("Nama wajib diisi untuk register");
      return;
    }

    if (!email || !password) {
      setMessage("Email dan password wajib diisi");
      return;
    }

    setAuthBusy(true);

    try {
      const response =
        authMode === "register"
          ? await apiRegisterAuth({ name: nameValue, email, password })
          : await apiLoginAuth({ email, password });

      const nextToken = response?.token || response?.accessToken || "";

      if (nextToken) {
        setAuthToken(nextToken);
        setApiAuthToken(nextToken);
      }

      const nextUser = normalizeAuthUser(response);
      if (nextUser) {
        setAuthUser(nextUser);
      } else if (nextToken) {
        const profile = await apiGetAuthMe();
        setAuthUser(normalizeAuthUser(profile));
      }

      setMessage(authMode === "register" ? "Register berhasil" : "Login berhasil");
      setAuthForm({ name: "", email: "", password: "" });
      setAuthModalOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const refreshAuthProfile = async () => {
    if (!authToken) return;

    setAuthBusy(true);

    try {
      const response = await apiGetAuthMe();
      setAuthUser(normalizeAuthUser(response));
      setMessage("Profil auth diperbarui");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    let logoutSucceeded = true;

    try {
      if (authToken) {
        await apiLogoutAuth();
      }
    } catch (error) {
      logoutSucceeded = false;
      setMessage(error.message);
    } finally {
      setAuthUser(null);
      setAuthToken("");
      setApiAuthToken("");
      clearAuthToken();
      setAuthBusy(false);
      if (logoutSucceeded) {
        setMessage("Logout berhasil");
      }
    }
  };

  const createRoom = async () => {
    if (!name.trim()) {
      setMessage("Nama host wajib diisi");
      return;
    }

    const normalizedCriteria = criteria
      .map((item) => ({ ...item, name: item.name.trim() }))
      .filter((item) => item.name);

    if (normalizedCriteria.length === 0) {
      setMessage("Minimal harus ada 1 kriteria penilaian");
      return;
    }

    try {
      const nextSessionId = sessionId || createSessionId();
      const response = await apiCreateRoom({
        title: title.trim() || "Lomba Audisi",
        totalJudges: Number(judgeCount),
        hostName: name.trim(),
        criteria: normalizedCriteria,
        sessionId: nextSessionId
      });

      setRole("host");
      setView("host");
      setRoomCode(response.room.roomCode);
      setSessionId(response.sessionId);
      setRoom(response.room);
      setMessage(`Room berhasil dibuat: ${response.room.roomCode}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const joinRoom = async () => {
    const code = roomCodeInput.trim().toUpperCase();

    if (!name.trim()) {
      setMessage("Nama juri wajib diisi");
      return;
    }

    if (!code) {
      setMessage("Kode room wajib diisi");
      return;
    }

    try {
      const nextSessionId = sessionId || createSessionId();
      const response = await apiJoinRoom(code, {
        role: "judge",
        name: name.trim(),
        sessionId: nextSessionId
      });

      setRole("judge");
      setView("judge");
      setRoomCode(code);
      setSessionId(response.sessionId);
      setRoom(response.room);
      setMessage(`Berhasil join room ${code}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const joinAsOperator = async () => {
    const code = operatorRoomCodeInput.trim().toUpperCase();

    if (!name.trim()) {
      setMessage("Nama operator wajib diisi");
      return;
    }

    if (!code) {
      setMessage("Kode room wajib diisi");
      return;
    }

    try {
      const nextSessionId = sessionId || createSessionId();
      const response = await apiJoinRoom(code, {
        role: "operator",
        name: name.trim(),
        sessionId: nextSessionId
      });

      setRole("operator");
      setView("operator");
      setRoomCode(code);
      setSessionId(response.sessionId);
      setRoom(response.room);
      setMessage(`Operator berhasil masuk ke room ${code}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateScoreValue = (criterionId, value) => {
    setScoreForm((prev) => ({
      ...prev,
      [criterionId]: value
    }));
  };

  const submitScore = async () => {
    if (!room || !sessionId) return;

    const criteriaScores = {};
    let totalScore = 0;

    for (const criterion of room.criteria || []) {
      const rawValue = scoreForm[criterion.id];
      const numericScore = Number(rawValue);

      if (
        rawValue === "" ||
        Number.isNaN(numericScore) ||
        numericScore < 0 ||
        numericScore > 100
      ) {
        setMessage(`Nilai ${criterion.name} harus diisi antara 0 sampai 100`);
        return;
      }

      criteriaScores[criterion.id] = numericScore;
      totalScore += numericScore;
    }

    try {
      const response = await apiSubmitScore(roomCode, {
        sessionId,
        criteriaScores,
        totalScore
      });

      setRoom(response.room);
      setMessage("Skor berhasil dikirim");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateParticipantName = async () => {
    if (!roomCode || !sessionId) return;

    try {
      const response = await apiUpdateParticipantName(roomCode, {
        sessionId,
        participantName: participantName.trim()
      });

      setRoom(response.room);
      setMessage("Nama peserta berhasil disimpan");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const revealScores = async () => {
    if (!roomCode || !room) return;

    try {
      const response = await apiRevealScores(roomCode, {
        sessionId
      });

      setRoom(response.room);
      setView("scoreboard");
      setMessage("Skor berhasil direveal");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetRound = async () => {
    if (!roomCode || !room) return;

    try {
      const response = await apiResetRound(roomCode, {
        sessionId
      });

      setRoom(response.room);
      setParticipantName("");
      if (role === "host") setView("host");
      if (role === "judge") setView("judge");
      if (role === "operator") setView("operator");
      setMessage("Round direset");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleLock = async () => {
    if (!roomCode || !room) return;

    try {
      const response = await apiToggleLock(roomCode, {
        sessionId
      });

      setRoom(response.room);
      setMessage(response.room.locked ? "Room dikunci" : "Room dibuka");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const kickMember = async (targetSessionId) => {
    if (!roomCode || !sessionId) return;

    try {
      const response = await apiKickMember(roomCode, {
        sessionId,
        targetSessionId
      });

      setRoom(response.room);
      setMessage("User berhasil dikeluarkan");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const goToScoreboard = () => {
    setView("scoreboard");
  };

  const goToRolePanel = () => {
    if (role === "host") {
      setView("host");
      return;
    }

    if (role === "judge") {
      setView("judge");
      return;
    }

    if (role === "operator") {
      setView("operator");
    }
  };

  return (
    <div className="app-shell">
      <div className="container">
        <header className="app-header">
          <div>
            <p className="eyebrow">Lyravia Audition Score</p>
            <h1>Satu room untuk audisi yang rapi, cepat, dan transparan.</h1>
            <p className="hero-text">
              Buat sesi penjurian dalam hitungan detik, biarkan juri fokus
              memberi nilai, lalu tampilkan hasil saat host siap melakukan reveal.
            </p>
          </div>
          <div className="header-actions">
            <div className={`api-status ${apiStatus}`}>
              <span />
              {apiStatus === "online"
                ? "Sistem siap"
                : apiStatus === "offline"
                  ? "Koneksi tertunda"
                  : "Menghubungkan"}
            </div>

            {authToken ? (
              <div className="header-user">
                <div>
                  <span>Masuk sebagai</span>
                  <strong>{authUser?.name || authUser?.email || "User"}</strong>
                </div>
                <button className="secondary-button" onClick={handleLogout} disabled={authBusy}>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="header-auth-buttons">
                <button
                  className="secondary-button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                >
                  Masuk
                </button>
                <button
                  className="primary-button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthModalOpen(true);
                  }}
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </header>

        <AuthPanel
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          setAuthForm={setAuthForm}
          authUser={authUser}
          authToken={authToken}
          authBusy={authBusy}
          onSubmitAuth={handleAuthSubmit}
          onLogout={handleLogout}
          onRefreshProfile={refreshAuthProfile}
        />

        {!roomCode && hydrated && (
          <LandingPage
            name={name}
            setName={setName}
            title={title}
            setTitle={setTitle}
            judgeCount={judgeCount}
            setJudgeCount={setJudgeCount}
            roomCodeInput={roomCodeInput}
            setRoomCodeInput={setRoomCodeInput}
            operatorRoomCodeInput={operatorRoomCodeInput}
            setOperatorRoomCodeInput={setOperatorRoomCodeInput}
            criteria={criteria}
            addCriterion={addCriterion}
            updateCriterionName={updateCriterionName}
            removeCriterion={removeCriterion}
            createRoom={createRoom}
            joinRoom={joinRoom}
            joinAsOperator={joinAsOperator}
          />
        )}

        {message && <div className="alert modern-alert">{message}</div>}

        {room && (
          <>
            <Topbar
              room={room}
              role={role}
              authUser={authUser}
              onLogout={handleLogout}
              goToRolePanel={goToRolePanel}
              goToScoreboard={goToScoreboard}
            />

            {view === "host" && role === "host" && (
              <HostPanel
                room={room}
                submittedCount={submittedCount}
                averageScore={averageScore}
                participantName={participantName}
                setParticipantName={setParticipantName}
                updateParticipantName={updateParticipantName}
                toggleLock={toggleLock}
                revealScores={revealScores}
                resetRound={resetRound}
                kickMember={kickMember}
              />
            )}

            {view === "judge" && role === "judge" && (
              <JudgePanel
                room={room}
                scoreForm={scoreForm}
                updateScoreValue={updateScoreValue}
                submitScore={submitScore}
                hasSubmittedMyScore={hasSubmittedMyScore}
              />
            )}

            {view === "scoreboard" && (
              <Scoreboard room={room} averageScore={averageScore} />
            )}

            {view === "operator" && role === "operator" && (
              <OperatorPanel room={room} averageScore={averageScore} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
