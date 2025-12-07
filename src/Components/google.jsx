import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function GoogleLogin() {
 const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = {
      id: searchParams.get("id"),
      username: searchParams.get("username"),
      email: searchParams.get("email"),
      country: searchParams.get("country"),
      age: searchParams.get("age"),
    };

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/Asignaturas"); // Redirige a la página principal
    }
  }, [searchParams, navigate]);

  return <p>Iniciando sesión con Google...</p>;
}

export default GoogleLogin;

/* -------------------- STYLED COMPONENTS -------------------- */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 150px;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #555;
`;

const LoginCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;
