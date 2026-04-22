import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import "./LoginScreen.css";
export default function LoginScreen({ onLoginSuccess }) {
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
    return (_jsxs("main", { className: "login-screen", children: [_jsx("div", { className: "login-backdrop" }), _jsx("div", { className: "login-overlay" }), _jsx("div", { className: "login-vignette" }), _jsx("section", { className: "login-shell", children: _jsx("section", { className: "login-column login-column--left", "aria-label": "Login access", children: _jsxs("div", { className: "login-left-stack", children: [_jsx("div", { className: "login-status-row", "aria-label": "World status", children: _jsxs("div", { className: "login-status-pill", children: [_jsx("span", { className: "login-status-pill__dot" }), "Server online"] }) }), _jsx("section", { className: "login-panel", "aria-label": "Login form", children: _jsxs("div", { className: "login-form", children: [_jsxs("label", { className: "login-field", children: [_jsx("span", { children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (event) => setUsername(event.target.value), placeholder: "Type your username" })] }), _jsxs("label", { className: "login-field", children: [_jsx("span", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "Type your password", onKeyDown: (event) => {
                                                        if (event.key === "Enter")
                                                            handleLogin();
                                                    } })] }), errorMessage ? (_jsx("div", { className: "login-error", children: errorMessage })) : null, _jsx("button", { className: "login-button", type: "button", onClick: handleLogin, children: "Enter" })] }) })] }) }) }), _jsx("section", { className: "login-bottom-copy", "aria-label": "World introduction", children: _jsxs("div", { className: "login-hero-copy", children: [_jsx("div", { className: "login-hero-line", children: "Persistent world exploration across fractured regions." }), _jsx("div", { className: "login-hero-line", children: "Tactical survival systems, discoveries, and emerging routes." }), _jsx("div", { className: "login-hero-line", children: "Premium dark-fantasy atmosphere with a map-first experience." })] }) })] }));
}
