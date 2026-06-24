import { useEffect } from "react";

export default function AuthPanel({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authUser,
  authToken,
  authBusy,
  onSubmitAuth,
  onLogout,
  onRefreshProfile
}) {
  const isAuthenticated = !!authToken;
  const isRegister = authMode === "register";

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div>
            <p className="panel-kicker">Access</p>
            <h2 id="auth-modal-title">
              {isAuthenticated ? "Sesi akun aktif" : isRegister ? "Daftar akun baru" : "Masuk ke akun"}
            </h2>
            <p className="muted auth-description">
              Room tetap bisa dipakai sebagai guest. Akun dipakai untuk sesi auth backend.
            </p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Tutup modal">
            X
          </button>
        </div>

        {isAuthenticated ? (
          <div className="auth-signed-in">
            <div className="auth-profile-card">
              <p className="auth-profile-label">Current user</p>
              <h3>{authUser?.name || "User tersambung"}</h3>
              <p className="muted">{authUser?.email || "Profil belum dimuat."}</p>
            </div>

            <div className="auth-actions-row">
              <button className="secondary-button" onClick={onRefreshProfile} disabled={authBusy}>
                Refresh profil
              </button>
              <button className="danger-button" onClick={onLogout} disabled={authBusy}>
                Keluar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-mode-switch" role="tablist" aria-label="Pilih form auth">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
                role="tab"
                aria-selected={authMode === "login"}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
                role="tab"
                aria-selected={authMode === "register"}
              >
                Register
              </button>
            </div>

            <div className="auth-form-grid">
              {isRegister && (
                <div className="form-group full-width">
                  <label>Nama</label>
                  <input
                    placeholder="Masukkan nama"
                    value={authForm.name}
                    onChange={(event) =>
                      setAuthForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
              )}

              <div className="form-group full-width">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>

              <button className="primary-button auth-submit-button" onClick={onSubmitAuth} disabled={authBusy}>
                {authBusy ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
