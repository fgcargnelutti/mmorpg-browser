type TopPanelProps = {
  locationName: string;
  locationSubtitle: string;
  worldStatus?: string[];
};

export default function TopPanel({
  locationName,
  locationSubtitle,
  worldStatus = [],
}: TopPanelProps) {
  return (
    <header className="top-panel">
      <div className="top-left">
        <span className="location-name">{locationName}</span>
        <span className="location-subtitle">{locationSubtitle}</span>
      </div>

      <div className="top-right">
        {worldStatus.length > 0 &&
          worldStatus.map((status, index) => (
            <span key={index} className="world-status">
              {status}
            </span>
          ))}
      </div>
    </header>
  );
}