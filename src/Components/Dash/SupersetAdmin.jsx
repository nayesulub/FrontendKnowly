// src/Components/Dash/SupersetAdmin.jsx
import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import styled from "styled-components";

const API_BASE_URL = "https://knowly-vkbg.onrender.com/api";
const SUPERSET_DOMAIN = "https://elroy-phylic-jefferson.ngrok-free.dev";
const DASHBOARD_ID = "a872e91b-d1eb-4cb5-871a-dba335f052ad";

export default function SupersetAdmin() {
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageWrapper>
      {error && <ErrorBox>Error cargando dashboard: {error}</ErrorBox>}

      {/* Aquí Superset inyecta el iframe */}
      <DashboardContainer ref={containerRef} />
    </PageWrapper>
  );
}

/* =============== styled-components =============== */

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

// Mensaje de error si algo falla
const ErrorBox = styled.div`
  color: #c0392b;
  background: #fdecec;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
`;

// Tarjeta donde vive el iframe de Superset
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 950px;   /* 🔥 más chico */
  height: 80vh;
  margin: 1.5rem auto 2rem;
  background: #0f172a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);

  iframe {
    width: 100% !important;
    height: 100% !important;
    border: none;
  }
`;

