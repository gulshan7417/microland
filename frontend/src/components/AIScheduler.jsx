import React, { useState } from "react";
import { api } from "../services/api";

export function AIScheduler({ onApplied }) {
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/ai/generate", {
        query: "Generate safe schedule and precautions"
      });
      setAiResult(data.aiResult);
    } catch (e) {
      setError(e.message || "Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  }

  async function applySchedule() {
    if (!aiResult || !aiResult.optimizedSchedule) return;
    const confirmed = window.confirm(
      "This schedule comes from an AI assistant and is NOT medical advice.\nHave you reviewed it and do you want to apply it?"
    );
    if (!confirmed) return;

    try {
      await api.post("/ai/apply", {
        optimizedSchedule: aiResult.optimizedSchedule
      });
      onApplied?.();
      alert("AI schedule applied.");
    } catch (e) {
      alert("Failed to apply schedule");
    }
  }

  return (
    <div className="ai-panel">
      <p className="ai-hint">
        Let the assistant group your medicines into a gentler daily routine. This
        is only a suggestion – always confirm changes with your doctor.
      </p>
      <div>
        <button onClick={generate} disabled={loading} className="btn btn-outline btn-sm">
          {loading ? "Generating..." : 'Generate safe schedule & precautions'}
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      {aiResult && (
        <div className="ai-output">
          <h4 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Optimized schedule</h4>
          <ul style={{ paddingLeft: "1.1rem", marginTop: 0, marginBottom: "0.5rem" }}>
            {(aiResult.optimizedSchedule || []).map((s, idx) => (
              <li key={idx}>
                <strong>{s.time}</strong>: {(s.medicines || []).join(", ")}{" "}
                {s.notes && <span>- {s.notes}</span>}
              </li>
            ))}
          </ul>

          <h4 style={{ marginBottom: "0.25rem" }}>Precautions</h4>
          <ul style={{ paddingLeft: "1.1rem", marginTop: 0, marginBottom: "0.5rem" }}>
            {(aiResult.precautions || []).map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>

          {aiResult.doctorWarning && (
            <p style={{ color: "#b91c1c", marginBottom: "0.5rem" }}>
              {aiResult.doctorWarning}
            </p>
          )}

          <button onClick={applySchedule} className="btn btn-primary btn-sm">
            Approve &amp; save schedule
          </button>
        </div>
      )}
    </div>
  );
}

