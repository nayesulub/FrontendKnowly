import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, User, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Registro() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
      email: '',
      username: '',
      password: '',
      country: '',
      age: ''

    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setErrors({});
      
      console.log('📤 Enviando datos:', formData);
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        console.log('📡 Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('📋 Respuesta completa:', result);
        
        if (response.ok && result.success) {
          // Registro exitoso
          console.log('✅ Usuario registrado exitosamente:', result.data.user);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/login');
          }, 2000);
        } else {
          // Error en el registro
          console.error('❌ Error en el registro:', result.errors || result.message);
          
          if (result.errors) {
            setErrors(result.errors);
            console.log('Errores de validación:', result.errors);
          } else {
            alert('Error: ' + (result.message || 'Error desconocido'));
          }
        }
      } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('Error de conexión con el servidor. Asegúrate de que el backend esté activo');
      } finally {
        setLoading(false);
      }
    };
  
    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      
      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[id]) {
        setErrors(prev => ({
          ...prev,
          [id]: null
        }));
      }
    };
  
    const handleBack = () => {
      navigate('/');
    };
  
    return (
      <RegisterContainer>
        <Logo src="././Knowly.png" alt="Knowly Logo" />
  
        <Title>Completa el registro</Title>
        <Subtitle>Crea una cuenta para empezar a recibir los beneficios de DevBox</Subtitle>
  
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Dirección de correo electrónico:</Label>
            <InputGroup>
              <IconWrapper>
                <Mail size={18} />
              </IconWrapper>
              <Input 
                id="email" 
                type="email" 
                placeholder="Registra tu dirección de email" 
                hasIcon
                value={formData.email}
                onChange={handleChange}
                required
                hasError={errors.email}
              />
            </InputGroup>
            {errors.email && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </ErrorMessage>
            )}
          </FormGroup>
  
          <FormRow>
            <FormGroup>
              <Label htmlFor="username">Usuario:</Label>
              <InputGroup>
                <IconWrapper>
                  <User size={18} />
                </IconWrapper>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Nombre de usuario" 
                  hasIcon
                  value={formData.username}
                  onChange={handleChange}
                  required
                  hasError={errors.username}
                />
              </InputGroup>
              {errors.username && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {Array.isArray(errors.username) ? errors.username[0] : errors.username}
                </ErrorMessage>
              )}
            </FormGroup>
  
            <FormGroup>
              <Label htmlFor="age">Tu edad:</Label>
              <InputGroup>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Ingresa tu edad" 
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  max="120"
                  required
                  hasError={errors.age}
                />
              </InputGroup>
              {errors.age && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {Array.isArray(errors.age) ? errors.age[0] : errors.age}
                </ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="country">País:</Label>
            <Select 
              id="country" 
              value={formData.country} 
              onChange={handleChange}
              required
              hasError={errors.country}
            >
              <option value="">Selecciona tu país</option>
              <option value="México">México</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Canadá">Canadá</option>
            </Select>
            {errors.country && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {Array.isArray(errors.country) ? errors.country[0] : errors.country}
              </ErrorMessage>
            )}
          </FormGroup>
  
          <FormGroup>
            <Label htmlFor="password">Contraseña:</Label>
            <InputGroup>
              <IconWrapper>
                <Lock size={18} />
              </IconWrapper>
              <Input 
                id="password" 
                type="password" 
                placeholder="Escoja una contraseña (mínimo 8 caracteres)" 
                hasIcon
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                hasError={errors.password}
              />
            </InputGroup>
            {errors.password && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </ErrorMessage>
            )}
          </FormGroup>
  
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear una cuenta'}
          </Button>

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
            window.location.href = "http://127.0.0.1:8000/login/google";

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
          
        </Form>
  
        <BackLink onClick={handleBack} href="#">
          <span>Volver</span>
        </BackLink>

        {showSuccess && (
          <SuccessMessage>
            <CheckCircle size={24} /> Registro exitoso
          </SuccessMessage>
        )}
      </RegisterContainer>
    );
  }

export default Registro;

// Styled Components
const RegisterContainer = styled.section`
background: #ffffff;
padding: 2rem;
border-radius: 10px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
text-align: center;
width: 400px;
max-width: 90%;
`;

const Logo = styled.img`
width: 300px;
margin-bottom: 1.5rem;
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
margin-bottom: 2rem;
max-width: 280px;
margin-left: auto;
margin-right: auto;
`;

const Form = styled.form`
display: flex;
flex-direction: column;
gap: 1.2rem;
`;

const FormGroup = styled.div`
text-align: left;
`;

const Label = styled.label`
color: black;
font-size: 0.9rem;
font-weight: bold;
margin-bottom: 0.5rem;
display: block;
`;

const InputGroup = styled.div`
position: relative;
width: 100%;
`;

const Input = styled.input`
width: 100%;
padding: 12px;
padding-left: ${props => props.hasIcon ? '40px' : '12px'};
background: #f3f7fd;
border: 1px solid ${props => props.hasError ? '#e74c3c' : '#e0e7f2'};
border-radius: 8px;
font-size: 1rem;
color: #333;
outline: none;
box-sizing: border-box;

&::placeholder {
  color: #99aab5;
}

&:focus {
  border-color: ${props => props.hasError ? '#e74c3c' : '#29c5f6'};
  box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(41, 197, 246, 0.1)'};
}
`;

const IconWrapper = styled.div`
position: absolute;
left: 12px;
top: 50%;
transform: translateY(-50%);
color: #99aab5;
`;

const FormRow = styled.div`
display: flex;
gap: 1rem;

@media (max-width: 480px) {
  flex-direction: column;
}
`;

const Select = styled.select`
width: 100%;
padding: 12px;
background: #f3f7fd;
border: 1px solid ${props => props.hasError ? '#e74c3c' : '#e0e7f2'};
border-radius: 8px;
font-size: 1rem;
color: #333;
outline: none;
box-sizing: border-box;
cursor: pointer;

&:focus {
  border-color: ${props => props.hasError ? '#e74c3c' : '#29c5f6'};
  box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(41, 197, 246, 0.1)'};
}

option[value=""] {
  color: #99aab5;
}
`;

const Button = styled.button`
background: ${props => props.disabled ? '#bdc3c7' : '#29c5f6'};
color: white;
border: none;
padding: 14px;
border-radius: 8px;
font-size: 1rem;
font-weight: bold;
cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
transition: all 0.3s ease-in-out;
box-shadow: ${props => props.disabled ? 'none' : '0px 4px 0px #1487b7'};
text-transform: uppercase;
margin-top: 1rem;

&:hover {
  background: ${props => props.disabled ? '#bdc3c7' : '#19b0e0'};
  box-shadow: ${props => props.disabled ? 'none' : '0px 2px 0px #1487b7'};
  transform: ${props => props.disabled ? 'none' : 'translateY(2px)'};
}
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

const BackLink = styled.a`
margin-top: 1.5rem;
display: inline-block;
text-decoration: none;
color: #555;
font-size: 0.9rem;
display: flex;
justify-content: center;
align-items: center;
gap: 4px;

&:hover {
  color: #19b0e0;
}
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 4px;
  font-weight: 500;
`;