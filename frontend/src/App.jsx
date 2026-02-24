import React, { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { MedicineForm } from "./components/MedicineForm";
import { MedicineList } from "./components/MedicineList";
import { AIScheduler } from "./components/AIScheduler";
import { api } from "./services/api";
import { scheduleReminders } from "./services/reminders";

export function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [view, setView] = useState("login");
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (token) {
      api.setToken(token);
      loadSchedule();
    }
  }, [token]);

  async function loadSchedule() {
    try {
      const data = await api.get("/medicines/daily");
      setMedicines(data);
      // Simple reminder system using setTimeout and alerts.
      // In a more advanced version we could use the Notifications API
      // or a backend scheduler like cron + push notifications.
      scheduleReminders(data);
    } catch (e) {
      console.error(e);
    }
  }

  function handleAuthSuccess({ token: t, user: u }) {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    api.setToken(t);
    setView("dashboard");
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setView("login");
  }

  if (!token) {
    return (
      <div className="auth-shell">
        <h1 className="app-title">Medicine Companion</h1>
        <p className="app-subtitle">
          Simple, gentle reminders to keep daily medicines on track.
        </p>
        <div className="auth-toggle">
          <button
            onClick={() => setView("login")}
            className={`btn ${view === "login" ? "btn-primary" : "btn-outline"}`}
          >
            Login
          </button>
          <button
            onClick={() => setView("register")}
            className={`btn ${view === "register" ? "btn-primary" : "btn-outline"}`}
          >
            Register
          </button>
        </div>
        {view === "login" ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h2 className="app-title">Medicine Companion</h2>
          <div className="app-subtitle">
            Logged in as <strong>{user?.name}</strong> ({user?.age})
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="section-card">
          <h3>Daily medicines</h3>
          <MedicineForm onCreated={loadSchedule} />
          <MedicineList medicines={medicines} onStatusChange={loadSchedule} />
        </section>

        <section className="section-card">
          <h3>AI schedule assistant</h3>
          <AIScheduler onApplied={loadSchedule} />
        </section>
      </main>
    </div>
  );
}

