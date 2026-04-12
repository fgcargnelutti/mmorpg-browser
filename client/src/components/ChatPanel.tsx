import { useEffect, useRef } from "react";

type ChatPanelProps = {
  messages: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

function getMessageType(message: string) {
  if (message.startsWith("NPC ")) return "npc";
  if (message.startsWith("You:")) return "player";
  return "player";
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
    <section className="ui-panel bottom-box chat-panel">
      <div className="panel-title-row">
        <h2>Chat</h2>
      </div>

      <div ref={scrollRef} className="scroll-box chat-scroll">
        {messages.length === 0 ? (
          <div className="empty-box">No chat messages yet.</div>
        ) : (
          messages.map((message, index) => {
            const messageType = getMessageType(message);

            return (
              <div
                key={`${message}-${index}`}
                className={`chat-line chat-line-${messageType}`}
              >
                {message}
              </div>
            );
          })
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