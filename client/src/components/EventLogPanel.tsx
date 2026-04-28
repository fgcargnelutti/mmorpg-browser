import { useEffect, useRef } from "react";

type EventLogPanelProps = {
  logs: string[];
};

export default function EventLogPanel({ logs }: EventLogPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const formatEventLogLine = (log: string) =>
    log.startsWith("System: ") ? log.slice("System: ".length) : log;

  const getLogLineClassName = (log: string) => {
    const normalizedLog = log.toLowerCase();
    const isExperienceEvent =
      normalizedLog.includes("you gained") || normalizedLog.includes("level up");
    const isDiscoveryEvent =
      normalizedLog.includes("you learned") ||
      normalizedLog.includes("you discovered") ||
      normalizedLog.includes("you noticed") ||
      normalizedLog.includes("you uncovered");

    return [
      "log-line",
      isDiscoveryEvent ? "log-line--discovery" : "",
      isExperienceEvent ? "log-line--experience" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <section className="ui-panel ornate-panel ornate-corners bottom-box event-log-panel">
      <div className="panel-title-row ornate-header">
        <h2>Event Log</h2>
      </div>

      <div ref={scrollRef} className="scroll-box event-log-scroll">
        {logs.length === 0 ? (
          <div className="empty-box">No events yet.</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={`${log}-${index}`}
              className={`${getLogLineClassName(log)} ornate-slot`}
            >
              {formatEventLogLine(log)}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
