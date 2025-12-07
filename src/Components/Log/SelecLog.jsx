import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookText, BookOpen, Calculator, Landmark, Beaker, Atom, Globe, Monitor, LockKeyhole, ChevronRight, AlertTriangle, X, Info, Crown, Star, Shield, User, LogOut, Rocket, TrendingUp, Grid3x3, Puzzle, Gamepad2, Brain, Target, Dices, Shuffle, Zap, Trophy, Award, Sparkles, Layers } from 'lucide-react';

export function Selec() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // useEffect para obtener datos del usuario al cargar el componente
  useEffect(() => {
    const checkUserSession = () => {
      try {
        // Obtener datos del usuario del localStorage (guardados después del login)
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          // Si no hay datos de usuario, redirigir al login
          navigate('/Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        localStorage.removeItem('user');
        navigate('/Login');
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [navigate]);

  // useEffect para manejar clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Grados educativos con juegos interactivos - TODOS DESBLOQUEADOS
  const gradeCategories = [
    {
      category: "Primaria",
      color: "#E8F4FD",
      activities: [
        {
          name: 'Sopa de Letras',
          icon: <Grid3x3 size={24} />,
          color: '#4A90E2',
          description: 'Encuentra palabras escondidas',
          ageRange: '6-12 años',
          locked: false,
          imageUrl: '././juegos/sopa-letras.jpg'
        },
        {
          name: 'Rompecabezas Matemático',
          icon: <Puzzle size={24} />,
          color: '#5BA7F7',
          description: 'Resuelve problemas divertidos',
          ageRange: '6-12 años',
          locked: true,
          imageUrl: '././juegos/puzzle-math.jpg'
        },
        {
          name: 'Memorama de Ciencias',
          icon: <Layers size={24} />,
          color: '#3B82F6',
          description: 'Encuentra las parejas científicas',
          ageRange: '6-12 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/memorama-ciencias.jpg'
        },
        {
          name: 'Trivias de Valores',
          icon: <Trophy size={24} />,
          color: '#2563EB',
          description: 'Responde preguntas sobre ética',
          ageRange: '6-12 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/trivia-valores.jpg'
        }
      ]
    },
    {
      category: "Secundaria",
      color: "#F0E8FF",
      activities: [
        {
          name: 'Laboratorio Virtual',
          icon: <Beaker size={24} />,
          color: '#8B5CF6',
          description: 'Experimenta con física interactiva',
          ageRange: '12-15 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/lab-virtual.jpg'
        },
        {
          name: 'Quiz Químico',
          icon: <Zap size={24} />,
          color: '#A78BFA',
          description: 'Identifica elementos y reacciones',
          ageRange: '12-15 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/quiz-quimica.jpg'
        },
        {
          name: 'Crucigrama Biológico',
          icon: <Grid3x3 size={24} />,
          color: '#C4B5FD',
          description: 'Completa términos de biología',
          ageRange: '12-15 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/crucigrama-bio.jpg'
        },
        {
          name: 'Línea del Tiempo',
          icon: <Target size={24} />,
          color: '#DDD6FE',
          description: 'Ordena eventos históricos',
          ageRange: '12-15 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/linea-tiempo.jpg'
        }
      ]
    },
    {
      category: "Preparatoria",
      color: "#FFF0E8",
      activities: [
        {
          name: 'Desafío Matemático',
          icon: <Brain size={24} />,
          color: '#F97316',
          description: 'Resuelve ecuaciones complejas',
          ageRange: '15-18 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/desafio-calc.jpg'
        },
        {
          name: 'Ahorcado Literario',
          icon: <Gamepad2 size={24} />,
          color: '#FB923C',
          description: 'Adivina obras y autores famosos',
          ageRange: '15-18 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/ahorcado-lit.jpg'
        },
        {
          name: 'Debate Filosófico',
          icon: <Sparkles size={24} />,
          color: '#FDBA74',
          description: 'Analiza dilemas éticos',
          ageRange: '15-18 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/debate-filo.jpg'
        },
        {
          name: 'Code Challenge',
          icon: <Dices size={24} />,
          color: '#EA580C',
          description: 'Completa retos de programación',
          ageRange: '15-18 años',
          locked: false, // CAMBIADO A FALSE
          imageUrl: '././juegos/code-challenge.jpg'
        }
      ]
    }
  ];

  const handleActivityClick = (activity) => {
    // Ahora todos pueden acceder directamente
    console.log('Juego seleccionado:', activity.name); // Para debug
    navigate('/Ejercicios');
  };

  // Función para alternar la visibilidad del menú
  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para obtener el mensaje de bienvenida según el rol
  const getWelcomeMessage = () => {
    if (!user) return null;

    switch (user.idrol) {
      case 1:
        return {
          text: `Bienvenido Administrador ${user.name}`,
          icon: <Shield size={24} />,
          gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          bgColor: '#fef2f2',
          borderColor: '#dc2626'
        };
      case 2:
        return {
          text: `Bienvenido ${user.name}`,
          icon: <Star size={24} />,
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          bgColor: '#eff6ff',
          borderColor: '#3b82f6'
        };
      case 3:
        return {
          text: `Bienvenido ${user.name} 🎉`,
          icon: <Crown size={24} />,
          gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          bgColor: '#fffbeb',
          borderColor: '#fbbf24'
        };
      default:
        return {
          text: `Bienvenido ${user.name}`,
          icon: <Star size={24} />,
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          bgColor: '#eff6ff',
          borderColor: '#3b82f6'
        };
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowMenu(false);
    navigate('/Login');
  };

  // Función para ir al perfil
  const handleProfileClick = () => {
    setShowMenu(false);
    navigate('/Perfil');
  };

  const handleAdminClick = () => {
    setShowMenu(false);
    navigate('/Dashboard');
  };

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <GradosContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Verificando sesión...</LoadingText>
        </LoadingContainer>
      </GradosContainer>
    );
  }

  const welcomeData = getWelcomeMessage();

  return (
    <GradosContainer>
      <Header>
        <Logo src="././Knowly.png" alt="Knowly" />
        <Nav>
          <NavItemsWrapper>
            <NavLink href="HomeLog">ASIGNATURAS</NavLink>
            <NavLink href="SelecNivel">GRADOS</NavLink>
            <NavLink href="Precios">PRECIOS</NavLink>
            {user ? (
              <UserInfo ref={menuRef}>
                <UserAvatar onClick={toggleUserMenu}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </UserAvatar>
                {showMenu && (
                  <UserMenuDropdown>
                    <MenuItem onClick={handleProfileClick}>
                      <User size={16} />
                      <span>Perfil</span>
                    </MenuItem>
                    {user.idrol === 1 && (
                      <MenuItem onClick={handleAdminClick}>
                        <LayoutDashboard size={16} />
                        <span>Administrador</span>
                      </MenuItem>
                    )}
                    <MenuSeparator />
                    <MenuItem onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </MenuItem>
                  </UserMenuDropdown>
                )}
              </UserInfo>
            ) : (
              <>
                <NavLink href="Login">ACCEDE</NavLink>
                <RegisterButton onClick={() => navigate('/registro')}>Registrate</RegisterButton>
              </>
            )}
          </NavItemsWrapper>
        </Nav>
      </Header>

      <Main>
        {/* Mensaje de bienvenida dinámico */}
        {user && welcomeData && (
          <WelcomeSection bgColor={welcomeData.bgColor} borderColor={welcomeData.borderColor}>
            <WelcomeContent>
              <WelcomeIcon gradient={welcomeData.gradient}>
                {welcomeData.icon}
              </WelcomeIcon>
              <WelcomeText gradient={welcomeData.gradient}>
                {welcomeData.text}
              </WelcomeText>
            </WelcomeContent>
          </WelcomeSection>
        )}

        <SectionTitle>JUEGOS EDUCATIVOS</SectionTitle>
        
        {gradeCategories.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            <CategorySection>
              <CategoryHeader backgroundColor={category.color}>
                <CategoryTitle>{category.category}</CategoryTitle>
              </CategoryHeader>
              
              <ActivitiesGrid>
                {category.activities.map((activity, index) => (
                  <ActivityCard key={index}>
                    <ActivityImageContainer>
                      <ActivityImage 
                        imageUrl={activity.imageUrl} 
                        color={activity.color}
                      >
                        <ActivityIconOverlay color={activity.color}>
                          {activity.icon}
                        </ActivityIconOverlay>
                      </ActivityImage>
                    </ActivityImageContainer>

                    <ActivityContent>
                      <ActivityName>{activity.name}</ActivityName>
                      <ActivityDescription>
                        {activity.description} <br/>
                        <AgeRange>{activity.ageRange}</AgeRange>
                      </ActivityDescription>
                    </ActivityContent>
                    
                    <CourseButton
                      locked={false}
                      onClick={() => handleActivityClick(activity)}
                    >
                      <Gamepad2 size={16} />
                      <span>¡Jugar Ahora!</span>
                      <ChevronRight size={16} />
                    </CourseButton>
                  </ActivityCard>
                ))}
              </ActivitiesGrid>
            </CategorySection>

          
          </React.Fragment>
        ))}
      </Main>

      
    </GradosContainer>
  );
}

