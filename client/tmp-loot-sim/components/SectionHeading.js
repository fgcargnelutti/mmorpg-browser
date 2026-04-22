import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./SectionHeading.css";
export default function SectionHeading({ title, description, aside, className = "", }) {
    const rootClassName = ["section-heading", className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: rootClassName, children: [_jsxs("div", { className: "section-heading__content", children: [_jsx("strong", { className: "section-heading__title", children: title }), description ? (_jsx("p", { className: "section-heading__description", children: description })) : null] }), aside ? _jsx("div", { className: "section-heading__aside", children: aside }) : null] }));
}
