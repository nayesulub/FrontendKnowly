// KnowlyDash.jsx
import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const SUPERSET_DOMAIN = "http://localhost:8088";
const DASHBOARD_ID = "a872e91b-d1eb-4cb5-871a-dba335f052ad";

export default function KnowlyDashboard() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);

        const res = await axios.get(`${API_BASE_URL}/superset/guest-token`);

        const token =
          res.data.guest_token ||
          res.data.guestToken ||
          res.data.token;

        if (!token) {
          throw new Error("El backend no devolvió guest_token");
        }

        await embedDashboard({
          id: DASHBOARD_ID,
          supersetDomain: SUPERSET_DOMAIN,
          mountPoint: containerRef.current,
          fetchGuestToken: () => Promise.resolve(token),
          dashboardUiConfig: {
            hideTitle: true,
            hideTab: true,
            filters: false,
          },
        });
      } catch (err) {
        console.error("Error al cargar dashboard de Knowly:", err);
        if (!cancelled) setError(err.message);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {error && (
        <p style={{ color: "red", padding: "8px" }}>
          Error cargando dashboard: {error}
        </p>
      )}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", background: "#fff" }}
      />
    </div>
  );
}
