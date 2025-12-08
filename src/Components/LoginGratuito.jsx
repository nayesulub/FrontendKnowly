import styled from 'styled-components';
import { Mail, Lock, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData);

      // 🔑 Mapear datos del backend a lo que espera Perfil.jsx
      const u = response.data.user || {};
      // Normalizar idrol a número y guardar el user completo
      u.idrol = u.idrol !== undefined ? Number(u.idrol) : u.idrol;
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', response.data.token);

      setTimeout(() => navigate("/perfil"), 500);
    } catch (error) {
      setError(error.response?.data?.error || "Error en la autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LogoContainer>
        <Logo src="./Knowly.png" alt="Knowly Logo" />
      </LogoContainer>

      <Title>Bienvenido de nuevo</Title>
      <Subtitle>Obtén el apoyo que necesites al alcance de tus manos</Subtitle>

      {error && <ErrorAlert>{error}</ErrorAlert>}

      <Form onSubmit={handleLogin}>
        <Label htmlFor="email">Dirección de correo electrónico:</Label>
        <InputGroup>
          <IconWrapper>
            <Mail size={18} />
          </IconWrapper>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Registra tu dirección de email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </InputGroup>

        <Label htmlFor="password">Contraseña:</Label>
        <InputGroup>
          <IconWrapper>
            <Lock size={18} />
          </IconWrapper>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Escriba su contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <PasswordToggle
            type="button"
            onClick={togglePasswordVisibility}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggle>
        </InputGroup>

        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "INICIAR SESIÓN"}
          </Button>
        </ButtonGroup>

        <ExtraOptions>
          <CheckboxLabel>
            <CheckboxInput type="checkbox" />
            <span>No cerrar sesión</span>
          </CheckboxLabel>
          <BackLink href="/">
            <ChevronLeft size={16} />
            <span>Volver</span>
          </BackLink>
        </ExtraOptions>

        <RegisterLink>
          ¿No tienes cuenta?{" "}
          <StyledLink to="/registro">
            Regístrate aquí
          </StyledLink>
        </RegisterLink>
      </Form>
    </LoginContainer>
  );
}

export default Login;

// 🎨 Estilos (los mismos que tenías)
const LoginContainer = styled.section`
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 360px;
  position: relative;
`;

const LogoContainer = styled.div`
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  width:300px;
  height: auto;
  max-height: 120px;
  border-radius: 10px;
  object-fit: cover;
`;

const Title = styled.h1`
  color: rgb(0, 0, 0);
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
`;

const ErrorAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 0.375rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  color: black;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: left;
  display: block;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  padding-left: 40px;
  padding-right: ${props => props.type === 'password' || props.name === 'password' ? '40px' : '12px'};
  background: #f3f7fd;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #99aab5;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #99aab5;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(195, 23, 23, 0.7);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Button = styled.button`
  background: #29c5f6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 0px #1487b7;

  &:hover:not(:disabled) {
    background: #19b0e0;
  }
`;

const ExtraOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #333;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CheckboxInput = styled.input``;

const BackLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #19b0e0;
  }
`;

const RegisterLink = styled.p`
  margin-top: 1rem;
  color: #333;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  color: #ffc107;

  &:hover {
    text-decoration: underline;
  }
`;