export default Selec;

// Styled Components (mantienen el mismo estilo)
const GradosContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Header = styled.header`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const Logo = styled.img`
  height: 60px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-grow: 1;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
`;

const NavItemsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 5px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    color: #fbbf24;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.5rem 0.2rem;
  }
`;

const RegisterButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 1.8rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 13px;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
  animation: dropdownFadeIn 0.2s ease-out;

  @keyframes dropdownFadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    min-width: 160px;
    right: -10px;
  }
`;

const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #7c3aed;
    
    svg {
      color: #7c3aed;
    }
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }

  svg {
    color: #6b7280;
    transition: color 0.2s ease;
  }
`;

const MenuSeparator = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;

const Main = styled.main`
  padding: 2rem;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const WelcomeSection = styled.div`
  background: ${props => props.bgColor};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 3px solid ${props => props.borderColor};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.borderColor};
    animation: shimmer 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const WelcomeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const WelcomeIcon = styled.div`
  background: ${props => props.gradient};
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: pulse 2.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const WelcomeText = styled.h1`
  background: ${props => props.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.8px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const SectionTitle = styled.h1`
  color: #1e293b;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-transform: uppercase;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  background: ${props => props.backgroundColor};
  border-radius: 15px 15px 0 0;
  padding: 1rem 2rem;
  border-left: 5px solid #7c3aed;
`;

const CategoryTitle = styled.h2`
  color: #1e293b;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }

  @media (max-width: 500px) {
    margin: 0 auto;
    max-width: 300px;
  }
`;

const ActivityImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const ActivityImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: transform 0.4s ease;

  /* Si no hay imagen, muestra un gradiente con el color */
  background-color: ${props => props.color}20;
  
  ${ActivityCard}:hover & {
    transform: scale(1.1);
  }

  /* Fallback pattern si no hay imagen */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, ${props => props.color}15 25%, transparent 25%),
      linear-gradient(-45deg, ${props => props.color}15 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${props => props.color}15 75%),
      linear-gradient(-45deg, transparent 75%, ${props => props.color}15 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    opacity: 0.3;
  }
