import React, { useState } from "react";
import { api } from "../services/api";

export function MedicineForm({ onCreated }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/medicines", {
        name,
        dosage,
        time,
        duration
      });
      setName("");
      setDosage("");
      setTime("");
      setDuration("");
      onCreated?.();
    } catch (err) {
      setError(err.message || "Failed to add medicine");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "0.9rem" }}>
      <div className="inline-fields">
        <div>
          <div className="field-label">Name</div>
          <input
            placeholder="e.g. Paracetamol"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-input"
          />
        </div>
        <div>
          <div className="field-label">Dosage</div>
          <input
            placeholder="e.g. 500mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            className="text-input"
          />
        </div>
        <div>
          <div className="field-label">Time</div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="text-input"
          />
        </div>
        <div>
          <div className="field-label">Duration</div>
          <input
            placeholder="e.g. 7 days"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="text-input"
          />
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <button type="submit" className="btn btn-primary btn-sm">
        Add medicine
      </button>
    </form>
  );
}

