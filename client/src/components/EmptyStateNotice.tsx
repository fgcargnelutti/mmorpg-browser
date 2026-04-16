import type { ReactNode } from "react";
import "./EmptyStateNotice.css";

type EmptyStateNoticeProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export default function EmptyStateNotice({
  title,
  description,
  className = "",
}: EmptyStateNoticeProps) {
  const rootClassName = ["empty-state-notice", className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      <strong className="empty-state-notice__title">{title}</strong>
      {description ? (
        <p className="empty-state-notice__description">{description}</p>
      ) : null}
    </div>
  );
}
