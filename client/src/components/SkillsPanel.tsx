import Tooltip from "./Tooltip";
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
    <section className="ui-panel skills-panel">
      <div className="panel-title-row">
        <h2>Skills</h2>
      </div>

      <div className="skills-list compact-skills">
        {skills.map((skill) => (
          <div key={skill.key} className="skill-card compact-skill-card">
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

            <div className="skill-specializations-row">
              <div className="skill-tier-inline">
                <span
                  className={`tier-label ${
                    skill.level >= 30 ? "unlocked" : "locked"
                  }`}
                >
                  30
                </span>
                <div className="tier-icons one-line-icons">
                  {skill.tier30.map((spec) => (
                    <Tooltip
                      key={`30-${skill.key}-${spec.title}`}
                      content={
                        <>
                          <strong>{spec.title}</strong>
                          <p>{spec.description}</p>
                        </>
                      }
                    >
                      <div
                        className={`spec-icon ${
                          skill.level >= 30 ? "unlocked" : "locked"
                        }`}
                      >
                        <span>{spec.icon}</span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="skill-tier-inline">
                <span
                  className={`tier-label ${
                    skill.level >= 60 ? "unlocked" : "locked"
                  }`}
                >
                  60
                </span>
                <div className="tier-icons one-line-icons">
                  {skill.tier60.map((spec) => (
                    <Tooltip
                      key={`60-${skill.key}-${spec.title}`}
                      content={
                        <>
                          <strong>{spec.title}</strong>
                          <p>{spec.description}</p>
                        </>
                      }
                    >
                      <div
                        className={`spec-icon ${
                          skill.level >= 60 ? "unlocked" : "locked"
                        }`}
                      >
                        <span>{spec.icon}</span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="skill-tier-inline">
                <span
                  className={`tier-label ${
                    skill.level >= 100 ? "unlocked" : "locked"
                  }`}
                >
                  100
                </span>
                <div className="tier-icons one-line-icons">
                  {skill.tier100.map((spec) => (
                    <Tooltip
                      key={`100-${skill.key}-${spec.title}`}
                      content={
                        <>
                          <strong>{spec.title}</strong>
                          <p>{spec.description}</p>
                        </>
                      }
                    >
                      <div
                        className={`spec-icon ${
                          skill.level >= 100 ? "unlocked" : "locked"
                        }`}
                      >
                        <span>{spec.icon}</span>
                      </div>
                    </Tooltip>
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