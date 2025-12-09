import React, { useEffect, useRef, useState } from "react";
import Master from "../components/Master";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import api from "../api/client";
import { Buffer } from "buffer";

// Polyfill de Buffer para el SDK de Superset
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

function AdminDashboard() {
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

        // Usa la MISMA ruta que te funcionó antes
        const res = await api.get("api/superset/guest-token");

        console.log("✔ Respuesta backend Superset:", res.data);

        const { token, superset_domain, dashboard_id } = res.data;

        if (!token || !superset_domain || !dashboard_id) {
          throw new Error("Respuesta incompleta del backend");
        }

        if (!containerRef.current) {
          throw new Error("El contenedor aún no está montado");
        }

        console.log("📊 Embedding dashboard con:", {
          dashboard_id,
          superset_domain,
        });

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
        console.error("❌ Error cargando dashboard de Superset:", err);

        // Si viene de axios
        if (err.response) {
          setError(
            `Error en el backend (${err.response.status}). Revisa la URL /api/superset/guest-token y el backend.`
          );
        } else if (err.request) {
          setError(
            "No se pudo contactar al backend. Revisa que Laravel esté encendido y la URL sea correcta."
          );
        } else {
          // Errores de embedDashboard u otros
          setError(
            `Error cargando el dashboard de Superset: ${err.message || err}`
          );
        }

        if (!cancel) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <Master>
      <div className="superset-page">
        <h2 className="titulo-superset">Dashboard de Superset</h2>

        {loading && <p>Cargando dashboard...</p>}

        {error && <div className="alerta-error">{error}</div>}

        <div className="superset-wrapper" ref={containerRef}></div>
      </div>
    </Master>
  );
}

export default AdminDashboard;
