import React, { useState, useEffect, useRef } from 'react';
import { ROLE, getUserRole, isAdmin, isPremium, isFree } from '../utils/roles';
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
  Rocket,
  TrendingUp,
  Search,
  Coins
} from 'lucide-react';
import { API_ENDPOINTS } from '../utils/config';

const CATEGORIAS_ALL_API = API_ENDPOINTS.CATEGORIAS_ALL;
const LEADERBOARD_KEY = 'knowly_leaderboard';

export function Home() {
  const navigate = useNavigate();

  // 🔐 Sesión / usuario
  const [lockedSubject, setLockedSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 🏆 Ranking global
  const [leaderboard, setLeaderboard] = useState([]);

  //prueba de rol
  console.log("ROL:", getUserRole());
console.log("isPremium:", isPremium());
console.log("isAdmin:", isAdmin());
console.log("isFree:", isFree());


  // 🔍 Buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🎯 Panel de score
  const [showScorePanel, setShowScorePanel] = useState(false);

  // 📚 Categorías / asignaturas desde API
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState(null);

  // Helper: icono y color según nombre de asignatura
  const getSubjectIconAndColor = (subjectName) => {
    const name = (subjectName || '').toLowerCase();

    if (name.includes('mate')) {
      return { icon: <Calculator size={24} />, color: '#8B5CF6' };
    }
    if (name.includes('quím') || name.includes('quim')) {
      return { icon: <Beaker size={24} />, color: '#A78BFA' };
    }
    if (name.includes('fís') || name.includes('fis')) {
      return { icon: <Atom size={24} />, color: '#C4B5FD' };
    }
    if (name.includes('hist')) {
      return { icon: <Landmark size={24} />, color: '#F97316' };
    }
    if (name.includes('geo')) {
      return { icon: <Globe size={24} />, color: '#FB923C' };
    }
    if (name.includes('info') || name.includes('program') || name.includes('unity')) {
      return { icon: <Monitor size={24} />, color: '#10B981' };
    }
    if (name.includes('ingl')) {
      return { icon: <BookText size={24} />, color: '#4A90E2' };
    }

    // Por defecto
    return { icon: <BookOpen size={24} />, color: '#6366F1' };
  };

  // Helper: color de fondo según nombre de categoría
  const getCategoryBackgroundColor = (categoryName) => {
    const name = (categoryName || '').toLowerCase();

    if (name.includes('leng') || name.includes('idioma') || name.includes('ingl')) {
      return '#E8F4FD';
    }
    if (name.includes('saber') || name.includes('cient')) {
      return '#F0E8FF';
    }
    if (
      name.includes('ética') ||
      name.includes('etica') ||
      name.includes('socied') ||
      name.includes('naturaleza')
    ) {
      return '#FFF0E8';
    }
    if (name.includes('info') || name.includes('tecno')) {
      return '#E8FFF4';
    }

    return '#F1F5V9';
  };

  // 🏆 Sincronizar usuario con leaderboard global (localStorage)
  const syncLeaderboardWithUser = (userData) => {
    try {
      if (!userData) return;

      const identifier =
        userData.id ||
        userData._id ||
        userData.email ||
        userData.username ||
        userData.name;

      if (!identifier) return;

      const stored = localStorage.getItem(LEADERBOARD_KEY);
      let list = [];

      if (stored) {
        list = JSON.parse(stored);
        if (!Array.isArray(list)) list = [];
      }

      const existingIndex = list.findIndex((p) => p.id === identifier);

      const entry = {
        id: identifier,
        name: userData.name || userData.username || 'Usuario',
        points: userData.points || 0,
        avatarInitial:
          (userData.name || userData.username || 'U')
            .toString()
            .charAt(0)
            .toUpperCase(),
        lastUpdated: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        const prev = list[existingIndex];
        list[existingIndex] = {
          ...prev,
          ...entry,
          points: Math.max(prev.points || 0, entry.points || 0),
        };
      } else {
        list.push(entry);
      }

      // Ordenar de mayor a menor puntos
      list.sort((a, b) => b.points - a.points);

      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
      setLeaderboard(list);
    } catch (error) {
      console.error('Error sincronizando leaderboard:', error);
    }
  };

  // 🔐 Cargar sesión de usuario
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');

        if (!userData) {
          navigate('/Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        // Normalizar idrol e id a número por seguridad
        if (parsedUser.idrol !== undefined) parsedUser.idrol = Number(parsedUser.idrol);
        if (parsedUser.id !== undefined) parsedUser.id = Number(parsedUser.id);
        setUser(parsedUser);

        // Sincronizar con ranking
        syncLeaderboardWithUser(parsedUser);
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

  // Clics fuera del menú usuario
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

  // Debounce para buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 📡 Cargar categorías y asignaturas desde Laravel
  useEffect(() => {
    const fetchCategoriasAll = async () => {
      try {
        setSubjectsLoading(true);
        setSubjectsError(null);

        const res = await fetch(CATEGORIAS_ALL_API, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const raw = await res.text();
          throw new Error(`Error HTTP ${res.status}: ${raw}`);
        }

        const data = await res.json(); // array que ya viste

        const mapped = data.map((bloque) => {
          const categoriaNombre = bloque.categoria?.nombre || 'Sin categoría';

          return {
            category: categoriaNombre,
            color: getCategoryBackgroundColor(categoriaNombre),
            subjects: (bloque.asignaturas || []).map((asig) => {
              const { icon, color } = getSubjectIconAndColor(asig.nombre || '');

              return {
                id: asig.id,
                name: asig.nombre,
                icon,
                color,
                description: `Grado: ${asig.grado} · Nivel: ${asig.nivel}`,
                ageRange: '6-18 años', // lo puedes ajustar después
                locked: asig.tipo === 'premium',
              };
            }),
          };
        });

        setSubjectCategories(mapped);
      } catch (err) {
        console.error(err);
        setSubjectsError(err.message || 'Error al cargar categorías y asignaturas');
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchCategoriasAll();
  }, []);

  // 🔐 Cargar sesión de usuario
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');

        if (!userData) {
          navigate('/Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        // Normalizar idrol e id a número por seguridad
        if (parsedUser.idrol !== undefined) parsedUser.idrol = Number(parsedUser.idrol);
        if (parsedUser.id !== undefined) parsedUser.id = Number(parsedUser.id);
        setUser(parsedUser);

        // Sincronizar con ranking
        syncLeaderboardWithUser(parsedUser);
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

  // Nuevo helper: determinar si el usuario puede acceder a una asignatura (desbloquear premium si user.id === 1)
  const canAccessSubject = (subject) => {
    // Si el contenido NO está bloqueado → puedes acceder
    if (!subject.locked) return true;

    // Si no está autenticado → NO puede
    if (!user) return false;

    // Obtener el idrol que devuelve tu backend
    const role = getUserRole(); // Esto devuelve: 1 = free, 2 = premium, 3 = admin

    // Solo PREMIUM (idrol = 2) puede entrar
    if (role === 2) return true;

    return false; // Todos los demás quedan fuera
};


  const handleSubjectClick = (subject) => {
    if (!canAccessSubject(subject)) {
      setLockedSubject(subject);
    } else {
      navigate(`/Actividades/${subject.id}`, {
        state: {
          subjectName: subject.name,
        },
      });
    }
  };

  const closeModal = () => {
    setLockedSubject(null);
  };

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleScorePanel = () => {
    setShowScorePanel(!showScorePanel);
  };

  // Filtrado de categorías por buscador
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
    if (role === ROLE.PREMIUM || isPremium()) {
      return {
        text: `Bienvenido ${user.name}`,
        icon: <Crown size={24} />,
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        bgColor: '#fffbeb',
        borderColor: '#fbbf24'
      };
    }
    if (role === ROLE.FREE || isFree()) {
      return {
        text: `Bienvenido ${user.name}`,
        icon: <Star size={24} />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        bgColor: '#eff6ff',
        borderColor: '#3b82f6'
      };
    }
    // admin
    return {
      text: `Bienvenido Administrador ${user.name}`,
      icon: <Shield size={24} />,
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      bgColor: '#fef2f2',
      borderColor: '#dc2626'
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
            <NavLink href="SelecNivel">GRADOS</NavLink>
            <NavLink href="precios">PRECIOS</NavLink>
            {user ? (
              <>
                <CoinsContainer>
                  <CoinIcon>
                    <img src="/coin.png" alt="Coin" />
                  </CoinIcon>
                  <CoinsAmount>{user.coins || 0}</CoinsAmount>
                </CoinsContainer>
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
              </>
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

        {/* Info de carga/errores de asignaturas */}
        {subjectsLoading && (
          <SearchResultsInfo>
            Cargando asignaturas...
          </SearchResultsInfo>
        )}

        {subjectsError && !subjectsLoading && (
          <SearchResultsInfo style={{ color: '#ef4444' }}>
            Error al cargar asignaturas: {subjectsError}
          </SearchResultsInfo>
        )}

        {/* 🔍 INFO DE RESULTADOS */}
        {debouncedSearch && !subjectsLoading && !subjectsError && (
          <SearchResultsInfo>
            {filteredCategories.reduce((acc, cat) => acc + cat.subjects.length, 0)}{' '}
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
                {category.subjects.map((subject, index) => {
                  const isLocked = !canAccessSubject(subject);
                  return (
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

                      {isLocked ? (
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
                  );
                })}
              </SubjectsGrid>
            </CategorySection>

            {/* Banners intermedios */}
            {category.category.toLowerCase().includes('saberes') && (
              <MidSectionAds>
                <AdBannerHorizontal gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)">
                  <AdBannerIcon>
                    <Rocket size={40} />
                  </AdBannerIcon>
                  <AdBannerContent>
                    <AdBannerTitle>¡Impulsa tu Aprendizaje!</AdBannerTitle>
                    <AdBannerDescription>
                      Accede a ejercicios ilimitados y contenido exclusivo
                    </AdBannerDescription>
                  </AdBannerContent>
                  <AdBannerButton onClick={() => navigate('/precios')}>
                    Ver Planes
                  </AdBannerButton>
                </AdBannerHorizontal>

                <AdBannerHorizontal gradient="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)">
                  <AdBannerIcon>
                    <TrendingUp size={40} />
                  </AdBannerIcon>
                  <AdBannerContent>
                    <AdBannerTitle>Mejora tus Resultados</AdBannerTitle>
                    <AdBannerDescription>
                      Únete a miles de estudiantes que ya están triunfando
                    </AdBannerDescription>
                  </AdBannerContent>
                  <AdBannerButton onClick={() => navigate('/precios')}>
                    Descubre Cómo
                  </AdBannerButton>
                </AdBannerHorizontal>
              </MidSectionAds>
            )}
          </React.Fragment>
        ))}

        {/* 🔍 MENSAJE SIN RESULTADOS */}
        {filteredCategories.length === 0 && debouncedSearch && !subjectsLoading && !subjectsError && (
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
      </Main>

      {/* Banners de pie de página */}
      <FooterAds>
        <FooterAdBanner gradient="linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)">
          <FooterAdImageWrapper>
            <FooterAdImage />
            <FooterAdBadge>NUEVO</FooterAdBadge>
          </FooterAdImageWrapper>
          <FooterAdContent>
            <FooterAdTitle>¡Oferta Especial de Lanzamiento!</FooterAdTitle>
            <FooterAdDescription>
              KnowlyPlus con <strong>50% de descuento</strong> en tu primer mes
            </FooterAdDescription>
            <FooterAdButton onClick={() => navigate('/precios')}>
              Aprovechar Oferta
              <ChevronRight size={18} />
            </FooterAdButton>
          </FooterAdContent>
        </FooterAdBanner>

        <FooterAdBanner gradient="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)">
          <FooterAdImageWrapper>
            <FooterAdImage2 />
            <FooterAdBadge>PREMIUM</FooterAdBadge>
          </FooterAdImageWrapper>
          <FooterAdContent>
            <FooterAdTitle>Desbloquea Todo el Contenido</FooterAdTitle>
            <FooterAdDescription>
              Acceso ilimitado a todas las materias y recursos educativos
            </FooterAdDescription>
            <FooterAdButton onClick={() => navigate('/precios')}>
              Explorar Premium
              <ChevronRight size={18} />
            </FooterAdButton>
          </FooterAdContent>
        </FooterAdBanner>
      </FooterAds>

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
                <strong>{lockedSubject.name}</strong> está disponible con KnowlyPlus.
                <br /><br />
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

      {/* 🎯 BOTÓN FLOTANTE SCOREBOARD */}
      <ScoreFloatingButton onClick={toggleScorePanel}>
        <LayoutDashboard size={24} />
      </ScoreFloatingButton>

      {/* 🎯 PANEL DESLIZANTE SCOREBOARD */}
      <ScorePanelOverlay isOpen={showScorePanel} onClick={toggleScorePanel} />
      <ScorePanel isOpen={showScorePanel}>
        <ScorePanelHeader>
          <ScorePanelTitle>
            <LayoutDashboard size={20} />
            Tablero de Puntuaciones
          </ScorePanelTitle>
          <CloseScorePanelButton onClick={toggleScorePanel}>
            <X size={20} />
          </CloseScorePanelButton>
        </ScorePanelHeader>

        <ScorePanelContent>
          {leaderboard && leaderboard.length > 0 ? (
            <>
              {/* Resumen del usuario actual */}
              {user && (
                <CurrentUserSummary>
                  <CurrentUserTitle>Tu posición</CurrentUserTitle>
                  {(() => {
                    const identifier =
                      user.id ||
                      user._id ||
                      user.email ||
                      user.username ||
                      user.name;
                    const rankIndex = leaderboard.findIndex(
                      (p) => p.id === identifier
                    );
                    const rank = rankIndex >= 0 ? rankIndex + 1 : null;
                    const points = user.points || 0;

                    return (
                      <CurrentUserCard>
                        <CurrentUserInfo>
                          <CurrentUserAvatar>
                            {(user.name || user.username || 'U')
                              .toString()
                              .charAt(0)
                              .toUpperCase()}
                          </CurrentUserAvatar>
                          <CurrentUserTextGroup>
                            <CurrentUserName>
                              {user.name || user.username || 'Tú'}
                            </CurrentUserName>
                            <CurrentUserPoints>
                              {points} pts
                            </CurrentUserPoints>
                          </CurrentUserTextGroup>
                        </CurrentUserInfo>
                        {rank && (
                          <CurrentUserRank>
                            #{rank} del ranking
                          </CurrentUserRank>
                        )}
                      </CurrentUserCard>
                    );
                  })()}
                </CurrentUserSummary>
              )}

              {/* Lista del ranking global */}
              <LeaderboardTitle>Ranking Global</LeaderboardTitle>
              <LeaderboardList>
                {leaderboard.map((player, index) => {
                  const isCurrent =
                    user &&
                    (player.id === user.id ||
                      player.id === user.email ||
                      player.id === user.username ||
                      player.id === user.name);

                  return (
                    <LeaderboardItem
                      key={player.id || player.name + index}
                      isCurrent={isCurrent}
                    >
                      <RankBadge rank={index + 1}>
                        {index + 1 === 1 && <Crown size={18} />}
                        {index + 1 > 1 && `#${index + 1}`}
                      </RankBadge>
                      <PlayerInfo>
                        <PlayerAvatar isCurrent={isCurrent}>
                          {player.avatarInitial ||
                            player.name.charAt(0).toUpperCase()}
                        </PlayerAvatar>
                        <PlayerTextGroup>
                          <PlayerName isCurrent={isCurrent}>
                            {player.name}
                          </PlayerName>
                          <PlayerSubText>
                            {player.points} pts
                          </PlayerSubText>
                        </PlayerTextGroup>
                      </PlayerInfo>
                    </LeaderboardItem>
                  );
                })}
              </LeaderboardList>
            </>
          ) : (
            <EmptyScoreMessage>
              <Star size={48} color="#d1d5db" />
              <EmptyScoreText>
                Aún no hay datos en el ranking. Juega algunos ejercicios para ver tus puntos aquí.
              </EmptyScoreText>
            </EmptyScoreMessage>
          )}
        </ScorePanelContent>
      </ScorePanel>
    </HomeContainer>
  );
}

export default Home;

/* =======================
   STYLED COMPONENTS
   ======================= */

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

// 🔍 NUEVOS ESTILOS PARA EL BUSCADOR EN EL HEADER
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

const CoinsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    margin-right: 0.3rem;
  }
`;

const CoinIcon = styled.div`
  color: #fbbf24;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5));
  animation: coinFloat 3s ease-in-out infinite;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  @keyframes coinFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(10deg); }
  }

  @media (max-width: 768px) {
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const CoinsAmount = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 0.9rem;
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
  transition: all 0.2s.ease;

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
  animation: fadeIn 0.4s.ease;

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
  background: linear-gradient(135deg, ${props => props.color}15 0%, ${props => props.color}25 100%);
  border: 3px solid ${props => props.color};
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${props => props.color};
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
  background: ${props => props.locked ? 
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
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
    background: ${props => props.locked ? 
      'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 
      'linear-gradient(135deg, #059669 0%, #047857 100%)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.locked ? 
      'rgba(245, 158, 11, 0.3)' : 
      'rgba(16, 185, 129, 0.3)'};
  }
`;

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
  animation: floatIcon 3s.ease-in-out infinite;
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
    content: '🚀';
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

// Botón flotante lateral derecho
const ScoreFloatingButton = styled.button`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s.ease;
  z-index: 999;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

// Overlay oscuro cuando el panel está abierto
const ScorePanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s.ease;
`;

// Panel deslizante
const ScorePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Encabezado del panel
const ScorePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 2px solid #f3f4f6;
  background: linear-gradient(135deg, #b53bf6ff 0%, #6366f1 100%);
  color: white;
`;

// Título del panel
const ScorePanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Botón de cerrar panel
const CloseScorePanelButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s.ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Contenido del panel
const ScorePanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// Mensaje cuando está vacío
const EmptyScoreMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  gap: 16px;
`;

// Texto del mensaje vacío
const EmptyScoreText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

const CurrentUserSummary = styled.div`
  margin-bottom: 24px;
`;

const CurrentUserTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
`;

const CurrentUserCard = styled.div`
  border-radius: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CurrentUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CurrentUserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);
`;

const CurrentUserTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const CurrentUserName = styled.span`
  font-weight: 700;
  color: #111827;
  font-size: 0.95rem;
`;

const CurrentUserPoints = styled.span`
  font-size: 0.85rem;
  color: #4b5563;
`;

const CurrentUserRank = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.12);
  padding: 6px 10px;
  border-radius: 999px;
`;

const LeaderboardTitle = styled.h3`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin: 20px 0 10px 0;
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${props => (props.isCurrent ? '#eef2ff' : '#f9fafb')};
  border: 1px solid ${props => (props.isCurrent ? '#7c3aed' : '#e5e7eb')};
  box-shadow: ${props =>
    props.isCurrent ? '0 4px 10px rgba(124, 58, 237, 0.2)' : 'none'};
`;

const RankBadge = styled.div`
  min-width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;

  background: ${({ rank }) =>
    rank === 1
      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      : rank === 2
      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
      : rank === 3
      ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
      : '#e5e7eb'};
  color: ${props => (props.rank <= 3 ? 'white' : '#111827')};
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const PlayerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: ${props =>
    props.isCurrent
      ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
      : '#e5e7eb'};
  color: ${props => (props.isCurrent ? 'white' : '#374151')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
`;

const PlayerTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => (props.isCurrent ? '#111827' : '#111827')};
`;

const PlayerSubText = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`;
