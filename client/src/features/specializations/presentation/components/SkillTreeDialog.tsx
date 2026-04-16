import { useMemo, useState } from "react";
import GameDialog from "../../../../components/GameDialog";
import StatusIcon from "../../../../components/StatusIcon";
import type { CharacterSkillSummary } from "../../../progression";
import { skillTreesData } from "../../domain/skillTreesData";
import { resolveSkillTreeNodeState } from "../../application/systems/specializationProgressSystem";
import type {
  TalentTreeSnapshot,
} from "../../domain/talentTreeTypes";
import type { CharacterSpecializationProgressState } from "../../domain/skillTreeTypes";
import "./SkillTreeDialog.css";

type SkillTreeDialogProps = {
  isOpen: boolean;
  characterLevel: number;
  skills: CharacterSkillSummary[];
  specializationProgress: CharacterSpecializationProgressState;
  talentTrees: TalentTreeSnapshot[];
  talentPointsEarned: number;
  talentPointsSpent: number;
  talentPointsAvailable: number;
  onClose: () => void;
  onUnlockTalent: (nodeKey: string) => void;
  onSelectSpecialization: (skillKey: CharacterSkillSummary["key"], nodeKey: string) => void;
};

type SkillTreeTab = "talents" | "specializations";

function formatTierLabel(tier: 30 | 60 | 100) {
  return `Level ${tier}`;
}

export default function SkillTreeDialog({
  isOpen,
  characterLevel,
  skills,
  specializationProgress,
  talentTrees,
  talentPointsEarned,
  talentPointsSpent,
  talentPointsAvailable,
  onClose,
  onUnlockTalent,
  onSelectSpecialization,
}: SkillTreeDialogProps) {
  const [activeTab, setActiveTab] = useState<SkillTreeTab>("talents");

  const specializationRows = useMemo(
    () =>
      skills.map((skill) => ({
        skill,
        tree: skillTreesData[skill.key],
        nodes: skillTreesData[skill.key].nodes.map((node) => ({
          ...node,
          state: resolveSkillTreeNodeState(node, skill, specializationProgress),
        })),
      })),
    [skills, specializationProgress]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="skill-tree-dialog-anchor">
      <GameDialog
        title="Skill Tree"
        subtitle="Shape your character through level-based talents and learn-by-doing specializations."
        onClose={onClose}
      >
        <div className="skill-tree-dialog">
          <div className="skill-tree-tabs">
            <button
              type="button"
              className={`skill-tree-tab${activeTab === "talents" ? " is-active" : ""}`}
              onClick={() => setActiveTab("talents")}
            >
              Talents
            </button>
            <button
              type="button"
              className={`skill-tree-tab${activeTab === "specializations" ? " is-active" : ""}`}
              onClick={() => setActiveTab("specializations")}
            >
              Specializations
            </button>
          </div>

          {activeTab === "talents" ? (
            <div className="skill-tree-content">
              <div className="skill-tree-summary">
                <div className="skill-tree-summary__item">
                  <span>Character Level</span>
                  <strong>{characterLevel}</strong>
                </div>
                <div className="skill-tree-summary__item">
                  <span>Talent Points Earned</span>
                  <strong>{talentPointsEarned}</strong>
                </div>
                <div className="skill-tree-summary__item">
                  <span>Points Spent</span>
                  <strong>{talentPointsSpent}</strong>
                </div>
                <div className="skill-tree-summary__item">
                  <span>Available Now</span>
                  <strong>{talentPointsAvailable}</strong>
                </div>
              </div>

              <div className="skill-tree-talents">
                {talentTrees.map(({ archetype, nodes }) => (
                  <section key={archetype.key} className="talent-branch">
                    <div className="talent-branch__header">
                      <h4>{archetype.label}</h4>
                      <p>{archetype.description}</p>
                    </div>

                    <div className="talent-branch__grid">
                      {nodes.map((node) => (
                        <button
                          key={node.key}
                          type="button"
                          className={`talent-node talent-node--${node.state}`}
                          style={{
                            gridColumn: node.gridColumn,
                            gridRow: node.gridRow,
                          }}
                          onClick={() => onUnlockTalent(node.key)}
                          disabled={node.state !== "unlockable"}
                        >
                          <strong>{node.title}</strong>
                          <span>{node.description}</span>
                          <small>
                            {node.state === "unlocked"
                              ? "Unlocked"
                              : node.state === "unlockable"
                                ? "Spend 1 point"
                                : `Requires Lv. ${node.unlockLevel}`}
                          </small>
                        </button>
                      ))}

                      <div className="talent-link talent-link--left" aria-hidden="true" />
                      <div className="talent-link talent-link--right" aria-hidden="true" />
                      <div className="talent-link talent-link--down" aria-hidden="true" />
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <div className="skill-tree-content">
              <div className="skill-tree-specializations">
                <div className="specialization-table specialization-table--header">
                  <div>Skill</div>
                  <div>{formatTierLabel(30)}</div>
                  <div>{formatTierLabel(60)}</div>
                  <div>{formatTierLabel(100)}</div>
                </div>

                {specializationRows.map(({ skill, tree, nodes: skillNodes }) => (
                  <div key={skill.key} className="specialization-table specialization-table--row">
                    <div className="specialization-skill-cell">
                      <strong>{skill.name}</strong>
                      <span>{tree.tooltip}</span>
                    </div>

                    {[30, 60, 100].map((tier) => {
                      const nodes = skillNodes.filter((node) => node.tier === tier);

                      return (
                        <div
                          key={`${skill.key}-${tier}`}
                          className={`specialization-tier-cell${
                            nodes.some((node) => node.state === "selected")
                              ? " is-selected"
                              : nodes.some((node) => node.state === "unlockable")
                                ? " is-unlockable"
                                : skill.level >= tier
                                  ? " is-unlocked"
                                  : ""
                          }`}
                        >
                          <div className="specialization-tier-cell__label">
                            {nodes.some((node) => node.state === "selected")
                              ? "Chosen"
                              : nodes.some((node) => node.state === "unlockable")
                                ? "Choose 1"
                                : skill.level >= tier
                                  ? "Available"
                                  : `Requires Lv. ${tier}`}
                          </div>
                          <div className="specialization-tier-cell__icons">
                            {nodes.map((node) => (
                              <button
                                key={node.key}
                                type="button"
                                className={`skill-tree-specialization-choice skill-tree-specialization-choice--${node.state}`}
                                onClick={() => onSelectSpecialization(skill.key, node.key)}
                                disabled={node.state !== "unlockable"}
                              >
                                <StatusIcon
                                  icon={node.icon}
                                  label={node.title}
                                  description={node.description}
                                  active={node.state !== "locked"}
                                  variant="specialization"
                                  size="md"
                                />
                                <span>{node.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="skill-tree-note">
                <strong>Current quick view</strong>
                <p>
                  The compact Skills panel only shows specializations you already own. Use this
                  complete window to inspect every future branch.
                </p>
              </div>
            </div>
          )}
        </div>
      </GameDialog>
    </div>
  );
}
