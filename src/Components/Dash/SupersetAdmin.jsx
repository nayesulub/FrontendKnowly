// src/Components/Dash/SupersetAdmin.jsx
import React from "react";
import styled from "styled-components";
import KnowlyDashboard from "../KnowlyDash.jsx";

function SupersetAdmin() {
  return (
    <MainContent>
      <DashboardWrapper>
        <KnowlyDashboard />
      </DashboardWrapper>
    </MainContent>
  );
}

export default SupersetAdmin;

/* =============== STYLED COMPONENTS =============== */

const MainContent = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: center;
`;

const DashboardWrapper = styled.div`
  width: 100%;
  max-width: 1100px; /* para que encaje con tu layout */
  height: auto;

  overflow: hidden;
  background: #0f172a;
  border-radius: 12px;
  border: 2px solid #e2e8f0;

  iframe {
    width: 100%;
    height: auto;
    min-height: 100%;
    border: none;
    display: block;
  }
`;
