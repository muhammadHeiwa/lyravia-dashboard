export default function Topbar({
  room,
  role,
  authUser,
  onLogout,
  goToRolePanel,
  goToScoreboard
}) {
  return (
    <div className="topbar glass-panel">
      <div>
        <p className="topbar-label">Room aktif</p>
        <h3>{room.title}</h3>
        <p className="topbar-meta">
          Kode room <strong>{room.roomCode}</strong> | Round{" "}
          <strong>{room.round}</strong>
          {room.participantName ? (
            <>
              {" "}
              | Peserta <strong>{room.participantName}</strong>
            </>
          ) : null}
        </p>
        {authUser ? (
          <p className="topbar-auth-meta">
            Auth sebagai <strong>{authUser.name || authUser.email || "User"}</strong>
          </p>
        ) : null}
      </div>

      <div className="topbar-actions">
        {authUser ? (
          <button className="secondary-button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
        <button className="ghost-button" onClick={goToRolePanel}>
          {role === "host"
            ? "Host Panel"
            : role === "operator"
              ? "Operator Panel"
              : "Judge Panel"}
        </button>
        <button className="ghost-button" onClick={goToScoreboard}>
          Scoreboard
        </button>
      </div>
    </div>
  );
}
