import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";
export default function Tooltip({ content, children }) {
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current)
            return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 12;
        const gap = 8;
        const roomAbove = triggerRect.top;
        const roomBelow = viewportHeight - triggerRect.bottom;
        let top;
        if (roomBelow >= tooltipRect.height + gap + margin) {
            top = triggerRect.bottom + gap;
        }
        else if (roomAbove >= tooltipRect.height + gap + margin) {
            top = triggerRect.top - tooltipRect.height - gap;
        }
        else {
            top = Math.max(margin, Math.min(triggerRect.bottom + gap, viewportHeight - tooltipRect.height - margin));
        }
        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        if (left < margin) {
            left = margin;
        }
        if (left + tooltipRect.width > viewportWidth - margin) {
            left = viewportWidth - tooltipRect.width - margin;
        }
        tooltipRef.current.style.top = `${top}px`;
        tooltipRef.current.style.left = `${left}px`;
    };
    useLayoutEffect(() => {
        if (!isOpen)
            return;
        updatePosition();
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleUpdate = () => updatePosition();
        window.addEventListener("resize", handleUpdate);
        window.addEventListener("scroll", handleUpdate, true);
        return () => {
            window.removeEventListener("resize", handleUpdate);
            window.removeEventListener("scroll", handleUpdate, true);
        };
    }, [isOpen]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: triggerRef, className: "portal-tooltip-trigger", onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false), children: children }), isOpen &&
                createPortal(_jsx("div", { ref: tooltipRef, className: "portal-tooltip", style: { top: "0px", left: "0px" }, children: content }), document.body)] }));
}
