import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export default function EventLogPanel({ logs }) {
    const scrollRef = useRef(null);
    useEffect(() => {
        if (!scrollRef.current)
            return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [logs]);
    const formatEventLogLine = (log) => log.startsWith("System: ") ? log.slice("System: ".length) : log;
    const getLogLineClassName = (log) => {
        const normalizedLog = log.toLowerCase();
        const isExperienceEvent = normalizedLog.includes("you gained") || normalizedLog.includes("level up");
        const isDiscoveryEvent = normalizedLog.includes("you learned") ||
            normalizedLog.includes("you discovered") ||
            normalizedLog.includes("you noticed") ||
            normalizedLog.includes("you uncovered");
        return [
            "log-line",
            isDiscoveryEvent ? "log-line--discovery" : "",
            isExperienceEvent ? "log-line--experience" : "",
        ]
            .filter(Boolean)
            .join(" ");
    };
    return (_jsxs("section", { className: "ui-panel bottom-box event-log-panel", children: [_jsx("div", { className: "panel-title-row", children: _jsx("h2", { children: "Event Log" }) }), _jsx("div", { ref: scrollRef, className: "scroll-box event-log-scroll", children: logs.length === 0 ? (_jsx("div", { className: "empty-box", children: "No events yet." })) : (logs.map((log, index) => (_jsx("div", { className: getLogLineClassName(log), children: formatEventLogLine(log) }, `${log}-${index}`)))) })] }));
}
