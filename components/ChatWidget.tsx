import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_QUESTIONS = [
  "What's your tech stack?",
  'Tell me about your experience',
  'Are you open to work?',
  'What was your biggest project?',
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input.trim());
    }
  }

  return (
    <div className="chat-widget">
      {/* Starter questions – only shown before first message */}
      {messages.length === 0 && (
        <div className="chat-starters">
          <p className="chat-starters__label">Try asking:</p>
          <div className="chat-starters__chips">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                className="chat-chip"
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
              <span className="chat-msg__label">
                {msg.role === 'user' ? 'You' : 'Kylla\'s AI'}
              </span>
              <p className="chat-msg__content">{msg.content}</p>
            </div>
          ))}

          {loading && (
            <div className="chat-msg chat-msg--assistant">
              <span className="chat-msg__label">Kylla&apos;s AI</span>
              <p className="chat-msg__content chat-msg__content--typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Ask me anything about Kylla's background…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="chat-send"
          onClick={() => input.trim() && sendMessage(input.trim())}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .chat-widget {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Starters */
        .chat-starters {
          padding: 2rem;
        }
        .chat-starters__label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }
        .chat-starters__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .chat-chip {
          background: var(--accent-tint);
          border: 1px solid var(--border);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          padding: 0.45rem 0.9rem;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition);
        }
        .chat-chip:hover {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }

        /* Messages */
        .chat-messages {
          padding: 1.5rem 2rem;
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .chat-msg { display: flex; flex-direction: column; gap: 0.3rem; }
        .chat-msg--user { align-items: flex-end; }
        .chat-msg--assistant { align-items: flex-start; }

        .chat-msg__label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        .chat-msg__content {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
          line-height: 1.65;
          white-space: pre-wrap;
        }
        .chat-msg--user .chat-msg__content {
          background: var(--accent);
          color: var(--bg);
          border-radius: 10px 10px 2px 10px;
        }
        .chat-msg--assistant .chat-msg__content {
          background: var(--bg-surface2);
          color: var(--text);
          border-radius: 10px 10px 10px 2px;
        }

        /* Typing dots */
        .chat-msg__content--typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.85rem 1rem;
        }
        .dot {
          width: 7px;
          height: 7px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Input row */
        .chat-input-row {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
        }
        .chat-input {
          flex: 1;
          resize: none;
          background: var(--bg-surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          padding: 0.75rem 1rem;
          line-height: 1.5;
          transition: var(--transition);
          outline: none;
          max-height: 120px;
          overflow-y: auto;
        }
        .chat-input::placeholder { color: var(--text-secondary); }
        .chat-input:focus { border-color: var(--accent); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .chat-send {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--bg);
          transition: var(--transition);
        }
        .chat-send:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
        .chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
        .chat-send svg { width: 18px; height: 18px; }

        @media (max-width: 600px) {
          .chat-starters { padding: 1.25rem; }
          .chat-messages { padding: 1rem 1.25rem; }
          .chat-input-row { padding: 1rem; }
          .chat-msg__content { max-width: 90%; }
        }
      `}</style>
    </div>
  );
}
