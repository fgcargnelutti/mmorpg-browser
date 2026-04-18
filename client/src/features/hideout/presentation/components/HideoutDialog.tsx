import type { DragEvent } from "react";
import GameDialog from "../../../../components/GameDialog";
import type { HideoutStructureKey } from "../../domain/hideoutStructureTypes";
import type { HideoutStorageTransferPayload } from "../../domain/hideoutStorageTypes";
import "./HideoutDialog.css";

type HideoutStructureView = {
  definition: {
    key: HideoutStructureKey;
    name: string;
    description: string;
  };
  progress: {
    level: number;
    state: string;
  };
  eligibility: {
    canUpgrade: boolean;
    reasons: string[];
    nextTier: {
      level: number;
      label: string;
      description: string;
      buildCosts: { itemKey: string; amount: number }[];
      unlockedFunctions?: string[];
    } | null;
  };
};

type HideoutDialogProps = {
  isOpen: boolean;
  hideoutName: string;
  structures: HideoutStructureView[];
  inventoryEntries: Array<{
    itemKey: string;
    name: string;
    iconGlyph: string;
    iconLabel: string;
    count: number;
    description: string;
  }>;
  storageEntries: Array<{
    itemKey: string;
    name: string;
    iconGlyph: string;
    iconLabel: string;
    count: number;
    description: string;
  }>;
  onClose: () => void;
  onUpgrade: (structureKey: HideoutStructureKey) => void;
  onDepositItem: (itemKey: string) => void;
  onWithdrawItem: (itemKey: string) => void;
};

function getActionLabel(level: number) {
  return level === 0 ? "Build" : "Upgrade";
}

export default function HideoutDialog({
  isOpen,
  hideoutName,
  structures,
  inventoryEntries,
  storageEntries,
  onClose,
  onUpgrade,
  onDepositItem,
  onWithdrawItem,
}: HideoutDialogProps) {
  const handleDragStart =
    (payload: HideoutStorageTransferPayload) =>
    (event: DragEvent<HTMLButtonElement>) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "application/howl-of-collapse-transfer",
        JSON.stringify(payload)
      );
    };

  const allowDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDropToStorage = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rawPayload = event.dataTransfer.getData(
      "application/howl-of-collapse-transfer"
    );

    if (!rawPayload) {
      return;
    }

    const payload = JSON.parse(rawPayload) as HideoutStorageTransferPayload;

    if (payload.source !== "inventory") {
      return;
    }

    onDepositItem(payload.itemKey);
  };

  const handleDropToInventory = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rawPayload = event.dataTransfer.getData(
      "application/howl-of-collapse-transfer"
    );

    if (!rawPayload) {
      return;
    }

    const payload = JSON.parse(rawPayload) as HideoutStorageTransferPayload;

    if (payload.source !== "storage") {
      return;
    }

    onWithdrawItem(payload.itemKey);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="hideout-dialog-anchor">
      <GameDialog
        title={`Hideout - ${hideoutName}`}
        subtitle="Expand your camp, unlock future utility, and prepare the outskirts for longer survival."
        onClose={onClose}
      >
        <div className="hideout-dialog-content">
          <section className="hideout-storage-panel">
            <div className="hideout-storage-panel__header">
              <div>
                <h4>Storage Chest</h4>
                <p>
                  Drag resources between your pack and the hideout chest. Gold is
                  stored here separately from item stacks.
                </p>
              </div>
            </div>

            <div className="hideout-storage-transfer">
              <section className="hideout-storage-column">
                <div className="hideout-storage-column__title-row">
                  <strong>Inventory</strong>
                  <span>{inventoryEntries.length} item types</span>
                </div>

                <div
                  className="hideout-storage-dropzone"
                  onDragOver={allowDrop}
                  onDrop={handleDropToInventory}
                >
                  <div className="hideout-storage-grid">
                    {inventoryEntries.length > 0 ? (
                      inventoryEntries.map((entry) => (
                        <button
                          key={`inventory-${entry.itemKey}`}
                          type="button"
                          className="hideout-storage-slot"
                          draggable
                          onDragStart={handleDragStart({
                            itemKey: entry.itemKey,
                            source: "inventory",
                          })}
                          title={`${entry.name} x${entry.count}`}
                        >
                          <span className="hideout-storage-slot__icon">
                            {entry.iconGlyph}
                          </span>
                          <span className="hideout-storage-slot__count">
                            x{entry.count}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="hideout-storage-empty">
                        Your inventory is empty.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="hideout-storage-column">
                <div className="hideout-storage-column__title-row">
                  <strong>Hideout Chest</strong>
                  <span>{storageEntries.length} stored types</span>
                </div>

                <div
                  className="hideout-storage-dropzone"
                  onDragOver={allowDrop}
                  onDrop={handleDropToStorage}
                >
                  <div className="hideout-storage-grid">
                    {storageEntries.length > 0 ? (
                      storageEntries.map((entry) => (
                        <button
                          key={`storage-${entry.itemKey}`}
                          type="button"
                          className="hideout-storage-slot hideout-storage-slot--stored"
                          draggable
                          onDragStart={handleDragStart({
                            itemKey: entry.itemKey,
                            source: "storage",
                          })}
                          title={`${entry.name} x${entry.count}`}
                        >
                          <span className="hideout-storage-slot__icon">
                            {entry.iconGlyph}
                          </span>
                          <span className="hideout-storage-slot__count">
                            x{entry.count}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="hideout-storage-empty">
                        Drop items or gold here to store them.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </section>

          <div className="hideout-dialog-layout">
          {structures.map(({ definition, progress, eligibility }) => (
            <section key={definition.key} className="hideout-card">
              <div className="hideout-card__header">
                <div>
                  <h4>{definition.name}</h4>
                  <p>{definition.description}</p>
                </div>
                <span className="hideout-card__level">Lv. {progress.level}</span>
              </div>

              <div className="hideout-card__body">
                {eligibility.nextTier ? (
                  <>
                    <div className="hideout-card__tier">
                      <strong>{eligibility.nextTier.label}</strong>
                      <span>{eligibility.nextTier.description}</span>
                    </div>

                    <div className="hideout-card__costs">
                      <strong>Build costs</strong>
                      <div className="hideout-card__cost-list">
                        {eligibility.nextTier.buildCosts.map((cost) => (
                          <span key={`${definition.key}-${cost.itemKey}`} className="hideout-cost-chip">
                            {cost.amount}x {cost.itemKey}
                          </span>
                        ))}
                      </div>
                    </div>

                    {eligibility.nextTier.unlockedFunctions?.length ? (
                      <div className="hideout-card__functions">
                        <strong>Future utility</strong>
                        <div className="hideout-card__function-list">
                          {eligibility.nextTier.unlockedFunctions.map((entry) => (
                            <span key={`${definition.key}-${entry}`}>{entry}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {eligibility.reasons.length > 0 ? (
                      <div className="hideout-card__requirements">
                        <strong>Requirements</strong>
                        <div className="hideout-card__requirement-list">
                          {eligibility.reasons.map((reason) => (
                            <span key={`${definition.key}-${reason}`}>{reason}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      className="hideout-card__action"
                      onClick={() => onUpgrade(definition.key)}
                      disabled={!eligibility.canUpgrade}
                    >
                      {getActionLabel(progress.level)} to Lv. {eligibility.nextTier.level}
                    </button>
                  </>
                ) : (
                  <div className="hideout-card__maxed">
                    <strong>Maximum level reached</strong>
                    <span>This structure is fully developed for the current prototype.</span>
                  </div>
                )}
              </div>
            </section>
          ))}
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
