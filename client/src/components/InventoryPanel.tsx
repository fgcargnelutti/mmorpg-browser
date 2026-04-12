type InventoryItem = {
  name: string;
  count: number;
};

type InventoryPanelProps = {
  items: InventoryItem[];
};

export default function InventoryPanel({ items }: InventoryPanelProps) {
  return (
    <section className="ui-panel inventory-panel">
      <div className="panel-title-row">
        <h2>Inventory</h2>
        <span className="badge">{items.length} types</span>
      </div>

      <div className="inventory-grid">
        {items.length === 0 ? (
          <div className="empty-box">Inventory is empty.</div>
        ) : (
          items.map((item) => (
            <div key={item.name} className="inventory-slot grouped-slot">
              <span className="slot-icon">◼</span>
              <div className="slot-content">
                <span className="slot-label">{item.name}</span>
                <span className="slot-amount">x{item.count}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}