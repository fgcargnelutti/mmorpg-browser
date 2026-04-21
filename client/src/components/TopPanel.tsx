import type { ReactNode } from "react";

type Stat = {
  label: string;
  value: number;
  max: number;
  className: string;
};

type TopPanelProps = {
  locationName: string;
  locationSubtitle: string;
  worldStatus?: string[];
  stats?: Stat[];
  rightContent?: ReactNode;
};

export default function TopPanel({
  locationName,
  locationSubtitle,
  worldStatus = [],
  stats = [],
  rightContent,
}: TopPanelProps) {
  return (
    <header className="top-panel">
      <div className="top-left">
        <span className="location-name">{locationName}</span>
        {locationSubtitle ? (
          <span className="location-subtitle">{locationSubtitle}</span>
        ) : null}
      </div>

      <div className="top-center">
        {stats.length > 0 ? (
          <div className="top-stats">
            {stats.map((stat) => {
              const width =
                stat.max > 0
                  ? Math.max(0, Math.min(100, (stat.value / stat.max) * 100))
                  : 0;

              return (
                <div key={stat.label} className="top-stat-block">
                  <div className="top-stat-label-row">
                    <span className="top-stat-label">{stat.label}</span>
                    <strong className="top-stat-value">
                      {stat.value}/{stat.max}
                    </strong>
                  </div>

                  <div className="top-stat-bar-shell">
                    <div
                      className={`top-stat-bar-fill ${stat.className}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="top-right">
        {rightContent ??
          worldStatus.map((status) => (
            <span key={status} className="world-status-chip">
              {status}
            </span>
          ))}
      </div>
    </header>
  );
}
