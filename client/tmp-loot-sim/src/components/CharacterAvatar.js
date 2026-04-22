import { jsx as _jsx } from "react/jsx-runtime";
import "./CharacterAvatar.css";
export default function CharacterAvatar({ src, alt, size = "md", className = "", }) {
    const resolvedClassName = [
        "character-avatar",
        `character-avatar--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: resolvedClassName, children: _jsx("img", { className: "character-avatar__image", src: src, alt: alt }) }));
}
