import type { ReactNode } from "react";
import "./SectionHeading.css";

type SectionHeadingProps = {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  title,
  description,
  aside,
  className = "",
}: SectionHeadingProps) {
  const rootClassName = ["section-heading", "game-section-heading", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="section-heading__content">
        <strong className="section-heading__title game-section-title">
          {title}
        </strong>
        {description ? (
          <p className="section-heading__description game-section-description">
            {description}
          </p>
        ) : null}
      </div>
      {aside ? <div className="section-heading__aside">{aside}</div> : null}
    </div>
  );
}
