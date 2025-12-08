import React, { useState } from 'react';
import styled from 'styled-components';
import { BookText, BookOpen, Calculator, Beaker, AtomIcon, Globe, Monitor, Landmark, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';


// Componente principal
//Edicion del componente
//Ca
const CursosLog = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const cursosData = [
      {
        id: 1,
        title: "Inglés",
        description: "Curso intensivo de gramática",
        ages: "6-11 años",
        icon: <BookText color="#ffffff" />,
        iconBg: "#4a7dff",
        buttonColor: "#4cd963"
      },
      {
        id: 2,
        title: "Español",
        description: "Curso intensivo de vocabulario",
        ages: "6-11 años",
        icon: <BookOpen color="#ffffff" />,
        iconBg: "#4cd963",
        buttonColor: "#4cd963"
      },
      {
        id: 3,
        title: "Matemáticas",
        description: "Curso intensivo de matemáticas ideal",
        ages: "11-16 años",
        icon: <Calculator color="#ffffff" />,
        iconBg: "#9179ff",
        buttonColor: "#4cd963"
      },
      {
        id: 4,
        title: "Historia",
        description: "Curso profesional de historia",
        ages: "12-16 años",
        icon: <Landmark color="#ffffff" />,
        iconBg: "#ff6b6b",
        buttonColor: "#4cd963"
      },
      {
        id: 5,
        title: "Química",
        description: "Curso profesional de química",
        ages: "14-16 años",
        icon: <Beaker color="#ffffff" />,
        iconBg: "#ff85a2",
        buttonColor: "#4cd963"
      },
      {
        id: 6,
        title: "Física",
        description: "Curso intensivo de física",
        ages: "11-16 años",
        icon: <AtomIcon color="#ffffff" />,
        iconBg: "#c278ff",
        buttonColor: "#4cd963"
      },
      {
        id: 7,
        title: "Geografía",
        description: "Curso intensivo de geografía",
        ages: "11-16 años",
        icon: <Globe color="#ffffff" />,
        iconBg: "#56c7ff",
        buttonColor: "#4cd963"
      },
      {
        id: 8,
        title: "Informática",
        description: "Curso profesional de informática",
        ages: "12-16 años",
        icon: <Monitor color="#ffffff" />,
        iconBg: "#52c0c9",
        buttonColor: "#4cd963"
      }
      
    ];
  
    return (
      <CursosContainer>
      <Header>
        <Logo src="././Knowly.png" alt="Knowly" />
        <Nav>
          <NavLink href="HomeLog">ACTIVIDADES</NavLink>
          <NavLink href="#">Grados</NavLink>

          {/* Área de Usuario con Menú Desplegable */}
          <UserProfile onClick={toggleMenu}>
            USUARIO <UserCircle size={32} />
            {isMenuOpen && (
              <DropdownMenu>
                <DropdownItem to="/Dashboard">Panel de Admin</DropdownItem>
                <DropdownItem to="/perfil">Mi Perfil</DropdownItem>
                <DropdownItem to="/">Cerrar Sesión</DropdownItem>
              </DropdownMenu>
            )}
          </UserProfile>
        </Nav>
      </Header>

       <br></br>
       

        <CursosHeader>CURSOS</CursosHeader>
        <CursosGrid>
          {cursosData.map((curso) => (
            <CursoCard key={curso.id}>
              <IconContainer bgColor={curso.iconBg}>
                {curso.icon}
              </IconContainer>
              <CursoTitle>{curso.title}</CursoTitle>
              <CursoDesc>{curso.description}</CursoDesc>
              <InscribeButton bgColor={curso.buttonColor} hoverColor="#e74c3c">
                <span>Inscribirse</span>
              </InscribeButton>
            </CursoCard>
          ))}
        </CursosGrid>
    
      </CursosContainer>
      
    );
  };
  
  export default CursosLog;

  // Styled Components
const CursosContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
min-height: 100vh;
font-family: Arial, sans-serif;
`;

const Header = styled.header`
  background: rgb(118, 70, 230);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 60px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterButton = styled.button`
  background: #2fe7ff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    background: #27c4da;
    transform: translateY(-2px);
  }
`;

const CursosHeader = styled.h1`
color: #344a88;
text-align: center;
font-size: 32px;
margin-bottom: 40px;
font-weight: bold;
`;

const CursosGrid = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 20px;
margin: 0 auto;

@media (max-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 480px) {
  grid-template-columns: 1fr;
}
`;

const CursoCard = styled.div`
background-color: #ffffff;
border-radius: 12px;
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
overflow: hidden;
display: flex;
flex-direction: column;
align-items: center;
padding: 30px 20px;
transition: transform 0.3s ease;

&:hover {
  transform: translateY(-5px);
}
`;

const IconContainer = styled.div`
background-color: ${props => props.bgColor || '#e9f7ff'};
width: 60px;
height: 60px;
border-radius: 12px;
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 15px;
`;

const CursoTitle = styled.h3`
color: #2c3e50;
font-size: 18px;
font-weight: 600;
margin-bottom: 10px;
text-align: center;
`;

const CursoDesc = styled.p`
color: #7f8c8d;
font-size: 14px;
text-align: center;
margin-bottom: 15px;
line-height: 1.4;
`;

const InscribeButton = styled.button`
background-color: ${props => props.bgColor || '#ff6b6b'};
color: white;
border: none;
border-radius: 20px;
padding: 8px 20px;
font-size: 14px;
font-weight: 600;
cursor: pointer;
display: flex;
align-items: center;
gap: 5px;
transition: background-color 0.3s ease;

&:hover {
  background-color: ${props => props.hoverColor || '#ff5252'};
}
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
  &:hover {
    background: #f0f0f0;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
  color: white;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 150px;
`;