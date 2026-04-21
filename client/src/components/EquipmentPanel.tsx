import Tooltip from "./Tooltip";

type EquipmentSlot = {
  key: string;
  label: string;
  icon: string;
  itemName: string;
  tooltip: string[];
  equipped?: boolean;
};

type EquipmentPanelProps = {
  equipmentRows: EquipmentSlot[][];
};

export default function EquipmentPanel({
  equipmentRows,
}: EquipmentPanelProps) {
  return (
    <section className="ui-panel sidebar-panel sidebar-panel--content equipment-panel">
      <div className="panel-title-row">
        <h2>Equipment</h2>
      </div>

      <div className="equipment-rows">
        {equipmentRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`equipment-row-grid equipment-cols-${row.length}`}
          >
            {row.map((slot) => (
              <Tooltip
                key={slot.key}
                content={
                  <div className="equipment-tooltip-content">
                    <strong>{slot.itemName}</strong>
                    <p>{slot.label}</p>
                    <div className="equipment-tooltip-stats">
                      {slot.tooltip.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                }
              >
                <div key={slot.key} className="equip-slot">
                  <span className="equip-slot-icon">{slot.icon}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
