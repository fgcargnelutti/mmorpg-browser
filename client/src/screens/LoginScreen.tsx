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
      <div className="login-overlay" />

      <section className="login-panel">
        <div className="login-header">
          <h1>Howl of Collapse</h1>
          <p>Enter the wasteland</p>
        </div>

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
            Login
          </button>
        </div>
      </section>
    </main>
  );
}