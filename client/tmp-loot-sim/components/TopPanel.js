import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function TopPanel({ locationName, locationSubtitle, worldStatus = [], stats = [], rightContent, }) {
    return (_jsxs("header", { className: "top-panel", children: [_jsxs("div", { className: "top-left", children: [_jsx("span", { className: "location-name", children: locationName }), locationSubtitle ? (_jsx("span", { className: "location-subtitle", children: locationSubtitle })) : null] }), _jsx("div", { className: "top-center", children: stats.length > 0 ? (_jsx("div", { className: "top-stats", children: stats.map((stat) => {
                        const width = stat.max > 0
                            ? Math.max(0, Math.min(100, (stat.value / stat.max) * 100))
                            : 0;
                        return (_jsxs("div", { className: "top-stat-block", children: [_jsxs("div", { className: "top-stat-label-row", children: [_jsx("span", { className: "top-stat-label", children: stat.label }), _jsxs("strong", { className: "top-stat-value", children: [stat.value, "/", stat.max] })] }), _jsx("div", { className: "top-stat-bar-shell", children: _jsx("div", { className: `top-stat-bar-fill ${stat.className}`, style: { width: `${width}%` } }) })] }, stat.label));
                    }) })) : null }), _jsx("div", { className: "top-right", children: rightContent ??
                    worldStatus.map((status) => (_jsx("span", { className: "world-status-chip", children: status }, status))) })] }));
}
