import type { ReactNode } from "react";
import Tooltip from "./Tooltip";
import "./SideNavRail.css";

export type SideNavRailItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  tooltipDescription?: string;
};

type SideNavRailProps = {
  items: SideNavRailItem[];
  footerItem?: SideNavRailItem;
};

function SideNavRailIconHome() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <path
        d="M4 11.4 12 5l8 6.4V20a1 1 0 0 1-1 1h-4.5v-5.3h-5V21H5a1 1 0 0 1-1-1z"
        fill="currentColor"
        opacity="0.96"
      />
      <path
        d="M2.8 11.2 12 3.8l9.2 7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SideNavRailIconSkillTree() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <circle cx="7" cy="6.5" r="2.1" fill="currentColor" />
      <circle cx="17" cy="6.5" r="2.1" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="17.5" r="2.2" fill="currentColor" opacity="0.96" />
      <path
        d="M8.9 7.4 10.8 15M15.1 7.4 13.2 15M9.1 6.7h5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SideNavRailIconBestiary() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <path
        d="M6 5.5h8.2c2.1 0 3.8 1.7 3.8 3.8v9.2H9.8C7.7 18.5 6 20.2 6 22.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M18 18.5H9.8A3.8 3.8 0 0 0 6 22.3V9.3c0-2.1 1.7-3.8 3.8-3.8H18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11 9.3c1.6.1 2.9 1.2 3.4 2.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="15.4" cy="12.7" r="1.4" fill="currentColor" />
    </svg>
  );
}

function SideNavRailIconQuests() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <path
        d="M7 4.8h7.4c1.9 0 3.6 1.5 3.6 3.5v10.5H9.6C8.2 18.8 7 20 7 21.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 6.2H5.8A1.8 1.8 0 0 0 4 8v10.8c0-1.5 1.2-2.7 2.8-2.7H18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 9.2h5.8M9.5 12.2h5.2M9.5 15.2h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SideNavRailIconWorldMap() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="7.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 4.2c2.1 2.2 3.2 4.9 3.2 7.8s-1.1 5.6-3.2 7.8c-2.1-2.2-3.2-4.9-3.2-7.8s1.1-5.6 3.2-7.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.1h14M5 14.9h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SideNavRailIconDisconnect() {
  return (
    <svg viewBox="0 0 24 24" className="side-nav-rail__svg" aria-hidden="true">
      <path
        d="M10 4.8H7.8A2.8 2.8 0 0 0 5 7.6v8.8a2.8 2.8 0 0 0 2.8 2.8H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8.2 18 12l-5 3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 12H18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const sideNavIcons = {
  bestiary: <SideNavRailIconBestiary />,
  disconnect: <SideNavRailIconDisconnect />,
  hideout: <SideNavRailIconHome />,
  quests: <SideNavRailIconQuests />,
  skillTree: <SideNavRailIconSkillTree />,
  worldMap: <SideNavRailIconWorldMap />,
};

function renderRailItem(item: SideNavRailItem) {
  const buttonClassName = [
    "side-nav-rail__button",
    item.isActive ? "side-nav-rail__button--active" : "",
    item.isDisabled ? "side-nav-rail__button--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const button = (
    <button
      key={item.id}
      type="button"
      className={buttonClassName}
      onClick={item.onClick}
      aria-label={item.label}
      aria-pressed={item.isActive ? true : undefined}
      disabled={item.isDisabled}
    >
      <span className="side-nav-rail__icon">{item.icon}</span>
    </button>
  );

  const tooltipContent = (
    <div className="side-nav-rail__tooltip">
      <strong>{item.label}</strong>
      {item.tooltipDescription ? <p>{item.tooltipDescription}</p> : null}
    </div>
  );

  return (
    <Tooltip key={item.id} content={tooltipContent}>
      {button}
    </Tooltip>
  );
}

export default function SideNavRail({ items, footerItem }: SideNavRailProps) {
  return (
    <aside className="side-nav-rail ui-panel" aria-label="Game navigation">
      <div className="side-nav-rail__main">{items.map(renderRailItem)}</div>
      {footerItem ? (
        <div className="side-nav-rail__footer">{renderRailItem(footerItem)}</div>
      ) : null}
    </aside>
  );
}
