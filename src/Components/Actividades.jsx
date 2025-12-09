import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  User,
  LogOut,
  Search,
  X,
  ClipboardList,
  Activity as ActivityIcon,
  CheckCircle2,
  Clock4,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export function Actividades() {
  const navigate = useNavigate();
  const location = useLocation();
  const { asignaturaId } = useParams(); // 🔹 /actividades/:asignaturaId
  const menuRef = useRef(null);
  const { subjectName } = location.state || {};
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [asignatura, setAsignatura] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [loadingActividades, setLoadingActividades] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  // 🔍 BUSCADOR
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ✅ 1. Verificar sesión de usuario
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');

        if (!userData) {
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
        setLoadingUser(false);
      }
    };

    checkUserSession();
  }, [navigate]);

  // ✅ 2. Cerrar menú al hacer click fuera
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
  useEffect(() => {
  if (!asignaturaId) return;

  const fetchActividades = async () => {
    try {
      setLoadingActividades(true);
      setApiError(null);

      const res = await fetch(
        `http://localhost:8000/api/asignaturas/${asignaturaId}/actividades`
      );

      if (!res.ok) {
        throw new Error('No se pudieron cargar las actividades');
      }

      const data = await res.json();
      setAsignatura(data.asignatura || null);
      setActividades(data.actividades || []);
    } catch (error) {
      console.error(error);
      setApiError(error.message);
    } finally {
      setLoadingActividades(false);
    }
  };

  fetchActividades();
}, [asignaturaId]);


  // ✅ 3. Debounce del buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ 4. Traer actividades por asignatura
  useEffect(() => {
    if (!asignaturaId) return;

    const fetchActividades = async () => {
      try {
        setLoadingActividades(true);
        setApiError(null);

        // Pedimos todas las actividades (hide_completed=0) y confiamos en que backend
        // incluya `completada: true/false` por actividad.
        const res = await fetch(`http://localhost:8000/api/asignaturas/${asignaturaId}/actividades?hide_completed=0`);

        if (!res.ok) {
          throw new Error('No se pudieron cargar las actividades');
        }

        const data = await res.json();
        setAsignatura(data.asignatura || null);
        // data.actividades debe traer campo `completada`
        setActividades(Array.isArray(data.actividades) ? data.actividades : []);
      } catch (error) {
        console.error(error);
        setApiError(error.message);
      } finally {
        setLoadingActividades(false);
      }
    };

    fetchActividades();
  }, [asignaturaId]);

  // 🔍 Filtrado de actividades
  const getFilteredActivities = () => {
    if (!debouncedSearch.trim()) {
      return actividades;
    }

    const searchLower = debouncedSearch.toLowerCase();

    return actividades.filter((act) =>
      (act.nombre || '').toLowerCase().includes(searchLower) ||
      (act.descripcion || '').toLowerCase().includes(searchLower) ||
      (act.estatus || '').toLowerCase().includes(searchLower)
    );
  };

  const filteredActivities = getFilteredActivities();
  // excluir actividades que ya estén completadas para las secciones Activas/Inactivas
  const activeActivities = filteredActivities.filter((a) => a.estatus === 'activo' && !a.completada);
  const inactiveActivities = filteredActivities.filter((a) => a.estatus === 'inactivo' && !a.completada);
  const completedActivities = filteredActivities.filter((a) => !!a.completada);

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

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleBackToAsignaturas = () => {
    navigate('/Asignaturas');
  };

  const handleGoToPreguntas = (actividad) => {
    // 🔹 Aquí luego puedes cambiar la ruta a donde tengas las preguntas
    // Ejemplo: /actividades/:actividadId/preguntas
    navigate(`/actividades/${actividad.id}/preguntas`);
  };

  if (loadingUser) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Verificando sesión...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Logo src="/Knowly.png" alt="Knowly" />

        {/* 🔍 BUSCADOR EN EL HEADER */}
        <HeaderSearchWrapper>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <HeaderSearchInput
            type="text"
            placeholder="Buscar actividades..."
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
            <NavLink href="Asignaturas">ASIGNATURAS</NavLink>
            <NavLink href="SelecNivel">JUEGOS</NavLink>
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
                  Regístrate
                </RegisterButton>
              </>
            )}
          </NavItemsWrapper>
        </Nav>
      </Header>

      <Main>
        {/* Breadcrumb / volver */}
        <BreadcrumbRow>
          <BackButton onClick={handleBackToAsignaturas}>
            <ArrowLeft size={18} />
            Volver a Asignaturas
          </BackButton>

          {asignatura && (
            <AsignaturaTag>
              <ClipboardList size={16} />
              <span>
                {asignatura.nombre} — {asignatura.grado} ({asignatura.nivel})
              </span>
            </AsignaturaTag>
          )}
        </BreadcrumbRow>

        {/* Título principal */}
        <SectionTitle>
  {asignatura
    ? `Actividades de ${asignatura.nombre}`
    : subjectName
      ? `Actividades de ${subjectName}`
      : 'Actividades'}
