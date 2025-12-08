// src/Components/Dash/Dashboard.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Gestion from "./Gestion";
import Nivel from "./Nivel";
import Grados from "./Grados";
import Historial from "./Historial";
import Categorias from "./Categorias";

import {
  LayoutDashboard,
  Book as BookIcon,
  Layers as LayersIcon,
  GraduationCap as GraduationCapIcon,
  Receipt as ReceiptIcon,
  LogOut,
} from "lucide-react";

import SupersetBoard from "./SupersetBoard"; // 👈 aquí va nuestro componente

const Dashboard = () => {
  const [activeView, setActiveView] = useState("graficas");
  const navigate = useNavigate();

  return (
    <Container>
      <SidebarContainer>
        <Logo
          onClick={() => navigate("/HomeLog")}
          src="././Knowly.png"
          alt="Knowly Logo"
        />

        <Button
          onClick={() => setActiveView("graficas")}
          active={activeView === "graficas"}
        >
          <LayoutDashboard style={{ marginRight: "10px" }} /> Gráficas
        </Button>

        <Button
          onClick={() => setActiveView("categorias")}
          active={activeView === "categorias"}
        >
          <LayersIcon style={{ marginRight: "10px" }} /> Categorías
        </Button>

        <Button
          onClick={() => setActiveView("gestion")}
          active={activeView === "gestion"}
        >
          <BookIcon style={{ marginRight: "10px" }} /> Asignaturas
        </Button>

        <Button
          onClick={() => setActiveView("nivel")}
          active={activeView === "nivel"}
        >
          <LayersIcon style={{ marginRight: "10px" }} /> Usuarios
        </Button>

        <Button
          onClick={() => setActiveView("grados")}
          active={activeView === "grados"}
        >
          <GraduationCapIcon style={{ marginRight: "10px" }} /> Actividades
        </Button>

        <Button
          onClick={() => setActiveView("historial")}
          active={activeView === "historial"}
        >
          <ReceiptIcon style={{ marginRight: "10px" }} /> Historial
        </Button>

        <Button onClick={() => navigate("/Login")}>
          <LogOut style={{ marginRight: "10px" }} /> Cerrar Sesión
        </Button>
      </SidebarContainer>

      <MainContent>
        <Header>
          <HeaderTitle>PANEL ADMINISTRATIVO</HeaderTitle>
        </Header>

        {/* 👇 Vista de gráficas: aquí irá Superset */}
        {activeView === "graficas" && (
          <Content>
            <SupersetBoard />
          </Content>
        )}

        {activeView === "gestion" && (
          <Content>
            <Gestion />
          </Content>
        )}

        {activeView === "nivel" && (
          <Content>
            <Nivel />
          </Content>
        )}

        {activeView === "grados" && (
          <Content>
            <Grados />
          </Content>
        )}

        {activeView === "historial" && (
          <Content>
            <Historial />
          </Content>
        )}

        {activeView === "categorias" && (
          <Content>
            <Categorias />
          </Content>
        )}
      </MainContent>
    </Container>
  );
};

export default Dashboard;

/* ================== estilos ================== */

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(124, 58, 237, 0.2);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 70px;
    padding: 15px 10px;
  }
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: brightness(1.1);

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  @media (max-width: 768px) {
    width: 50px;
    margin-bottom: 1rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 10px;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  border: 2px solid ${(props) => (props.active ? "#f97316" : "transparent")};
  color: white;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  box-shadow: ${(props) =>
    props.active ? "0 4px 15px rgba(249, 115, 22, 0.4)" : "none"};

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)"
        : "rgba(255, 255, 255, 0.2)"};
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Header = styled.header`
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 3px solid #7c3aed;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const HeaderTitle = styled.h1`
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;
