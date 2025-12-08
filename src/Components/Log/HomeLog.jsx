import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookText,
  BookOpen,
  Calculator,
  Landmark,
  Beaker,
  Atom,
  Globe,
  Monitor,
  LockKeyhole,
  ChevronRight,
  AlertTriangle,
  X,
  Info,
  Crown,
  Star,
  Shield,
  User,
  LogOut,
  Search,
} from 'lucide-react';
import { ROLE, getUserRole, isAdmin, isPremium } from '../../utils/roles';

// 👇 IMPORTAMOS EL DASHBOARD DE SUPERSET
import KnowlyDashboard from '../KnowlyDash.jsx';

export function HomeLog() {
  const navigate = useNavigate();
  const [lockedSubject, setLockedSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 🔍 ESTADOS PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🔢 ESTADO PARA CAMBIAR ENTRE VISTA ESTUDIANTE / PANEL ADMIN
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // useEffect para obtener datos del usuario al cargar el componente
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        // Normalizar idrol y dejarlo en localStorage
        const roleVal =
          parsedUser.idrol ??
          parsedUser.role ??
          parsedUser.id_role ??
          parsedUser.role_id;

        parsedUser.idrol =
          roleVal !== undefined && roleVal !== null ? Number(roleVal) : null;

        localStorage.setItem('user', JSON.stringify(parsedUser));
        console.log('HomeLog: user cargado desde localStorage:', parsedUser);
        console.log('HomeLog: getUserRole():', getUserRole());

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

  // 🔍 useEffect PARA DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Organizados por categorías con paleta de colores unificada
  const subjectCategories = [
    {
      category: 'Lenguajes',
      color: '#E8F4FD',
      subjects: [
        {
          name: 'Inglés',
          icon: <BookText size={24} />,
          color: '#4A90E2',
          description: 'Aprende inglés de manera interactiva',
          ageRange: '6-18 años',
          locked: false,
        },
        {
          name: 'Verbos',
          icon: <BookOpen size={24} />,
          color: '#5BA7F7',
          description: 'Domina la conjugación verbal',
          ageRange: '8-16 años',
          locked: false,
        },
      ],
    },
    {
      category: 'Saberes y Pensamiento Cientifico',
      color: '#F0E8FF',
      subjects: [
        {
          name: 'Matemáticas',
          icon: <Calculator size={24} />,
          color: '#8B5CF6',
          description: 'Matemáticas paso a paso',
          ageRange: '6-18 años',
          locked: false,
        },
        {
          name: 'Química',
          icon: <Beaker size={24} />,
          color: '#A78BFA',
          description: 'Experimentos y teoría química',
          ageRange: '12-18 años',
          locked: false,
        },
        {
          name: 'Física',
          icon: <Atom size={24} />,
          color: '#C4B5FD',
          description: 'Física aplicada y conceptual',
          ageRange: '14-18 años',
          locked: false,
        },
      ],
    },
    {
      category: 'Etica, Naturaleza y Sociedades',
      color: '#FFF0E8',
      subjects: [
        {
          name: 'Historia',
          icon: <Landmark size={24} />,
          color: '#F97316',
          description: 'Historia universal y regional',
          ageRange: '10-18 años',
          locked: false,
        },
        {
          name: 'Geografía',
          icon: <Globe size={24} />,
          color: '#FB923C',
          description: 'Geografía física y humana',
          ageRange: '8-16 años',
          locked: false,
        },
      ],
    },
    {
      category: 'Tecnología',
      color: '#E8FFF4',
      subjects: [
        {
          name: 'Informática',
          icon: <Monitor size={24} />,
          color: '#10B981',
          description: 'Programación y tecnología',
          ageRange: '12-18 años',
          locked: false,
        },
      ],
    },
  ];

  const handleSubjectClick = (subject) => {
    if (subject.locked) {
      setLockedSubject(subject);
    } else {
      navigate('/Asignaturas');
    }
  };

  const closeModal = () => {
    setLockedSubject(null);
  };

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  // 🔍 FUNCIÓN DE FILTRADO
  const getFilteredCategories = () => {
    if (!debouncedSearch.trim()) {
      return subjectCategories;
    }

    const searchLower = debouncedSearch.toLowerCase();

    return subjectCategories
      .map((category) => ({
        ...category,
        subjects: category.subjects.filter(
          (subject) =>
            subject.name.toLowerCase().includes(searchLower) ||
            subject.description.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((category) => category.subjects.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  const getWelcomeMessage = () => {
    if (!user) return null;
    const role = getUserRole();
    if (role === ROLE.ADMIN || isAdmin()) {
      return {
        text: `Bienvenido Administrador ${user.name}`,
        icon: <Shield size={24} />,
        gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        bgColor: '#fef2f2',
        borderColor: '#dc2626',
      };
    }
    if (role === ROLE.PREMIUM || isPremium()) {
      return {
        text: `Bienvenido ${user.name}`,
        icon: <Star size={24} />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        bgColor: '#eff6ff',
        borderColor: '#3b82f6',
      };
    }
    // free o default
    return {
      text: `Bienvenido ${user.name} 🎉`,
      icon: <Crown size={24} />,
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      bgColor: '#fffbeb',
      borderColor: '#fbbf24',
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowMenu(false);
    navigate('/Login');
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate('/Perfil');
  };

  const handleAdminClick = () => {
    setShowMenu(false);
    navigate('/Dashboard');
  };

  if (loading) {
    return (
      <HomeContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Verificando sesión...</LoadingText>
        </LoadingContainer>
      </HomeContainer>
    );
  }

  const welcomeData = getWelcomeMessage();
  const role = getUserRole();
  const isUserAdmin = role === ROLE.ADMIN || isAdmin();

  return (
    <HomeContainer>
      <Header>
        <Logo src="././Knowly.png" alt="Knowly" />

        {/* 🔍 BUSCADOR EN EL HEADER */}
        <HeaderSearchWrapper>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <HeaderSearchInput
            type="text"
            placeholder="Buscar asignaturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <ClearButton onClick={() => setSearchTerm('')}>
              <X size={16} />
            </ClearButton>
          )}
        </HeaderSearchWrapper>

        <Nav>
          <NavItemsWrapper>
            <NavLink href="#">ASIGNATURAS</NavLink>
            <NavLink href="SelecLog">GRADOS</NavLink>
            <NavLink href="precios">PRECIOS</NavLink>
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
                    <MenuItem onClick={handleAdminClick}>
                      <LayoutDashboard size={16} />
                      <span>Administrador</span>
                    </MenuItem>
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
                <RegisterButton onClick={() => navigate('/registro')}>
                  Registrate
                </RegisterButton>
              </>
            )}
          </NavItemsWrapper>
        </Nav>
      </Header>

      <Main>
        {/* Mensaje de bienvenida dinámico */}
        {user && welcomeData && (
          <WelcomeSection
            bgColor={welcomeData.bgColor}
            borderColor={welcomeData.borderColor}
          >
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

        {/* 🔁 PESTAÑAS SOLO PARA ADMIN */}
        {user && isUserAdmin && (
          <AdminTabsWrapper>
            <AdminTab
              type="button"
              active={!showAdminDashboard}
              onClick={() => setShowAdminDashboard(false)}
            >
              Vista estudiante
            </AdminTab>
            <AdminTab
              type="button"
              active={showAdminDashboard}
              onClick={() => setShowAdminDashboard(true)}
            >
              Panel administrativo
            </AdminTab>
          </AdminTabsWrapper>
        )}

        {/* SI ES ADMIN Y ESTÁ EN PANEL, MOSTRAMOS SUPERSET */}
        {user && isUserAdmin && showAdminDashboard ? (
          <DashboardWrapper>
            <KnowlyDashboard />
          </DashboardWrapper>
        ) : (
          <>
            {/* 🔍 INFO DE RESULTADOS */}
            {debouncedSearch && (
              <SearchResultsInfo>
                {filteredCategories.reduce(
                  (acc, cat) => acc + cat.subjects.length,
                  0
                )}{' '}
                resultados encontrados
              </SearchResultsInfo>
            )}

            <SectionTitle>CATEGORÍAS</SectionTitle>

            {filteredCategories.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <CategorySection>
                  <CategoryHeader backgroundColor={category.color}>
                    <CategoryTitle>{category.category}</CategoryTitle>
                  </CategoryHeader>

                  <SubjectsGrid>
                    {category.subjects.map((subject, index) => (
                      <SubjectCard key={index}>
                        <SubjectContent>
                          <IconContainer color={subject.color}>
                            {subject.icon}
                          </IconContainer>
                          <SubjectName>{subject.name}</SubjectName>
                          <SubjectDescription>
                            {subject.description} <br />
                            <AgeRange>{subject.ageRange}</AgeRange>
                          </SubjectDescription>
                        </SubjectContent>

                        {subject.locked ? (
                          <LockedContainer>
                            <LockIcon>
                              <LockKeyhole size={16} />
                            </LockIcon>
                            <LockTooltip>
                              <Info size={12} />
                              <span>Disponible con KnowlyPlus</span>
                            </LockTooltip>
                            <CourseButton
                              locked={true}
                              onClick={() => handleSubjectClick(subject)}
                            >
                              <span>Ver Plan Premium</span>
                            </CourseButton>
                          </LockedContainer>
                        ) : (
                          <CourseButton
                            locked={false}
                            onClick={() => handleSubjectClick(subject)}
                          >
                            <span>Unirme</span>
                            <ChevronRight size={16} />
                          </CourseButton>
                        )}
                      </SubjectCard>
                    ))}
                  </SubjectsGrid>
                </CategorySection>
              </React.Fragment>
            ))}

            {/* 🔍 MENSAJE SIN RESULTADOS */}
            {filteredCategories.length === 0 && debouncedSearch && (
              <NoResultsContainer>
                <NoResultsIcon>
                  <Search size={48} />
                </NoResultsIcon>
                <NoResultsTitle>No se encontraron asignaturas</NoResultsTitle>
                <NoResultsText>
                  Intenta con otros términos de búsqueda
                </NoResultsText>
                <ClearSearchButton onClick={() => setSearchTerm('')}>
                  Limpiar búsqueda
                </ClearSearchButton>
              </NoResultsContainer>
            )}
          </>
        )}
      </Main>

      {lockedSubject && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <AlertTriangle color="#F97316" size={24} />
                Contenido Premium
              </ModalTitle>
              <CloseButton onClick={closeModal}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                <strong>{lockedSubject.name}</strong> está disponible con
                KnowlyPlus.
                <br />
                <br />
                Accede a todas las materias y contenido exclusivo.
              </p>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>
                Más tarde
              </SecondaryButton>
              <ConfirmButton onClick={() => navigate('/precios')}>
                Ver Planes
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </HomeContainer>
  );
}

export default HomeLog;

/* ===================== STYLED COMPONENTS ===================== */

const HomeContainer = styled.div`
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
  gap: 1.5rem;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const Logo = styled.img`
  height: 60px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 50px;
  }
`;

// 🔍 ESTILOS PARA EL BUSCADOR EN EL HEADER
const HeaderSearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  flex: 1;
  max-width: 800px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:focus-within {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1024px) {
    order: 3;
    flex: 1 1 100%;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const HeaderSearchInput = styled.input`
  width: 100%;
  padding: 0.65rem 2.8rem 0.65rem 2.8rem;
  border: none;
  border-radius: 30px;
  font-size: 0.9rem;
  color: white;
  background: transparent;
  outline: none;
  font-weight: 500;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 2.5rem 0.6rem 2.5rem;
    font-size: 0.85rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.3s ease;

  ${HeaderSearchWrapper}:focus-within & {
    color: white;
  }

  @media (max-width: 768px) {
    left: 0.8rem;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.8rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;
    right: 0.6rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    order: 2;
  }

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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const WelcomeSection = styled.div`
  background: ${(props) => props.bgColor};
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 3px solid ${(props) => props.borderColor};
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
    background: ${(props) => props.borderColor};
    animation: shimmer 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
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
  background: ${(props) => props.gradient};
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
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const WelcomeText = styled.h1`
  background: ${(props) => props.gradient};
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

/* 🔁 PESTAÑAS ADMIN */

const AdminTabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AdminTab = styled.button`
  padding: 0.6rem 1.6rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${(props) =>
    props.active
      ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
      : '#e5e7eb'};
  color: ${(props) => (props.active ? 'white' : '#4b5563')};
  box-shadow: ${(props) =>
    props.active ? '0 6px 18px rgba(124, 58, 237, 0.35)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const DashboardWrapper = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  background: #ffffff;
  height: calc(100vh - 230px); /* Ajusta si quieres más/menos alto */

  @media (max-width: 768px) {
    height: 70vh;
  }
`;

const SearchResultsInfo = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  animation: fadeIn 0.4s ease;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const NoResultsIcon = styled.div`
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  opacity: 0.6;
`;

const NoResultsTitle = styled.h3`
  color: #475569;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NoResultsText = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ClearSearchButton = styled.button`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
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
  background: ${(props) => props.backgroundColor};
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

const SubjectsGrid = styled.div`
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

const SubjectCard = styled.div`
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

const SubjectContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const IconContainer = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.color}15 0%,
    ${(props) => props.color}25 100%
  );
  border: 3px solid ${(props) => props.color};
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${(props) => props.color};
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(10deg) scale(1.1);
  }
`;

const SubjectName = styled.h3`
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SubjectDescription = styled.p`
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

const LockedContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const LockIcon = styled.div`
  color: #f59e0b;
  opacity: 0.7;
`;

const LockTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const CourseButton = styled.button`
  background: ${(props) =>
    props.locked
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
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
    background: ${(props) =>
      props.locked
        ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
        : 'linear-gradient(135deg, #059669 0%, #047857 100%)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px
      ${(props) =>
        props.locked
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(16, 185, 129, 0.3)'};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f97316;
  font-size: 1.3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    gap: 8px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SecondaryButton = styled.button`
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const ConfirmButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