</SectionTitle>


        {/* Info de resultados */}
        {debouncedSearch && (
          <SearchResultsInfo>
            {filteredActivities.length} {' actividades encontradas'}
          </SearchResultsInfo>
        )}

        {/* Errores / loading actividades */}
        {apiError && (
          <ErrorBox>
            <p>{apiError}</p>
          </ErrorBox>
        )}

        {loadingActividades && (
          <LoadingBlock>
            <LoadingSpinner />
            <LoadingText>Cargando actividades...</LoadingText>
          </LoadingBlock>
        )}

        {!loadingActividades && !apiError && filteredActivities.length === 0 && (
          <NoResultsContainer>
            <NoResultsIcon>
              <Search size={48} />
            </NoResultsIcon>
            <NoResultsTitle>No se encontraron actividades</NoResultsTitle>
            <NoResultsText>
              Intenta con otros términos de búsqueda o verifica que esta asignatura tenga actividades registradas.
            </NoResultsText>
            <ClearSearchButton onClick={() => setSearchTerm('')}>
              Limpiar búsqueda
            </ClearSearchButton>
          </NoResultsContainer>
        )}

        {/* Sección ACTIVAS */}
        {!loadingActividades && activeActivities.length > 0 && (
          <CategorySection>
            <CategoryHeader backgroundColor="#E8F9F0">
              <CategoryTitle>
                <CheckCircle2 size={20} />
                <span>Actividades Activas</span>
              </CategoryTitle>
            </CategoryHeader>

            <ActivitiesGrid>
              {activeActivities.map((actividad) => (
                <ActivityCard key={actividad.id}>
                  <ActivityIconHeader status="activo">
                    <CircleIcon status="activo">
                      <ActivityIcon size={22} />
                    </CircleIcon>
                    <StatusTextActivo>Activo</StatusTextActivo>
                  </ActivityIconHeader>

                  <ActivityContent>
                    <ActivityName>{actividad.nombre}</ActivityName>
                    {actividad.descripcion && (
                      <ActivityDescription>{actividad.descripcion}</ActivityDescription>
                    )}
                  </ActivityContent>

                  <ActivityFooter>
                    
                    <GoButton onClick={() => handleGoToPreguntas(actividad)}>
                      Ver preguntas
                      <ChevronRight size={16} />
                    </GoButton>
                  </ActivityFooter>
                </ActivityCard>
              ))}
            </ActivitiesGrid>
          </CategorySection>
        )}

        {/* Sección FINALIZADAS */}
        {!loadingActividades && completedActivities.length > 0 && (
          <CategorySection>
            <CategoryHeader backgroundColor="#EFF6FF">
              <CategoryTitle>
                <CheckCircle2 size={20} />
                <span>Actividades Finalizadas</span>
              </CategoryTitle>
            </CategoryHeader>

            <ActivitiesGrid>
              {completedActivities.map((actividad) => (
                <ActivityCard key={`done-${actividad.id}`}>
                  <ActivityIconHeader status="finalizado">
                    <CircleIcon status="activo">
                      <CheckCircle2 size={22} />
                    </CircleIcon>
                    <StatusTextActivo>Finalizada</StatusTextActivo>
                  </ActivityIconHeader>

                  <ActivityContent>
                    <ActivityName>{actividad.nombre}</ActivityName>
                    {actividad.descripcion && (
                      <ActivityDescription>{actividad.descripcion}</ActivityDescription>
                    )}
                  </ActivityContent>

                  <ActivityFooter>
                    <GoButton onClick={() => handleGoToPreguntas(actividad)}>
                      Ver preguntas
                      <ChevronRight size={16} />
                    </GoButton>
                  </ActivityFooter>
                </ActivityCard>
              ))}
            </ActivitiesGrid>
          </CategorySection>
        )}

        {/* Sección INACTIVAS */}
        {!loadingActividades && inactiveActivities.length > 0 && (
          <CategorySection>
            <CategoryHeader backgroundColor="#FFF4E5">
              <CategoryTitle>
                <Clock4 size={20} />
                <span>Actividades Inactivas</span>
              </CategoryTitle>
            </CategoryHeader>

            <ActivitiesGrid>
              {inactiveActivities.map((actividad) => (
                <ActivityCard key={actividad.id}>
                  <ActivityIconHeader status="inactivo">
                    <CircleIcon status="inactivo">
                      <ActivityIcon size={22} />
                    </CircleIcon>
                    <StatusTextInactivo>Inactivo</StatusTextInactivo>
                  </ActivityIconHeader>

                  <ActivityContent>
                    <ActivityName>{actividad.nombre}</ActivityName>
                    {actividad.descripcion && (
                      <ActivityDescription>{actividad.descripcion}</ActivityDescription>
                    )}
                  </ActivityContent>

                  <ActivityFooter>
                    
                    <GoButton disabled>
                      Próximamente
                    </GoButton>
                  </ActivityFooter>
                </ActivityCard>
              ))}
            </ActivitiesGrid>
          </CategorySection>
        )}
      </Main>
    </PageContainer>
  );
}

