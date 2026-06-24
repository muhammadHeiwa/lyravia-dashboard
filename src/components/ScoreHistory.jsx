import { useState } from "react";

export default function ScoreHistory({ room }) {
  const [selectedHistory, setSelectedHistory] = useState(null);

  const histories = Object.values(room.history || {}).sort(
    (a, b) => Number(b.round) - Number(a.round)
  );

  return (
    <div className="history-layout-center">
      <section className="panel glass-panel history-panel-center">
        <div className="panel-header center-header">
          <div>
            <p className="panel-kicker">Score History</p>
            <h2>Riwayat skor setiap round</h2>
          </div>
        </div>

        {!histories.length && (
          <p className="muted center-text">Belum ada history skor yang direveal.</p>
        )}

        <div className="history-list-center">
          {histories.map((history) => {
            const scoreValues = Object.values(history.scores || {});
            const totalScore = scoreValues.reduce(
              (acc, item) => acc + Number(item.totalScore || 0),
              0
            );

            return (
              <div className="history-card-center" key={history.round}>
                <p className="panel-kicker">Round {history.round}</p>

                <h3>{history.participantName || "Tanpa nama peserta"}</h3>

                <strong className="history-total-score">{totalScore}</strong>

                <button
                  className="secondary-button"
                  onClick={() => setSelectedHistory(history)}
                >
                  Lihat Detail
                </button>
              </div>
            );
          })}
        </div>

        {selectedHistory && (
          <div className="detail-score-card">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">
                  Detail Round {selectedHistory.round}
                </p>
                <h2>{selectedHistory.participantName || "Tanpa nama peserta"}</h2>
              </div>

              <button
                className="ghost-button"
                onClick={() => setSelectedHistory(null)}
              >
                Tutup
              </button>
            </div>

            <div className="scoreboard-grid">
              {selectedHistory.judges?.map((judge) => {
                const judgeScore = selectedHistory.scores?.[judge.id];

                return (
                  <div className="score-tile" key={judge.id}>
                    <div className="score-tile-name">{judge.name}</div>

                    <div className="score-breakdown">
                      {selectedHistory.criteria?.map((criterion) => (
                        <div
                          className="score-breakdown-row"
                          key={criterion.id}
                        >
                          <span>{criterion.name}</span>
                          <strong>
                            {judgeScore?.criteriaScores?.[criterion.id] ?? "-"}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="score-total-box">
                      <span>Total</span>
                      <div className="score-tile-value">
                        {judgeScore?.totalScore ?? "-"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}