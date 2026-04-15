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
              <div key={slot.key} className="equip-slot">
                <span className="equip-slot-icon">{slot.icon}</span>

                <div className="inline-tooltip equip-tooltip">
                  <strong>{slot.itemName}</strong>
                  <p>{slot.label}</p>
                  <ul>
                    {slot.tooltip.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
