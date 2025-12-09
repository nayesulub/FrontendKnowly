// src/Components/Dash/SupersetBoard.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../api/client";

function SupersetBoard() {
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("📡 Pidiendo guest token a Laravel...");
        console.log("🔍 Axios baseURL:", api.defaults.baseURL);

        // 1) Pedimos el token al backend Laravel
        const res = await api.get("/superset/guest-token");
        console.log("✔ Backend respondió:", res.data);

        const { token, superset_domain, dashboard_id } = res.data;

        if (!token || !superset_domain || !dashboard_id) {
          throw new Error(
            "Respuesta del backend incompleta (faltan token / superset_domain / dashboard_id)"
          );
        }

        if (!containerRef.current) {
          throw new Error("El contenedor aún no está montado");
        }

        // 2) Importación dinámica del SDK de Superset + Buffer
        const [{ Buffer }, { embedDashboard }] = await Promise.all([
          import("buffer"),
          import("@superset-ui/embedded-sdk"),
        ]);

        if (typeof window !== "undefined") {
          window.Buffer = window.Buffer || Buffer;
        }

        console.log("📊 Embedding con:", {
          dashboard_id,
          superset_domain,
        });

        // 3) Embebemos el dashboard dentro de nuestro DIV
        await embedDashboard({
          id: dashboard_id,
          supersetDomain: superset_domain,
          mountPoint: containerRef.current,
          fetchGuestToken: async () => token,
          dashboardUiConfig: {
            hideTitle: false,
            hideChartControls: true,
          },
        });

        console.log("✅ Dashboard embebido correctamente");

        if (!cancel) setLoading(false);
      } catch (err) {
        console.error("❌ Error embebiendo Superset:", err);

        let msg = "No se pudo cargar el dashboard de Superset.";
        if (err?.message) msg += " Detalle: " + err.message;

        if (!cancel) {
          setError(msg);
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div>
      {loading && <p>Cargando dashboard...</p>}

      {error && (
        <div
          style={{
            background: "#fdecec",
            color: "#c0392b",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "12px",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      {/* 🔥 Contenedor donde se monta Superset */}
      <div ref={containerRef} className="superset-wrapper"></div>
    </div>
  );
}

export default SupersetBoard;
