import React, { useState } from "react";
import { api } from "../services/api";

export function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const parsedAge = parseInt(age, 10);
      if (Number.isNaN(parsedAge)) {
        setError("Age must be a number");
        setLoading(false);
        return;
      }

      const data = await api.post("/auth/register", {
        name,
        age: parsedAge,
        conditions: conditions
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        email,
        password
      });
      onSuccess(data);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div>
        <div className="field-label">Name</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="text-input"
        />
      </div>
      <div>
        <div className="field-label">Age</div>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="text-input"
        />
      </div>
      <div>
        <div className="field-label">Health conditions (comma separated)</div>
        <input
          type="text"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="e.g. hypertension, diabetes"
          className="text-input"
        />
      </div>
      <div>
        <div className="field-label">Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-input"
        />
      </div>
      <div>
        <div className="field-label">Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-input"
        />
      </div>
      {error && <div className="error-text">{error}</div>}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Registering..." : "Create account"}
      </button>
    </form>
  );
}

