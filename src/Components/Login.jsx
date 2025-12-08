import styled from 'styled-components';
import { Mail, Lock, ChevronLeft, Eye, EyeOff, Globe, Users, Box } from 'lucide-react';
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

    // 🚀 Guardar el usuario y token
    const user = response.data.user;
  user.idrol = Number(user.idrol); // asegurar que sea número

  localStorage.setItem("user", JSON.stringify(user));

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

      setTimeout(() => navigate("/Asignaturas"), 500);
    } catch (error) {
      setError(error.response?.data?.error || "Error en la autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <LoginContainer>
      <Logo src="./Knowly.png" alt="Knowly Logo" />
      <Title>Bienvenido de nuevo</Title>
      <Subtitle>Obtén el apoyo que necesites al alcance de tus manos</Subtitle>

      {error && <ErrorAlert>{error}</ErrorAlert>}

      <Form onSubmit={handleLogin}>
        <Label>Email:</Label>
        <InputGroup>
          <IconWrapper><Mail size={18} /></IconWrapper>
          <Input
            type="email"
            name="email"
            placeholder="Ingresa tu email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </InputGroup>

        <Label>Contraseña:</Label>
        <InputGroup>
          <IconWrapper><Lock size={18} /></IconWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Tu contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <PasswordToggle type="button" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggle>
        </InputGroup>

        <Button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "INICIAR SESIÓN"}
        </Button>

        {/* Nueva sección de Login Social */}
        <SocialLoginGroup>
          <Divider>
            <DividerLine />
            <DividerText>O continúa con</DividerText>
            <DividerLine />
          </Divider>

          <SocialButton
            type="button"
            disabled={loading}
            onClick={() => {
            // Abre el endpoint de login de Google
            window.location.href = `${API_BASE_URL.replace('/api', '')}/login/google`;

          }}>
                 {loading ? "Cargando..." : "Google"}
                <img src="./Gugul.jpg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
              
              </SocialButton>

               <SocialButton
            type="button"
            disabled={loading}
            onClick={() => {
            

          }}>
                 {loading ? "Cargando..." : "Microsoft"}
                <img src="./Micro.jpg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
              
              </SocialButton>


            {/*
          <SocialButton onClick={() => console.log('Login con Facebook')}>
                <img src="./Face.jpg" alt="Facebook Logo" style={{ width: '20px', height: '20px' }} />
              
              </SocialButton>

          <SocialButton onClick={() => console.log('Login con Microsoft')}>
                <img src="./Micro.jpg" alt="Microsoft Logo" style={{ width: '20px', height: '20px' }} />
          
              </SocialButton>
                */}
        </SocialLoginGroup>

        <BackLink href="/"><ChevronLeft size={16}/>Volver</BackLink>
        <RegisterLink>
          ¿No tienes cuenta?{" "}
          <StyledLink to="/registro">Regístrate aquí</StyledLink>
        </RegisterLink>
      </Form>
    </LoginContainer>
  );
}

export default Login;

// 🎨 Estilos
const LoginContainer = styled.section`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
  width: 360px;
  margin: auto;
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: .5rem;
`;

const Subtitle = styled.p`
  font-size: .9rem;
  margin-bottom: 1rem;
  color: #555;
`;

const ErrorAlert = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: .8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  text-align: left;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`;

const Button = styled.button`
  background: #29c5f6;
  border: none;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background: #19b0e0; }
`;

/* 🆕 Nuevos estilos para Login Social */
const SocialLoginGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #ddd;
`;

const DividerText = styled.span`
  font-size: 0.85rem;
  color: #888;
`;

const SocialButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ccc;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #999;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const BackLink = styled.a`
  margin-top: 1rem;
  display: inline-flex;
  gap: 4px;
  color: #555;
  text-decoration: none;
  &:hover { color: #19b0e0; }
`;

const RegisterLink = styled.p`
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  font-weight: bold;
  color: #ff9800;
`;