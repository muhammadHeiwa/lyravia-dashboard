import { useState } from "react";
import CriteriaBuilder from "./CriteriaBuilder";

export default function LandingPage({
  name,
  setName,
  title,
  setTitle,
  judgeCount,
  setJudgeCount,
  roomCodeInput,
  setRoomCodeInput,
  operatorRoomCodeInput,
  setOperatorRoomCodeInput,
  criteria,
  addCriterion,
  updateCriterionName,
  removeCriterion,
  createRoom,
  joinRoom,
  joinAsOperator
}) {
  const [activeTab, setActiveTab] = useState("host");

  return (
    <div className="landing-shell">
      <div className="role-tabs" role="tablist" aria-label="Mode akses">
        {[
          {
            key: "host",
            label: "Host",
            description: "Buat room, kelola kriteria, lock room, dan kick user."
          },
          {
            key: "judge",
            label: "Juri",
            description: "Masuk ke room dan kirim skor penilaian."
          },
          {
            key: "operator",
            label: "Operator",
            description: "Pantau room dan scoreboard tanpa ikut menilai."
          }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`role-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
          >
            <span>{tab.label}</span>
            <small>{tab.description}</small>
          </button>
        ))}
      </div>

      <section className="panel glass-panel landing-panel">
        {activeTab === "host" && (
          <>
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Room</p>
                <h2>Buat room baru</h2>
              </div>
              <span className="chip">Host</span>
            </div>

            <div className="form-group">
              <label>Nama host</label>
              <input
                placeholder="Masukkan nama host"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Judul acara</label>
              <input
                placeholder="Contoh: Audisi Bintang Kampus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Jumlah juri</label>
              <input
                type="number"
                min="1"
                max="20"
                value={judgeCount}
                onChange={(e) => setJudgeCount(Number(e.target.value))}
              />
            </div>

            <CriteriaBuilder
              criteria={criteria}
              onAdd={addCriterion}
              onUpdate={updateCriterionName}
              onRemove={removeCriterion}
            />

            <button className="primary-button" onClick={createRoom}>
              Buat room
            </button>
          </>
        )}

        {activeTab === "judge" && (
          <>
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Access</p>
                <h2>Masuk sebagai juri</h2>
              </div>
              <span className="chip secondary">Judge</span>
            </div>

            <div className="form-group">
              <label>Nama juri</label>
              <input
                placeholder="Masukkan nama juri"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Kode room</label>
              <input
                placeholder="Contoh: ABC123"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              />
            </div>

            <button className="primary-button" onClick={joinRoom}>
              Masuk room
            </button>
          </>
        )}

        {activeTab === "operator" && (
          <>
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Access</p>
                <h2>Masuk sebagai operator</h2>
              </div>
              <span className="chip secondary">Operator</span>
            </div>

            <div className="form-group">
              <label>Nama operator</label>
              <input
                placeholder="Masukkan nama operator"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Kode room</label>
              <input
                placeholder="Contoh: ABC123"
                value={operatorRoomCodeInput}
                onChange={(e) =>
                  setOperatorRoomCodeInput(e.target.value.toUpperCase())
                }
              />
            </div>

            <button className="primary-button" onClick={joinAsOperator}>
              Masuk sebagai operator
            </button>
          </>
        )}
      </section>
    </div>
  );
}
