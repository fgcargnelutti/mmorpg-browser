import Tooltip from "./Tooltip";
import StatusIcon from "./StatusIcon";
import "./SkillsPanel.css";

type Specialization = {
  icon: string;
  title: string;
  description: string;
};

type Skill = {
  key: string;
  name: string;
  level: number;
  progress: number;
  tooltip: string;
  tier30: Specialization[];
  tier60: Specialization[];
  tier100: Specialization[];
};

type SkillsPanelProps = {
  skills: Skill[];
};

export default function SkillsPanel({ skills }: SkillsPanelProps) {
  return (
    <section className="ui-panel sidebar-panel sidebar-panel--scroll skills-panel">
      <div className="panel-title-row">
        <h2>Skills</h2>
      </div>

      <div className="skills-list">
        {skills.map((skill) => (
          <div key={skill.key} className="skill-card">
            <div className="skill-main-row">
              <Tooltip
                content={
                  <>
                    <strong>{skill.name}</strong>
                    <p>{skill.tooltip}</p>
                  </>
                }
              >
                <span className="skill-name">{skill.name}</span>
              </Tooltip>

              <span className="skill-level">Lv. {skill.level}</span>
              <strong className="skill-value">{skill.progress}%</strong>
            </div>

            <div className="skill-tiers-grid">
              <div className="skill-tier-block">
                <div className="skill-tier-header">
                  <span
                    className={`tier-label ${
                      skill.level >= 30 ? "unlocked" : "locked"
                    }`}
                  >
                    Tier 30
                  </span>
                </div>

                <div className="tier-icons">
                  {skill.tier30.map((spec) => (
                    <StatusIcon
                      key={`30-${skill.key}-${spec.title}`}
                      icon={spec.icon}
                      label={spec.title}
                      description={spec.description}
                      active={skill.level >= 30}
                      variant="specialization"
                      size="md"
                    />
                  ))}
                </div>
              </div>

              <div className="skill-tier-block">
                <div className="skill-tier-header">
                  <span
                    className={`tier-label ${
                      skill.level >= 60 ? "unlocked" : "locked"
                    }`}
                  >
                    Tier 60
                  </span>
                </div>

                <div className="tier-icons">
                  {skill.tier60.map((spec) => (
                    <StatusIcon
                      key={`60-${skill.key}-${spec.title}`}
                      icon={spec.icon}
                      label={spec.title}
                      description={spec.description}
                      active={skill.level >= 60}
                      variant="specialization"
                      size="md"
                    />
                  ))}
                </div>
              </div>

              <div className="skill-tier-block">
                <div className="skill-tier-header">
                  <span
                    className={`tier-label ${
                      skill.level >= 100 ? "unlocked" : "locked"
                    }`}
                  >
                    Tier 100
                  </span>
                </div>

                <div className="tier-icons">
                  {skill.tier100.map((spec) => (
                    <StatusIcon
                      key={`100-${skill.key}-${spec.title}`}
                      icon={spec.icon}
                      label={spec.title}
                      description={spec.description}
                      active={skill.level >= 100}
                      variant="specialization"
                      size="md"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
