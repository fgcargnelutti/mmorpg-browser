import { useState } from "react";
import "./LoginScreen.css";

type LoginScreenProps = {
  onLoginSuccess: (username: string) => void;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage("Please enter username and password.");
      return;
    }

    setErrorMessage("");
    onLoginSuccess(trimmedUsername);
  };

  return (
    <main className="login-screen">
      <div className="login-backdrop" />
      <div className="login-overlay" />
      <div className="login-vignette" />

      <section className="login-shell">
        <section className="login-column login-column--left" aria-label="Login access">
          <div className="login-left-stack">
            <div className="login-status-row" aria-label="World status">
              <div className="login-status-pill">
                <span className="login-status-pill__dot" />
                Server online
              </div>
            </div>

            <section className="login-panel" aria-label="Login form">
              <div className="login-form">
                <label className="login-field">
                  <span>Username</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Type your username"
                  />
                </label>

                <label className="login-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Type your password"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleLogin();
                    }}
                  />
                </label>

                {errorMessage ? (
                  <div className="login-error">{errorMessage}</div>
                ) : null}

                <button className="login-button" type="button" onClick={handleLogin}>
                  Enter
                </button>
              </div>
            </section>
          </div>
        </section>
      </section>

      <section className="login-bottom-copy" aria-label="World introduction">
        <div className="login-hero-copy">
          <div className="login-hero-line">
            Persistent world exploration across fractured regions.
          </div>
          <div className="login-hero-line">
            Tactical survival systems, discoveries, and emerging routes.
          </div>
          <div className="login-hero-line">
            Premium dark-fantasy atmosphere with a map-first experience.
          </div>
        </div>
      </section>
    </main>
  );
}
