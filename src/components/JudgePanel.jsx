export default function JudgePanel({
  room,
  scoreForm,
  updateScoreValue,
  submitScore,
  hasSubmittedMyScore
}) {
  return (
    <div className="judge-layout">
      <section className="panel glass-panel judge-panel-centered">
        <div className="panel-header center-header">
          <div>
            <p className="panel-kicker">Judge Panel</p>
            <h2>Input skor</h2>
          </div>
        </div>

        <div className="judge-focus-card">
          <p className="judge-focus-label">Round saat ini</p>
          <h3>Round {room.round}</h3>

          <p className="muted">
            {room.participantName
              ? `Peserta yang sedang dinilai: ${room.participantName}`
              : "Host belum mengisi nama peserta untuk ronde ini."}
          </p>

          <div className="criteria-score-list">
            {room.criteria?.map((criterion) => (
              <div className="score-field" key={criterion.id}>
                <label>{criterion.name}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={scoreForm[criterion.id] ?? ""}
                  disabled={room.revealed}
                  onChange={(e) =>
                    updateScoreValue(criterion.id, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button
            className="primary-button large-button"
            disabled={room.revealed}
            onClick={submitScore}
          >
            {hasSubmittedMyScore ? "Update Score" : "Submit Score"}
          </button>

          {hasSubmittedMyScore && !room.revealed && (
            <p className="success-text">
              Nilai kamu sudah tersimpan dan menunggu reveal dari host.
            </p>
          )}

          {room.revealed && (
            <p className="success-text">
              Skor sudah direveal. Lihat hasil di halaman scoreboard.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}