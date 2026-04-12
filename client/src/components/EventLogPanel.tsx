type EventLogPanelProps = {
  logs: string[];
};

export default function EventLogPanel({ logs }: EventLogPanelProps) {
  return (
    <section className="ui-panel bottom-box event-log-panel">
      <div className="panel-title-row">
        <h2>Event Log</h2>
      </div>

      <div className="scroll-box event-log-scroll">
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