`;

const ActivityIconOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.color};
  background: rgba(255, 255, 255, 0.95);
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 3px solid ${props => props.color};
  
  svg {
    width: 40px;
    height: 40px;
  }

  ${ActivityCard}:hover & {
    transform: translate(-50%, -50%) rotate(10deg) scale(1.1);
  }
`;

const ActivityContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ActivityName = styled.h3`
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ActivityDescription = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const AgeRange = styled.span`
  color: #7c3aed;
  font-weight: 600;
  font-size: 0.8rem;
`;

const CourseButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }
`;

// BANNERS INTERMEDIOS
const MidSectionAds = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AdBannerHorizontal = styled.div`
  background: ${props => props.gradient};
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);

    &::before {
      transform: scale(1.5);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
`;

const AdBannerIcon = styled.div`
  color: white;
  flex-shrink: 0;
  animation: floatIcon 3s ease-in-out infinite;
  z-index: 1;

  @keyframes floatIcon {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
`;

const AdBannerContent = styled.div`
  flex: 1;
  color: white;
  z-index: 1;
`;

const AdBannerTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: white;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AdBannerDescription = styled.p`
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.95;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AdBannerButton = styled.button`
  background: white;
  color: #1e293b;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.8rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// BANNERS DE PIE DE PÁGINA
const FooterAds = styled.div`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-top: 2px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    gap: 1.5rem;
  }
`;

const FooterAdBanner = styled.div`
  background: ${props => props.gradient};
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterAdImageWrapper = styled.div`
  width: 200px;
  height: auto;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 150px;
  }
`;

const FooterAdImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('././Banner2.jpg');
  background-size: cover;
  background-position: center;
  transition: transform 0.4s ease;

  ${FooterAdBanner}:hover & {
    transform: scale(1.1);
  }
`;

const FooterAdImage2 = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  transition: transform 0.4s ease;

  &::after {
    content: '🎮';
  }

  ${FooterAdBanner}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const FooterAdBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: badgePulse 2s ease-in-out infinite;

  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const FooterAdContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FooterAdTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 0.7rem 0;
  color: white;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FooterAdDescription = styled.p`
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.95;
  line-height: 1.6;

  strong {
    font-weight: 800;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.2rem;
  }
`;

const FooterAdButton = styled.button`
  background: white;
  color: #1e293b;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    align-self: stretch;
    justify-content: center;
    padding: 0.8rem 1.5rem;
    font-size: 0.95rem;
  }
`;