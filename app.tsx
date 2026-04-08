import { useState, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Mode = "type" | "clipboard";
type SendState = "idle" | "sending" | "success" | "error";

interface ApiResponse {
  ok?: boolean;
  error?: string;
  length?: number;
}

function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("type");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = useCallback(async () => {
    if (!text.trim() || sendState === "sending") return;

    setSendState("sending");
    setStatusMsg("");

    try {
      const res = await fetch("/api/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      const data = (await res.json()) as ApiResponse;

      if (data.ok) {
        setSendState("success");
        setStatusMsg(`Sent ${data.length} chars via ${mode}`);
        setText("");
        setTimeout(() => {
          setSendState("idle");
          textareaRef.current?.focus();
        }, 1200);
      } else {
        throw new Error(data.error ?? "Unknown error");
      }
    } catch (err) {
      setSendState("error");
      setStatusMsg(err instanceof Error ? err.message : "Failed to send");
      setTimeout(() => setSendState("idle"), 2000);
    }
  }, [text, mode, sendState]);

  const buttonLabel = {
    idle: "Send to Desktop",
    sending: "Sending...",
    success: "Sent!",
    error: "Failed",
  }[sendState];

  return (
    <div className="container">
      <div className="top-bar">
        <div className="mode-toggle">
          <button
            className={mode === "type" ? "active" : ""}
            onClick={() => setMode("type")}
          >
            Cursor
          </button>
          <button
            className={mode === "clipboard" ? "active" : ""}
            onClick={() => setMode("clipboard")}
          >
            Clipboard
          </button>
        </div>

        <button
          className={`send-btn ${sendState !== "idle" ? sendState : ""}`}
          onClick={send}
          disabled={!text.trim() || sendState === "sending"}
        >
          {buttonLabel}
        </button>
      </div>

      <div className="textarea-wrap">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tap here and dictate with WisprFlow..."
          autoFocus
        />
        {statusMsg && (
          <span className={`status ${sendState === "success" ? "ok" : sendState === "error" ? "err" : ""}`}>
            {statusMsg}
          </span>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
