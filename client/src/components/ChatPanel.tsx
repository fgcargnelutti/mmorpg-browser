import { useEffect, useRef } from "react";

export type ChatMessage = {
  content: string;
  timestamp: string;
};

type ChatPanelProps = {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

function getMessageClass(message: ChatMessage) {
  if (message.content.startsWith("You:")) {
    return "chat-message chat-message--player";
  }

  if (message.content.startsWith("NPC")) {
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <section className="ui-panel chat-panel">
      <div className="panel-title-row">
        <h2>Chat</h2>
      </div>

      <div ref={scrollRef} className="chat-messages">
        {messages.map((message, index) => (
          <div key={`${message}-${index}`} className={getMessageClass(message)}>
            <span className="chat-message__timestamp">{message.timestamp}</span>{" "}
            <span className="chat-message__content">{message.content}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value.slice(0, 200))}
          placeholder="Say something to the wasteland..."
          maxLength={200}
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
