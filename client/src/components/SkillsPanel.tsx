import Tooltip from "./Tooltip";
import StatusIcon from "./StatusIcon";
import { getUnlockedSkillSpecializations } from "../features/specializations";
import type { CharacterSkillSummary } from "../features/progression";
import type { CharacterSpecializationProgressState } from "../features/specializations";
import "./SkillsPanel.css";

type SkillsPanelProps = {
  skills: CharacterSkillSummary[];
  specializationProgress: CharacterSpecializationProgressState;
};

export default function SkillsPanel({
  skills,
  specializationProgress,
}: SkillsPanelProps) {
  return (
    <section className="ui-panel ornate-panel ornate-corners sidebar-panel sidebar-panel--scroll skills-panel">
      <div className="panel-title-row ornate-header">
        <h2>Skills</h2>
      </div>

      <div className="skills-list">
        {skills.map((skill) => (
          <div key={skill.key} className="skill-card ornate-divider">
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

            {getUnlockedSkillSpecializations(skill, specializationProgress).length > 0 ? (
              <div className="skill-tiers-grid">
                {getUnlockedSkillSpecializations(skill, specializationProgress).map((group) => (
                  <div key={`${skill.key}-${group.tier}`} className="skill-tier-block">
                    <div className="skill-tier-header">
                      <span className="tier-label unlocked">Tier {group.tier}</span>
                    </div>

                    <div className="tier-icons">
                      {group.items.map((spec) => (
                        <StatusIcon
                          key={`${group.tier}-${skill.key}-${spec.title}`}
                          icon={spec.icon}
                          label={spec.title}
                          description={spec.description}
                          active={true}
                          variant="specialization"
                          size="md"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
