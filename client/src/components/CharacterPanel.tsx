type Condition = {
  key: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
};

type Stat = {
  label: string;
  value: number;
  max: number;
  className: string;
};

type CharacterPanelProps = {
  level: number;
  name: string;
  characterClass: string;
  stats: Stat[];
  conditions: Condition[];
};

export default function CharacterPanel({
  level,
  name,
  characterClass,
  stats,
  conditions,
}: CharacterPanelProps) {
  return (
    <section className="ui-panel character-panel no-scroll-panel">
      <div className="character-topline">
        <span className="char-level">Level {level}</span>
      </div>

      <div className="char-name">{name}</div>
      <div className="char-subtitle">{characterClass}</div>

      <div className="bars-stack">
        {stats.map((stat) => {
          const width = (stat.value / stat.max) * 100;

          return (
            <div key={stat.label} className="status-block">
              <div className="status-label-row">
                <span>{stat.label}</span>
                <strong>
                  {stat.value}/{stat.max}
                </strong>
              </div>

              <div className="status-bar-shell">
                <div
                  className={`status-bar-fill ${stat.className}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="conditions-section">
        <div className="conditions-label">Conditions</div>
        <div className="conditions-row">
          {conditions.map((condition) => (
            <div
              key={condition.key}
              className={`condition-icon ${condition.active ? "active" : "inactive"}`}
            >
              <span>{condition.icon}</span>

              <div className="inline-tooltip tooltip-small">
                <strong>{condition.label}</strong>
                <p>{condition.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}