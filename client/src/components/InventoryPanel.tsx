import { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";

export type InventoryPanelItem = {
  key: string;
  itemKey: string;
  name: string;
  iconGlyph: string;
  iconImageSrc?: string;
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

const defaultInventoryHeight = 430;
const minInventoryHeight = 320;
const maxInventoryHeight = 720;

export default function InventoryPanel({
  items,
  currentWeight,
  maxWeight,
}: InventoryPanelProps) {
  const visibleSlotCount = Math.max(items.length, 20);
  const emptySlotCount = Math.max(0, visibleSlotCount - items.length);
  const [panelHeight, setPanelHeight] = useState(defaultInventoryHeight);
  const resizeStateRef = useRef<{
    pointerId: number;
    startY: number;
    startHeight: number;
  } | null>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const resizeState = resizeStateRef.current;

      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      const nextHeight = Math.max(
        minInventoryHeight,
        Math.min(
          maxInventoryHeight,
          resizeState.startHeight + (event.clientY - resizeState.startY)
        )
      );

      setPanelHeight(nextHeight);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (resizeStateRef.current?.pointerId !== event.pointerId) {
        return;
      }

      resizeStateRef.current = null;
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.userSelect = "";
    };
  }, []);

  const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    resizeStateRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: panelHeight,
    };
    document.body.style.userSelect = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <section
      className="ui-panel ornate-panel ornate-corners sidebar-panel sidebar-panel--scroll inventory-panel"
      style={{ minHeight: `${panelHeight}px` }}
    >
      <div className="panel-title-row inventory-title-row ornate-header">
        <h2>Inventory</h2>
        <span className="inventory-weight">
          Weight ({currentWeight}/{maxWeight}Kg)
        </span>
      </div>

      <div className="inventory-panel__body">
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
                  className={`inventory-slot inventory-square-slot ornate-slot inventory-square-slot--${item.iconTone}`}
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
                  {item.iconImageSrc ? (
                    <img
                      className="inventory-item-image"
                      src={item.iconImageSrc}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="inventory-item-icon"
                      aria-hidden="true"
                      title={item.iconLabel}
                    >
                      {item.iconGlyph}
                    </span>
                  )}
                  <span className="inventory-item-count">x{item.count}</span>
                </div>
              </Tooltip>
            ))
          )}

          {Array.from({ length: emptySlotCount }).map((_, index) => (
            <div
              key={`empty-slot-${index}`}
              className="inventory-slot inventory-square-slot ornate-slot inventory-square-slot--empty"
              aria-hidden="true"
            >
              <span className="inventory-slot-placeholder" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="inventory-resize-handle"
        aria-label="Resize inventory panel"
        onPointerDown={handleResizeStart}
      />
    </section>
  );
}
