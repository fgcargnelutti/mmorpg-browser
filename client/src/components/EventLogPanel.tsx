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

  return (
    <section className="ui-panel bottom-box event-log-panel">
      <div className="panel-title-row">
        <h2>Event Log</h2>
      </div>

      <div ref={scrollRef} className="scroll-box event-log-scroll">
        {logs.length === 0 ? (
          <div className="empty-box">No events yet.</div>
        ) : (
          logs.map((log, index) => (
            <div key={`${log}-${index}`} className="log-line">
              {log}
            </div>
          ))
        )}
      </div>
    </section>
  );
}