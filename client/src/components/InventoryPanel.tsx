import Tooltip from "./Tooltip";

type InventoryItem = {
  key: string;
  name: string;
  icon: string;
  count: number;
  weight: number;
  description: string;
  stats?: string[];
};

type InventoryPanelProps = {
  items: InventoryItem[];
  currentWeight: number;
  maxWeight: number;
};

export default function InventoryPanel({
  items,
  currentWeight,
  maxWeight,
}: InventoryPanelProps) {
  return (
    <section className="ui-panel inventory-panel">
      <div className="panel-title-row inventory-title-row">
        <h2>Inventory</h2>
        <span className="inventory-weight">
          Weight ({currentWeight}/{maxWeight}Kg)
        </span>
      </div>

      <div className="inventory-grid inventory-grid-slots">
        {items.length === 0 ? (
          <div className="empty-box">Inventory is empty.</div>
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
              <div className="inventory-slot inventory-square-slot">
                <span className="inventory-item-icon">{item.icon}</span>
                <span className="inventory-item-count">x{item.count}</span>
              </div>
            </Tooltip>
          ))
        )}
      </div>
    </section>
  );
}