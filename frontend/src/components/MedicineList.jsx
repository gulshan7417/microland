import React from "react";
import { api } from "../services/api";

export function MedicineList({ medicines, onStatusChange }) {
  async function updateStatus(id, status) {
    try {
      await api.patch(`/medicines/${id}/status`, { status });
      onStatusChange?.();
    } catch (e) {
      alert("Failed to update status");
    }
  }

  if (!medicines.length) {
    return (
      <div className="app-subtitle" style={{ marginTop: "0.25rem" }}>
        No medicines added yet. Add your first reminder above.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th align="left">Time</th>
            <th align="left">Name</th>
            <th align="left">Dosage</th>
            <th align="left">Duration</th>
            <th align="left">Status</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m._id}>
              <td>{m.time}</td>
              <td>{m.name}</td>
              <td>{m.dosage}</td>
              <td>{m.duration}</td>
              <td>
                <span className={`status-pill ${m.status || "pending"}`}>
                  {m.status || "pending"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => updateStatus(m._id, "taken")}
                  className="btn btn-sm btn-outline"
                >
                  Taken
                </button>
                <button
                  onClick={() => updateStatus(m._id, "missed")}
                  className="btn btn-sm btn-ghost"
                  style={{ marginLeft: "0.25rem" }}
                >
                  Missed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

