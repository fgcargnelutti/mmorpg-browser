import Tooltip from "./Tooltip";

export type InventoryPanelItem = {
  key: string;
  itemKey: string;
  name: string;
  iconGlyph: string;
  iconLabel: string;
  iconTone: string;
  count: number;
  weight: number;
  description: string;
  stats?: string[];
};

type InventoryPanelProps = {
  items: InventoryPanelItem[];
  currentWeight: number;
  maxWeight: number;
};

export default function InventoryPanel({
  items,
  currentWeight,
  maxWeight,
}: InventoryPanelProps) {
  const visibleSlotCount = Math.max(items.length, 20);
  const emptySlotCount = Math.max(0, visibleSlotCount - items.length);

  return (
    <section className="ui-panel sidebar-panel sidebar-panel--scroll inventory-panel">
      <div className="panel-title-row inventory-title-row">
        <h2>Inventory</h2>
        <span className="inventory-weight">
          Weight ({currentWeight}/{maxWeight}Kg)
        </span>
      </div>

      <div className="inventory-grid inventory-grid-slots">
        {items.length === 0 ? (
          <div className="inventory-empty-copy">Inventory is empty.</div>
        ) : (
          items.map((item) => (
            <Tooltip
              key={item.key}
              content={
                <>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <ul>
                    <li>Weight: {item.weight}Kg each</li>
                    <li>Total: {(item.weight * item.count).toFixed(1)}Kg</li>
                    {item.stats?.map((stat) => <li key={stat}>{stat}</li>)}
                  </ul>
                </>
              }
            >
              <div
                className={`inventory-slot inventory-square-slot inventory-square-slot--${item.iconTone}`}
                aria-label={`${item.name}, quantity ${item.count}`}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData(
                    "application/howl-of-collapse-trade-item",
                    JSON.stringify({
                      itemKey: item.itemKey,
                      count: item.count,
                    })
                  );
                }}
              >
                <span
                  className="inventory-item-icon"
                  aria-hidden="true"
                  title={item.iconLabel}
                >
                  {item.iconGlyph}
                </span>
                <span className="inventory-item-name">{item.name}</span>
                <span className="inventory-item-count">x{item.count}</span>
              </div>
            </Tooltip>
          ))
        )}

        {Array.from({ length: emptySlotCount }).map((_, index) => (
          <div
            key={`empty-slot-${index}`}
            className="inventory-slot inventory-square-slot inventory-square-slot--empty"
            aria-hidden="true"
          >
            <span className="inventory-slot-placeholder" />
          </div>
        ))}
      </div>
    </section>
  );
}
