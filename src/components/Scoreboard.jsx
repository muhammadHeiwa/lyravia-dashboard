import { useState } from "react";

export default function Scoreboard({ room, averageScore }) {
  const [selectedJudge, setSelectedJudge] = useState(null);

  const selectedScore = selectedJudge
    ? room.scores?.[selectedJudge.id]
    : null;

  return (
    <div className="scoreboard-layout">
      <section className="panel scoreboard-panel">
        <div className="scoreboard-header">
          <div>
            <p className="panel-kicker light">Live Scoreboard</p>
            <h2>Hasil penilaian</h2>

            <p className="scoreboard-subtext">
              {room.participantName
                ? `Peserta: ${room.participantName}`
                : "Nama peserta belum diisi oleh host."}
            </p>

            <p className="scoreboard-subtext">
              {room.revealed
                ? "Skor sudah ditampilkan oleh host."
                : "Skor masih disembunyikan sampai host menekan reveal."}
            </p>
          </div>

          <div className="scoreboard-summary">
            <span>Round {room.round}</span>
            <strong>{room.revealed ? averageScore : "Hidden"}</strong>
          </div>
        </div>

        <div className="scoreboard-grid">
          {room.judges?.map((judge) => {
            const judgeScore = room.scores?.[judge.id];

            return (
              <div className="score-tile" key={judge.id}>
                <div className="score-tile-name">{judge.name}</div>

                <div className="score-tile-value">
                  {room.revealed ? judgeScore?.totalScore ?? "-" : "?"}
                </div>

                {room.revealed && (
                  <button
                    className="secondary-button"
                    onClick={() => setSelectedJudge(judge)}
                  >
                    Lihat Detail
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedJudge && selectedScore && (
          <div className="detail-score-card">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Detail Score</p>
                <h2>{selectedJudge.name}</h2>
              </div>

              <button
                className="ghost-button"
                onClick={() => setSelectedJudge(null)}
              >
                Tutup
              </button>
            </div>

            <div className="score-breakdown">
              {room.criteria?.map((criterion) => (
                <div className="score-breakdown-row" key={criterion.id}>
                  <span>{criterion.name}</span>
                  <strong>
                    {selectedScore.criteriaScores?.[criterion.id] ?? "-"}
                  </strong>
                </div>
              ))}
            </div>

            <div className="score-total-box">
              <span>Total</span>
              <div className="score-tile-value">
                {selectedScore.totalScore ?? "-"}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}