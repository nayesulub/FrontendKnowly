// src/Components/Dash/Dashboard.jsx
import React from "react";
import KnowlyDashboard from "../KnowlyDash.jsx"; // 👈 usamos directamente el KnowlyDash

function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "24px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "800",
          marginBottom: "24px",
        }}
      >
        PANEL ADMINISTRATIVO
      </h1>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>
          Dashboard de Superset
        </h2>

        {/* 👇 Aquí ya se pinta el dashboard embebido con su propio estilo */}
        <KnowlyDashboard />
      </div>
    </div>
  );
}

export default Dashboard;
