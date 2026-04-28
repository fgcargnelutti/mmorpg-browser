import Tooltip from "./Tooltip";

type EquipmentSlot = {
  key: string;
  label: string;
  icon: string;
  iconImageSrc?: string;
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
    <section className="ui-panel ornate-panel ornate-corners sidebar-panel sidebar-panel--content equipment-panel">
      <div className="panel-title-row ornate-header">
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
                <div key={slot.key} className="equip-slot ornate-slot">
                  {slot.iconImageSrc ? (
                    <img
                      className="equip-slot-image"
                      src={slot.iconImageSrc}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="equip-slot-icon">{slot.icon}</span>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
