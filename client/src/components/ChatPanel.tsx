type ChatPanelProps = {
  messages: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatPanel({
  messages,
  inputValue,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  return (
    <section className="ui-panel bottom-box chat-panel">
      <div className="panel-title-row">
        <h2>Chat</h2>
      </div>

      <div className="scroll-box chat-scroll">
        {messages.length === 0 ? (
          <div className="empty-box">No chat messages yet.</div>
        ) : (
          messages.map((message, index) => (
            <div key={`${message}-${index}`} className="chat-line">
              {message}
            </div>
          ))
        )}
      </div>

      <div className="chat-row">
        <input
          type="text"
          placeholder="Say something to the wasteland..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <button className="chat-send" onClick={onSend}>
          Send
        </button>
      </div>
    </section>
  );
}