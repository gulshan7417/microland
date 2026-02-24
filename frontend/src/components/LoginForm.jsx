import React, { useState } from "react";
import { api } from "../services/api";

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      onSuccess(data);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

