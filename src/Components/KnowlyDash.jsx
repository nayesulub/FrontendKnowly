// src/Components/KnowlyDash.jsx
import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import styled from "styled-components";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const SUPERSET_DOMAIN = "https://elroy-phylic-jefferson.ngrok-free.dev";
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
            hideTitle: true,   // ya tenemos nuestro propio título
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
    <SupersetPage>
      {error && (
        <SupersetError>
          Error cargando dashboard: {error}
        </SupersetError>
      )}

      {/* 🔥 Aquí Superset inyecta el iframe */}
      <SupersetWrapper ref={containerRef} />
    </SupersetPage>
  );
}

/* ================== styled-components ================== */

const SupersetPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SupersetError = styled.div`
  color: #c0392b;
  background: #fdecec;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
`;

// 👇 aquí el ajuste importante
const SupersetWrapper = styled.div`
  width: 100%;
  height: 70vh;          
  background: #ffffff;    
  border-radius: 12px;
  overflow: hidden;

  iframe {
    width: 100% !important;
    height: 100% !important;
    border: none;
    display: block;
  }
`;
