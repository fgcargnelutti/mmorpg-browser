import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Tooltip from "./Tooltip";
import "./StatusIcon.css";
export default function StatusIcon({ icon, label, description, active = true, variant = "default", size = "md", }) {
    return (_jsx(Tooltip, { content: _jsxs(_Fragment, { children: [_jsx("strong", { children: label }), _jsx("p", { children: description })] }), children: _jsx("div", { className: `status-icon ${size} ${variant} ${active ? "active" : "inactive"}`, children: _jsx("span", { className: "status-icon__glyph", children: icon }) }) }));
}
