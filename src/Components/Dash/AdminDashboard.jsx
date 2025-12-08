// src/Components/Dash/AdminDashboard.jsx
import React from "react";
import styled from "styled-components";
import { LayoutDashboard, Users, Clock, Activity, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import KnowlyDashboard from "../KnowlyDash";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  const goHome = () => {
    navigate("/HomeLog");
  };

  return (
    <PageContainer>
      {/* SIDEBAR */}
      <Sidebar>
        <SidebarHeader onClick={goHome}>
          <LogoText>Knowly Admin</LogoText>
        </SidebarHeader>

        <SidebarSectionTitle>Panel</SidebarSectionTitle>
        <SidebarItem active>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </SidebarItem>

        <SidebarItem>
          <Users size={18} />
          <span>Usuarios</span>
        </SidebarItem>

        <SidebarItem>
          <Activity size={18} />
          <span>Actividad</span>
        </SidebarItem>

        <SidebarFooter onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </SidebarFooter>
      </Sidebar>

      {/* CONTENIDO CENTRAL */}
      <MainContent>
        <TopBar>
          <TopTitle>Panel administrativo</TopTitle>
          <TopInfo>
            <Clock size={16} />
            <span>Vista en tiempo real</span>
          </TopInfo>
        </TopBar>

        {/* AQUÍ VIVE SUPERTSET, A PANTALLA COMPLETA DENTRO DE LA PLANTILLA */}
        <SupersetWrapper>
          <KnowlyDashboard />
        </SupersetWrapper>
      </MainContent>
    </PageContainer>
  );
}

/* ========== styled-components ========== */

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: linear-gradient(180deg, #7c3aed, #a855f7);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  gap: 0.75rem;
`;

const SidebarHeader = styled.div`
  font-weight: 800;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const LogoText = styled.span`
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;

const SidebarSectionTitle = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
`;

const SidebarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: none;
  background: ${({ active }) =>
    active ? "rgba(255,255,255,0.18)" : "transparent"};
  color: #f9fafb;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: ${({ active }) =>
      active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)"};
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled(SidebarItem)`
  margin-top: auto;
  background: rgba(15, 23, 42, 0.25);

  &:hover {
    background: rgba(15, 23, 42, 0.35);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
`;

const TopInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #6b7280;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #e5e7eb;
`;

const SupersetWrapper = styled.div`
  margin-top: 0.75rem;
  flex: 1;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
  padding: 0;               /* Superset ya organiza su propio contenido */
  overflow: hidden;         /* para que no salgan barras raras */
  height: calc(100vh - 110px);
`;
