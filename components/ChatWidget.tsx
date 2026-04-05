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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);

      setMessages([...next, { role: 'assistant', content: data.message }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages([...next, { role: 'assistant', content: `⚠️ ${msg}` }]);
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
    <>
      {/* ── Chat Panel ── */}
      {open && (
        <div className="chat-panel">
          <div className="chat-panel__header">
            <div className="chat-panel__header-info">
              <div className="chat-panel__avatar">K</div>
              <div>
                <p className="chat-panel__name">Kylla&apos;s AI</p>
                <p className="chat-panel__status">
                  <span className="chat-panel__dot" /> Online
                </p>
              </div>
            </div>
            <button
              className="chat-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chat-panel__body">
            {messages.length === 0 && (
              <div className="chat-starters">
                <p className="chat-starters__label">Ask me anything about Kylla:</p>
                <div className="chat-starters__chips">
                  {STARTER_QUESTIONS.map((q) => (
                    <button key={q} className="chat-chip" onClick={() => sendMessage(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                    <span className="chat-msg__label">
                      {msg.role === 'user' ? 'You' : "Kylla's AI"}
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
          </div>

          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Type a message…"
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
        </div>
      )}

      {/* ── Bubble Button ── */}
      <button
        className="chat-bubble"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && <span className="chat-bubble__label">Ask me anything</span>}
      </button>

      <style jsx>{`
        /* ── Bubble ───────────────────────────────────── */
        .chat-bubble {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--accent);
          color: var(--bg);
          border: none;
          border-radius: 50px;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .chat-bubble:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
        }
        .chat-bubble svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* ── Panel ───────────────────────────────────── */
        .chat-panel {
          position: fixed;
          bottom: 5.5rem;
          right: 2rem;
          z-index: 199;
          width: 360px;
          max-width: calc(100vw - 4rem);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .chat-panel__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: var(--bg-surface2);
          border-bottom: 1px solid var(--border);
        }
        .chat-panel__header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .chat-panel__avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .chat-panel__name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
        }
        .chat-panel__status {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.1rem;
        }
        .chat-panel__dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
        }
        .chat-panel__close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .chat-panel__close:hover { color: var(--text); }
        .chat-panel__close svg { width: 18px; height: 18px; }

        /* Body */
        .chat-panel__body {
          flex: 1;
          overflow-y: auto;
          min-height: 120px;
          max-height: 220px;
        }
        .chat-panel__body::-webkit-scrollbar { width: 4px; }
        .chat-panel__body::-webkit-scrollbar-track { background: transparent; }
        .chat-panel__body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        /* Starters */
        .chat-starters {
          padding: 1.25rem;
        }
        .chat-starters__label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          letter-spacing: 0.04em;
        }
        .chat-starters__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .chat-chip {
          background: var(--accent-tint);
          border: 1px solid var(--border);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 0.73rem;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .chat-chip:hover {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }

        /* Messages */
        .chat-messages {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .chat-msg { display: flex; flex-direction: column; gap: 0.25rem; }
        .chat-msg--user { align-items: flex-end; }
        .chat-msg--assistant { align-items: flex-start; }
        .chat-msg__label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }
        .chat-msg__content {
          max-width: 85%;
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          font-size: 0.88rem;
          line-height: 1.6;
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
          padding: 0.75rem 0.9rem;
        }
        .dot {
          width: 6px;
          height: 6px;
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

        /* Input */
        .chat-input-row {
          display: flex;
          align-items: flex-end;
          gap: 0.6rem;
          padding: 0.9rem 1rem;
          border-top: 1px solid var(--border);
        }
        .chat-input {
          flex: 1;
          resize: none;
          background: var(--bg-surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          padding: 0.6rem 0.85rem;
          line-height: 1.5;
          transition: border-color 0.2s;
          outline: none;
          max-height: 100px;
          overflow-y: auto;
        }
        .chat-input::placeholder { color: var(--text-secondary); }
        .chat-input:focus { border-color: var(--accent); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .chat-send {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--bg);
          transition: opacity 0.2s, transform 0.2s;
        }
        .chat-send:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
        .chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
        .chat-send svg { width: 16px; height: 16px; }

        @media (max-width: 480px) {
          .chat-bubble { bottom: 1.25rem; right: 1.25rem; }
          .chat-panel { bottom: 5rem; right: 1.25rem; }
        }
      `}</style>
    </>
  );
}
