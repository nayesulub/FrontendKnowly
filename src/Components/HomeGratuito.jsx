import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BookText,BookOpen,Calculator,Landmark,Beaker,Atom,Globe,Monitor,LockKeyhole,ChevronRight, AlertTriangle,UserCircle, X  } from 'lucide-react';


export function HomeGratuito() {
  const navigate = useNavigate();
  const [lockedSubject, setLockedSubject] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const subjects = [
    { 
      name: 'Simple past', 
      icon: <BookText size={24} />, 
      color: '#4a7dff',
      description: 'Contenido de matemáticas ideal para los pequeños', 
      ageRange: '6-10 años',
      locked: true 
    },
    { 
      name: 'Verbos', 
      icon: <BookOpen size={24} />, 
      color: '#4cd963',
      description: 'Contenido de matemáticas ideal para los pequeños', 
      ageRange: '6-10 años',
      locked: false 
    },
    { 
      name: 'Numeros', 
      icon: <Calculator size={24} />, 
      color: '#9179ff',
      description: 'Contenido de matemáticas ideal para alumnos de', 
      ageRange: '11-15 años',
      locked: false 
    },
    { 
      name: 'Monumentos', 
      icon: <Landmark size={24} />, 
      color: '#ff6b6b',
      description: 'Contenido de matemáticas ideal para alumnos de', 
      ageRange: '15-18 años',
      locked: true 
    },
    { 
      name: 'Elementos', 
      icon: <Beaker size={24} />, 
      color: '#ff85a2',
      description: 'Contenido de matemáticas para los más pequeños', 
      ageRange: '11-15 años',
      locked: true 
    },
    { 
      name: 'Formulas', 
      icon: <Atom size={24} />, 
      color: '#c278ff',
      description: 'Contenido de matemáticas ideal para alumnos de', 
      ageRange: '11-15 años',
      locked: true 
    },
    { 
      name: 'Continentes', 
      icon: <Globe size={24} />, 
      color: '#56c7ff',
      description: 'Contenido de matemáticas ideal para alumnos de', 
      ageRange: '11-15 años',
      locked: true 
    },
    { 
      name: 'Sistemas operativos', 
      icon: <Monitor size={24} />, 
      color: '#52c0c9',
      description: 'Contenido de matemáticas ideal para alumnos de', 
      ageRange: '15-18 años',
      locked: true 
    },
  ];

  const handleSubjectClick = (subject) => {
    if (subject.locked) {
      setLockedSubject(subject);
    } else {
      navigate(`/EjerciciosGratuitos`);
    }
  };
  const closeModal = () => {
    setLockedSubject(null);
  };

  return (
    <HomeContainer>
     <Header>
            <Logo src="././Knowly.png" alt="Knowly Logo" />
            <Nav>
              <NavLink href="#">Actividades</NavLink>
              <NavLink href="CursosLog">GRADOS</NavLink>
            

              {/* Área de Usuario con Menú Desplegable */}
              <UserProfile onClick={toggleMenu}> 
                GRATUITO <UserCircle size={32} />
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
      <LeftBanner>
          <BannerImage />
          <h6>Tenemos grandes promociones para ti!</h6>
          <p>¿HAMBRE?</p>
          <BannerButton>SABER MÁS</BannerButton>
        </LeftBanner>
  
        <RightBanner>
          <BannerImage />
          <h6>Tenemos grandes promociones para ti!</h6>
          <p>¿HAMBRE?</p>
          <BannerButton>SABER MÁS</BannerButton>
        </RightBanner>
      
    <Main>
        <SectionTitle>ACTIVIDADES</SectionTitle>
        <SubjectsGrid>
          {subjects.map((subject, index) => (
            <SubjectCard key={index}>
              <SubjectContent>
                <IconContainer color={subject.color}>
                  {subject.icon}
                </IconContainer>
                <SubjectName>{subject.name}</SubjectName>
                <SubjectDescription>
                  {subject.description} <br/>
                  {subject.ageRange}
                </SubjectDescription>
              </SubjectContent>
              <CourseButton 
                locked={subject.locked} 
                onClick={() => handleSubjectClick(subject)}
              >
                {subject.locked ? (
                  <>
                    <LockKeyhole size={16} />
                    <span>Bloqueado</span>
                  </>
                ) : (
                  <>
                    <span>Unirme</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </CourseButton>
            </SubjectCard>
          ))}
        </SubjectsGrid>
      </Main>

     {lockedSubject && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <AlertTriangle color="#ff6b6b" size={24} />
                Materia no disponible
              </ModalTitle>
              <CloseButton onClick={closeModal}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Contrata KnowlyPluss para acceder a {lockedSubject.name}  
               
                
              </p>
            </ModalBody>
            <ModalFooter>
              <ConfirmButton onClick={closeModal}>
                Entendido
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      
    </HomeContainer>
  );
}

export default HomeGratuito;

  // Styled Components
const HomeContainer = styled.div`
font-family: Arial, sans-serif;
display: flex;
flex-direction: column;
width: 100%;
min-height: 100vh;

`;

const Header = styled.header`
  background: rgb(118, 70, 230);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    overflow-x: auto;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 1rem;
  }
`;

const Logo = styled.img`
height: 70px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
  }
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

const Main = styled.main`
padding: 2rem;
flex: 1;
max-width: 1200px;
margin: 0 auto;
width: 100%;
`;

const SectionTitle = styled.h2`
color: #22437c;
text-align: center;
font-size: 1.8rem;
font-weight: bold;
margin-bottom: 2rem;
text-transform: uppercase;
`;

const SubjectsGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 1.5rem;
margin: 0 auto;
`;

const SubjectCard = styled.div`
background: white;
border-radius: 12px;
overflow: hidden;
display: flex;
flex-direction: column;
box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
transition: transform 0.3s ease;

&:hover {
  transform: translateY(-5px);
}
`;

const SubjectContent = styled.div`
padding: 1.2rem;
display: flex;
flex-direction: column;
align-items: center;
flex: 1;
`;

const IconContainer = styled.div`
background: ${props => props.color || '#f0f0f0'};
width: 60px;
height: 60px;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 1rem;
color: white;
`;

const SubjectName = styled.h3`
color: #22437c;
font-size: 1.1rem;
font-weight: bold;
margin-bottom: 0.5rem;
`;

const SubjectDescription = styled.p`
color: #666;
font-size: 0.8rem;
text-align: center;
margin-bottom: 1rem;
line-height: 1.4;
`;

const CourseButton = styled.button`
background: ${props => props.locked ? '#ff6b6b' : '#4cd963'};
color: white;
border: none;
border-radius: 20px;
padding: 0.5rem 1.5rem;
font-weight: bold;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
cursor: pointer;

&:hover {
  background: ${props => props.locked ? '#e05050' : '#3ab850'};
}
`;

const AdsContainer = styled.div`
position: absolute;
left: 0;
right: 0;
top: 15%;
display: flex;
justify-content: space-between;
padding: 0 1rem;
pointer-events: none;

@media (max-width: 1300px) {
  display: none;
}
`;

const AdBanner = styled.div`
width: 120px;
height: 600px;
background: #b3e3ff;
border-radius: 6px;
overflow: hidden;
display: flex;
flex-direction: column;
align-items: center;
pointer-events: auto;
`;

const AdImage = styled.div`
background: url('https://via.placeholder.com/120x400');
background-size: cover;
width: 100%;
height: 400px;
`;

const AdText = styled.div`
padding: 1rem 0.5rem;
text-align: center;
color: white;
font-weight: bold;
font-size: 0.8rem;
`;

const AdButton = styled.button`
background: white;
color: #0085cc;
border: none;
border-radius: 15px;
padding: 0.3rem 0.8rem;
font-size: 0.7rem;
font-weight: bold;
margin-top: 0.5rem;
cursor: pointer;

&:hover {
  background: #f5f5f5;
}
`;

const SideBanner = styled.div`
position: fixed;
top: 55%;
transform: translateY(-50%);
width: 100px;
background-color: white;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
border-radius: 15px;
padding: 6px;
text-align: center;
z-index: 10;
`;

const LeftBanner = styled(SideBanner)`
left: 2px;
`;

const RightBanner = styled(SideBanner)`
right: 2px;
`;

const BannerImage = styled.div`
width: 100%;
height: 280px;
background-image: url('././Banner.jpeg');
background-size: cover;
background-position: center;
border-radius: 10px;
margin-bottom: 10px;
`;

const BannerButton = styled.button`
background-color: #3498db;
color: white;
border: none;
padding: 2px 7px;
border-radius: 8px;
margin-top: 15px;
cursor: pointer;
transition: background-color 0.3s ease;

&:hover {
  background-color: #2980b9;
}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff6b6b;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  background-color: #4cd963;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3ab850;
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

const DropdownItem = styled(Link)`
display: block;
padding: 10px;
color: black;
text-decoration: none;
&:hover {
  background: #f0f0f0;
}
`;

