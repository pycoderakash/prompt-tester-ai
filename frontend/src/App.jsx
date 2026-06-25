import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testPrompt = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        }
      );

      const data = await response.json();

      if (data.text) {
        setResult(data.text);
      } else {
        setResult(data.error || "No response received");
      }
    } catch (error) {
      console.error(error);
      setResult("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        padding: "20px",
      }}
    >
      <h1>AI Prompt Tester</h1>

      <textarea
        rows="8"
        cols="60"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br />
      <br />

      <button onClick={testPrompt}>
        {loading ? "Generating..." : "Test Prompt"}
      </button>

      <br />
      <br />

      <div
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
          whiteSpace: "pre-wrap",
          border: "1px solid gray",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h3>Response:</h3>
        {result}
      </div>
    </div>
  );
}

export default App;