import StatusIcon from "./StatusIcon";
import CharacterAvatar from "./CharacterAvatar";

type Condition = {
  key: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
};

type ActiveBuff = {
  key: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
};

type CharacterPanelProps = {
  level: number;
  xpText: string;
  name: string;
  characterClass: string;
  avatarSrc: string;
  avatarAlt: string;
  conditions: Condition[];
  buffs: ActiveBuff[];
};

export default function CharacterPanel({
  level,
  xpText,
  name,
  characterClass,
  avatarSrc,
  avatarAlt,
  conditions,
  buffs,
}: CharacterPanelProps) {
  return (
    <section className="ui-panel sidebar-panel sidebar-panel--content character-panel">
      <div className="character-panel-header">
        <CharacterAvatar src={avatarSrc} alt={avatarAlt} size="md" />

        <div className="character-panel-header__identity">
          <div className="char-name">{name}</div>
          <div className="char-subtitle">{characterClass}</div>
        </div>
      </div>

      <div className="character-progress-section">
        <div className="character-progress-value">
          <span className="character-progress-level">Level {level}</span>
          <span className="character-progress-separator">•</span>
          <span className="character-progress-xp">{xpText}</span>
        </div>
      </div>

      <div className="conditions-section">
        <div className="conditions-label">Conditions</div>
        <div className="conditions-row">
          {conditions.map((condition) => (
            <StatusIcon
              key={condition.key}
              icon={condition.icon}
              label={condition.label}
              description={condition.description}
              active={condition.active}
              variant="default"
              size="md"
            />
          ))}
        </div>
      </div>

      <div className="buffs-section">
        <div className="buffs-label">Active Buffs</div>
        <div className="buffs-row">
          {buffs.map((buff) => (
            <StatusIcon
              key={buff.key}
              icon={buff.icon}
              label={buff.label}
              description={buff.description}
              active={buff.active}
              variant="buff"
              size="md"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
