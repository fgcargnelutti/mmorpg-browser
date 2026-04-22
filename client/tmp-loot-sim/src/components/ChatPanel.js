import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
function getMessageClass(message) {
    if (message.content.startsWith("You:")) {
        return "chat-message chat-message--player";
    }
    if (message.content.startsWith("NPC")) {
        return "chat-message chat-message--npc";
    }
    return "chat-message chat-message--other";
}
export default function ChatPanel({ messages, inputValue, onInputChange, onSend, }) {
    const scrollRef = useRef(null);
    useEffect(() => {
        if (!scrollRef.current)
            return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);
    return (_jsxs("section", { className: "ui-panel chat-panel", children: [_jsx("div", { className: "panel-title-row", children: _jsx("h2", { children: "Chat" }) }), _jsx("div", { ref: scrollRef, className: "chat-messages", children: messages.map((message, index) => (_jsxs("div", { className: getMessageClass(message), children: [_jsx("span", { className: "chat-message__timestamp", children: message.timestamp }), " ", _jsx("span", { className: "chat-message__content", children: message.content })] }, `${message}-${index}`))) }), _jsxs("div", { className: "chat-input-row", children: [_jsx("input", { className: "chat-input", type: "text", value: inputValue, onChange: (event) => onInputChange(event.target.value.slice(0, 200)), placeholder: "Say something to the wasteland...", maxLength: 200, onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                onSend();
                            }
                        } }), _jsx("button", { className: "chat-send-button", type: "button", onClick: onSend, children: "Send" })] })] }));
}
