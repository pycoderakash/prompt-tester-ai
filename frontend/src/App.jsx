// src/App.js

import { useState } from "react";
import "./App.css";

const EXAMPLES = [
  "Explain recursion like I'm 10 years old",
  "Write a haiku about machine learning",
  "What are 3 use cases for AI agents?",
];

const BACKEND_URL = "https://prompt-tester-backend.onrender.com/api/generate";

function App() {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(null);

  async function callLLM() {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");
    setError("");
    setUsage(null);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          temperature,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResponse(data.text);
        setUsage(data.usage);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      callLLM();
    }
  }

  const tempLabel =
    temperature < 0.3
      ? "Precise"
      : temperature < 0.6
      ? "Balanced"
      : temperature < 0.85
      ? "Creative"
      : "Wild";

  return (
    <div className="app">
      <header className="header">
        <span className="badge">Gen AI Lab — Mini Project</span>

        <h1>Prompt Tester</h1>

        <p>Type a prompt → call Gemini → see the response</p>
      </header>

      <div className="card">
        <div className="examples">
          <div className="label">Try an example</div>

          <div className="chip-row">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                className="chip"
                onClick={() => setPrompt(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <label className="label" htmlFor="prompt-input">
          Your Prompt
        </label>

        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Ctrl+Enter to send)"
          rows={4}
        />

        <div className="temp-row">
          <label className="label">Temperature</label>

          <span className="temp-value">
            {temperature.toFixed(1)} - {tempLabel}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) =>
            setTemperature(parseFloat(e.target.value))
          }
        />

        <div className="temp-scale">
          <span>0 – Deterministic</span>
          <span>1 – Max Randomness</span>
        </div>

        <button
          className="send-btn"
          onClick={callLLM}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Calling API..." : "Send Prompt ↵"}
        </button>
      </div>

      {(response || error) && (
        <div className={`result-card ${error ? "error" : ""}`}>
          <div className="result-header">
            <span>{error ? "⚠ Error" : "✓ Response"}</span>

            {usage && (
              <span className="tokens">
                {usage.promptTokens} in •{" "}
                {usage.responseTokens} out tokens
              </span>
            )}
          </div>

          <div className="result-body">
            {error || response}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;