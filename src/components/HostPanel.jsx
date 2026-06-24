import ScoreHistory from "./ScoreHistory";

export default function HostPanel({
  room,
  submittedCount,
  averageScore,
  participantName,
  setParticipantName,
  updateParticipantName,
  toggleLock,
  revealScores,
  resetRound,
  kickMember
}) {
  return (
    <>
      <div className="dashboard-grid">
        <section className="panel glass-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Room Information</p>
              <h2>Kontrol host</h2>
            </div>
            <span className={room.locked ? "chip danger" : "chip success"}>
              {room.locked ? "Locked" : "Open"}
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Juri</span>
              <strong>{room.totalJudges}</strong>
            </div>
            <div className="stat-card">
              <span>Juri Bergabung</span>
              <strong>{room.judges?.length || 0}</strong>
            </div>
            <div className="stat-card">
              <span>Skor Masuk</span>
              <strong>{submittedCount}</strong>
            </div>
            <div className="stat-card">
              <span>Rata-rata</span>
              <strong>{room.revealed ? averageScore : "Hidden"}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Nama peserta saat ini</label>
            <div className="inline-form">
              <input
                placeholder="Contoh: Andi Pratama"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
              <button
                className="secondary-button inline-button"
                onClick={updateParticipantName}
              >
                Simpan Peserta
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Kriteria aktif</label>
            <div className="criteria-pill-list">
              {room.criteria?.map((criterion) => (
                <span className="criteria-pill" key={criterion.id}>
                  {criterion.name}
                </span>
              ))}
            </div>
          </div>

          <div className="action-group">
            <button className="primary-button" onClick={toggleLock}>
              {room.locked ? "Unlock Room" : "Lock Room"}
            </button>
            <button
              className="primary-button"
              onClick={revealScores}
              disabled={room.revealed || submittedCount === 0}
            >
              Reveal Scores
            </button>
            <button className="secondary-button" onClick={resetRound}>
              Reset Round
            </button>
          </div>
        </section>

        <section className="panel glass-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Judge Monitoring</p>
              <h2>Daftar juri</h2>
            </div>
          </div>

          <div className="judge-stack">
            {!room.judges?.length && (
              <p className="muted">Belum ada juri yang bergabung.</p>
            )}

            {room.judges?.map((judge, index) => {
              const hasSubmitted = !!room.scores?.[judge.id];

              return (
                <div className="judge-card" key={judge.id}>
                  <div>
                    <p className="judge-order">Juri {index + 1}</p>
                    <h4>{judge.name}</h4>
                  </div>
                  <span className={hasSubmitted ? "badge done" : "badge pending"}>
                    {hasSubmitted ? "Sudah submit" : "Belum submit"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel glass-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Active Members</p>
              <h2>Kontrol user</h2>
            </div>
          </div>

          <div className="member-stack">
            {!room.members?.filter((member) => member.role !== "host").length && (
              <p className="muted">Belum ada member selain host.</p>
            )}

            {room.members
              ?.filter((member) => member.role !== "host")
              .map((member) => {
                const isJudge = member.role === "judge";
                const hasSubmitted = !!room.scores?.[member.id];

                return (
                  <div className="member-card" key={`${member.role}-${member.id}`}>
                    <div>
                      <p className="member-meta">
                        {member.role === "operator" ? "Operator" : "Juri"}
                      </p>
                      <h4>{member.name}</h4>
                      {isJudge && (
                        <p className="member-status">
                          {hasSubmitted ? "Sudah submit skor" : "Belum submit skor"}
                        </p>
                      )}
                    </div>

                    <button
                      className="danger-button"
                      onClick={() => kickMember(member.id)}
                      disabled={member.status === "kicked"}
                    >
                      Kick
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      </div>

      <ScoreHistory room={room} />
    </>
  );
}
