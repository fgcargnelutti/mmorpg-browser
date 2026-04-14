import Tooltip from "./Tooltip";
import "./StatusIcon.css";

type StatusIconProps = {
  icon: string;
  label: string;
  description: string;
  active?: boolean;
  variant?: "default" | "buff" | "specialization";
  size?: "sm" | "md" | "lg";
};

export default function StatusIcon({
  icon,
  label,
  description,
  active = true,
  variant = "default",
  size = "md",
}: StatusIconProps) {
  return (
    <Tooltip
      content={
        <>
          <strong>{label}</strong>
          <p>{description}</p>
        </>
      }
    >
      <div
        className={`status-icon ${size} ${variant} ${
          active ? "active" : "inactive"
        }`}
      >
        <span className="status-icon__glyph">{icon}</span>
      </div>
    </Tooltip>
  );
}