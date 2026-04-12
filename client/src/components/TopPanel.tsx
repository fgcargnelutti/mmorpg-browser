type TopPanelProps = {
  title: string;
  locationName: string;
  locationSubtitle: string;
};

export default function TopPanel({
  title,
  locationName,
  locationSubtitle,
}: TopPanelProps) {
  return (
    <div className="world-header">
      <div>
        <h1>{title}</h1>
        <p>
          {locationName} • {locationSubtitle}
        </p>
      </div>
    </div>
  );
}