// src/Components/Dash/SupersetBoard.jsx
import React from "react";
import styled from "styled-components";

const SUPERSET_IFRAME_URL =
  "https://elroy-phylic-jefferson.ngrok-free.dev/superset/dashboard/38/?native_filters_key=lGgp4CPgrG4&ngrok-skip-browser-warning=1";

// ⬆️ Reemplaza esta URL por la de TU dashboard

const SupersetBoard = () => {
  return (
    <Wrapper>
      <Title>📊 Dashboard de Superset</Title>

      <IframeContainer>
        <Iframe
          src={SUPERSET_IFRAME_URL}
          title="Superset Dashboard"
          frameBorder="0"
        />
      </IframeContainer>
    </Wrapper>
  );
};

export default SupersetBoard;

// ===== estilos =====

const Wrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
`;

const IframeContainer = styled.div`
  width: 100%;
  min-height: 75vh;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 75vh;
  border: none;
`;
