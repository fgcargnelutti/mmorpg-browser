type ChatPanelProps = {
  messages: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

function getMessageClass(message: string) {
  if (message.startsWith("You:")) {
    return "chat-message chat-message--player";
  }

  if (message.startsWith("NPC")) {
    return "chat-message chat-message--npc";
  }

  return "chat-message chat-message--other";
}

export default function ChatPanel({
  messages,
  inputValue,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  return (
    <section className="ui-panel chat-panel">
      <div className="panel-title">Chat</div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={`${message}-${index}`} className={getMessageClass(message)}>
            {message}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Say something to the wasteland..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSend();
            }
          }}
        />

        <button className="chat-send-button" type="button" onClick={onSend}>
          Send
        </button>
      </div>
    </section>
  );
}