export default Actividades;

/* ===========================
   STYLED COMPONENTS
   =========================== */

const PageContainer = styled.div`
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
  max-height: 60px;
  height: auto;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;

  @media (max-width: 768px) {
    max-height: 50px;
    max-width: 140px;
  }
`;

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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const SectionTitle = styled.h1`
  color: #1e293b;
  text-align: center;
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-transform: uppercase;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchResultsInfo = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

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
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }
`;

const ActivityIconHeader = styled.div`
  padding: 1rem 1.2rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CircleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status }) =>
    status === 'activo'
      ? 'linear-gradient(135deg, #22c55e33, #4ade8033)'
      : 'linear-gradient(135deg, #f9731633, #facc1533)'};
  color: ${({ status }) => (status === 'activo' ? '#16a34a' : '#ea580c')};
  border: 2px solid
    ${({ status }) => (status === 'activo' ? '#16a34a55' : '#ea580c55')};
`;

const StatusTextActivo = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #16a34a;
  text-transform: uppercase;
`;

const StatusTextInactivo = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #ea580c;
  text-transform: uppercase;
`;

const ActivityContent = styled.div`
  padding: 0.5rem 1.2rem 0.75rem;
  flex: 1;
`;

const ActivityName = styled.h3`
  color: #111827;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ActivityDescription = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
`;

const ActivityFooter = styled.div`
  padding: 0.75rem 1.2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const LevelTag = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: #f3f4f6;
`;

const GoButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  background: ${props =>
    props.disabled
      ? '#e5e7eb'
      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'};
  color: ${props => (props.disabled ? '#9ca3af' : 'white')};
  box-shadow: ${props =>
    props.disabled ? 'none' : '0 4px 12px rgba(59,130,246,0.35)'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => (props.disabled ? 'none' : 'translateY(-1px)')};
    box-shadow: ${props =>
      props.disabled ? 'none' : '0 6px 16px rgba(59,130,246,0.45)'};
  }
`;

const BreadcrumbRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    transform: translateX(-2px);
  }
`;

const AsignaturaTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.85rem;
  font-weight: 600;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const LoadingBlock = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
