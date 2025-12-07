import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookText, BookOpen, Calculator, Landmark, Beaker, Atom, Globe, Monitor, LockKeyhole, ChevronRight, AlertTriangle, X, Info, Crown, Star, Shield, User, LogOut, Rocket, TrendingUp, Grid3x3, Puzzle, Gamepad2, Brain, Target, Dices, Shuffle, Zap, Trophy, Award, Sparkles, Layers, Search } from 'lucide-react';

export function SelecNivel() {
  const navigate = useNavigate();
  const [lockedActivity, setLockedActivity] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  // 🔍 ESTADOS PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // 🎮 ESTADOS PARA MODALES DE COMPRA
const [showSuccessModal, setShowSuccessModal] = useState({ show: false, activity: null, remainingCoins: 0 });
const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState({ show: false, activity: null, currentCoins: 0, neededCoins: 0 });

  // 🎮 ESTADOS PARA ACTIVIDADES DESBLOQUEADAS
  const [unlockedActivities, setUnlockedActivities] = useState([]);

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
        setUser(parsedUser);
        
        // 🎮 CARGAR ACTIVIDADES DESBLOQUEADAS DEL USUARIO
        const unlockedData = localStorage.getItem(`unlockedActivities_${parsedUser.id}`);
        if (unlockedData) {
          setUnlockedActivities(JSON.parse(unlockedData));
        }
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

  // Grados educativos con juegos interactivos
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
          route: '/SopaLetrasCiencias',
          imageUrl: '././juegos/sopa-letras.jpg'
        },
        {
          name: 'Dicho, refrán o pregón',
          icon: <Puzzle size={24} />,
          color: '#5BA7F7',
          description: 'Resuelve problemas divertidos',
          ageRange: '6-12 años',
          locked: false,
          route: '/EjerciciosPreguntas',
          imageUrl: '././juegos/puzzle-math.jpg'
        },
        {
          name: 'Memorama de Ciencias',
          icon: <Layers size={24} />,
          color: '#3B82F6',
          description: 'Encuentra las parejas científicas',
          ageRange: '6-12 años',
          locked: false,
          route: '/MemoramaCiencias',
          imageUrl: '././juegos/memorama-ciencias.jpg'
        },
        {
          name: 'Trivias de Valores',
          icon: <Trophy size={24} />,
          color: '#2563EB',
          description: 'Responde preguntas sobre ética',
          ageRange: '6-12 años',
          locked: false,
          route: '/TriviasValores',
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
          locked: true,
          route: '/LaboratorioVirtual',
          imageUrl: '././juegos/lab-virtual.jpg'
        },
        {
          name: 'Quiz Químico',
          icon: <Zap size={24} />,
          color: '#A78BFA',
          description: 'Identifica elementos y reacciones',
          ageRange: '12-15 años',
          locked: true,
          route: '/QuizQuimico',
          imageUrl: '././juegos/quiz-quimica.jpg'
        },
        {
          name: 'Crucigrama Biológico',
          icon: <Grid3x3 size={24} />,
          color: '#C4B5FD',
          description: 'Completa términos de biología',
          ageRange: '12-15 años',
          locked: true,
          route: '/CrucigramaBiologico',
          imageUrl: '././juegos/crucigrama-bio.jpg'
        },
        {
          name: 'Línea del Tiempo',
          icon: <Target size={24} />,
          color: '#DDD6FE',
          description: 'Ordena eventos históricos',
          ageRange: '12-15 años',
          locked: true,
          route: '/LineaTiempo',
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
          locked: true,
          route: '/DesafioMatematico',
          imageUrl: '././juegos/desafio-calc.jpg'
        },
        {
          name: 'Ahorcado Literario',
          icon: <Gamepad2 size={24} />,
          color: '#FB923C',
          description: 'Adivina obras y autores famosos',
          ageRange: '15-18 años',
          locked: true,
          route: '/AhorcadoLiterario',
          imageUrl: '././juegos/ahorcado-lit.jpg'
        },
        {
          name: 'Debate Filosófico',
          icon: <Sparkles size={24} />,
          color: '#FDBA74',
          description: 'Analiza dilemas éticos',
          ageRange: '15-18 años',
          locked: true,
          route: '/DebateFilosofico',
          imageUrl: '././juegos/debate-filo.jpg'
        },
        {
          name: 'Code Challenge',
          icon: <Dices size={24} />,
          color: '#EA580C',
          description: 'Completa retos de programación',
          ageRange: '15-18 años',
          locked: true,
          route: '/CodeChallenge',
          imageUrl: '././juegos/code-challenge.jpg'
        }
      ]
    }
  ];

  // 🎮 FUNCIÓN PARA VERIFICAR SI UNA ACTIVIDAD ESTÁ DESBLOQUEADA
  const isActivityUnlocked = (activity) => {
    // Si no está bloqueada originalmente, está desbloqueada
    if (!activity.locked) return true;
    
    // Verificar si fue desbloqueada con cristales
    return unlockedActivities.includes(activity.route);
  };

  // 🎮 FUNCIÓN PARA DESBLOQUEAR ACTIVIDAD CON CRISTALES (REEMPLAZAR LA EXISTENTE)
const handleUnlockWithCoins = (activity) => {
  const UNLOCK_COST = 8;
  
  if (!user) {
    navigate('/Login');
    return;
  }
  
  // Verificar si ya está desbloqueada
  if (unlockedActivities.includes(activity.route)) {
    navigate(activity.route);
    return;
  }
  
  // Verificar si tiene suficientes cristales
  const currentCoins = user.coins || 0;
  if (currentCoins < UNLOCK_COST) {
    // Mostrar panel de error
    setShowInsufficientCoinsModal({
      show: true,
      activity: activity,
      currentCoins: currentCoins,
      neededCoins: UNLOCK_COST
    });
    return;
  }
  
  // Descontar cristales
  const updatedCoins = currentCoins - UNLOCK_COST;
  const updatedUser = { ...user, coins: updatedCoins };
  
  // Actualizar usuario en localStorage y estado
  localStorage.setItem('user', JSON.stringify(updatedUser));
  setUser(updatedUser);
  
  // Agregar actividad a la lista de desbloqueadas
  const newUnlockedActivities = [...unlockedActivities, activity.route];
  setUnlockedActivities(newUnlockedActivities);
  
  // Guardar en localStorage de forma persistente
  localStorage.setItem(`unlockedActivities_${user.id}`, JSON.stringify(newUnlockedActivities));
  
  // Mostrar panel de éxito
  setShowSuccessModal({
    show: true,
    activity: activity,
    remainingCoins: updatedCoins
  });
 

  // Navegar a la actividad
  //setTimeout(() => {
    //navigate(activity.route);
  //}, 500);
};

  const handleActivityClick = (activity) => {
    // Si está desbloqueada (ya sea originalmente o comprada), navegar
    if (isActivityUnlocked(activity)) {
      navigate(activity.route);
    } else {
      // Si está bloqueada, mostrar modal premium
      setLockedActivity(activity);
    }
  };
  
  const closeModal = () => {
    setLockedActivity(null);
  };

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  // 🔍 FUNCIÓN DE FILTRADO
  const getFilteredCategories = () => {
    if (!debouncedSearch.trim()) {
      return gradeCategories;
    }

    const searchLower = debouncedSearch.toLowerCase();
    
    return gradeCategories
      .map(category => ({
        ...category,
        activities: category.activities.filter(activity =>
          activity.name.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower) ||
          category.category.toLowerCase().includes(searchLower)
        )
      }))
      .filter(category => category.activities.length > 0);
  };

  const filteredCategories = getFilteredCategories();

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
        
        {/* 🔍 BUSCADOR EN EL HEADER */}
        <HeaderSearchWrapper>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <HeaderSearchInput
            type="text"
            placeholder="Buscar juegos educativos..."
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
            <NavLink href="#">GRADOS</NavLink>
            <NavLink href="precios">PRECIOS</NavLink>
            {user ? (
              <>
                {/* Contenedor de Monedas */}
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

        {/* 🔍 INFO DE RESULTADOS */}
        {debouncedSearch && (
          <SearchResultsInfo>
            {filteredCategories.reduce((acc, cat) => acc + cat.activities.length, 0)} 
            {' juegos encontrados'}
          </SearchResultsInfo>
        )}

        <SectionTitle>JUEGOS EDUCATIVOS</SectionTitle>
        
        {filteredCategories.map((category, categoryIndex) => (
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
                      {activity.locked && !isActivityUnlocked(activity) && (
                        <LockedBadge>
                          <LockKeyhole size={14} />
                        </LockedBadge>
                      )}
                    </ActivityImageContainer>

                    <ActivityContent>
                      <ActivityName>{activity.name}</ActivityName>
                      <ActivityDescription>
                        {activity.description} <br/>
                        <AgeRange>{activity.ageRange}</AgeRange>
                      </ActivityDescription>
                    </ActivityContent>
                    
                   {/* 🎮 LÓGICA DE BOTONES SEGÚN ESTADO DE DESBLOQUEO */}
{isActivityUnlocked(activity) ? (
  // ACTIVIDAD DESBLOQUEADA - Botón para jugar
  <CourseButton
    locked={false}
    onClick={() => navigate(activity.route)}
  >
    <Gamepad2 size={16} />
    <span>¡Jugar Ahora!</span>
    <ChevronRight size={16} />
  </CourseButton>
) : (
  // ACTIVIDAD BLOQUEADA - Opciones de desbloqueo
  <LockedContainer>
    <LockTooltip>
      <Info size={12} />
      <span>Disponible con KnowlyPlus o 8 cristales</span>
    </LockTooltip>
    <ButtonsColumn>
      <CourseButton
        locked={true}
        onClick={() => handleActivityClick(activity)}
      >
        <span>Plan Premium</span>
      </CourseButton>
      <UnlockWithCoinsButton
        onClick={() => handleUnlockWithCoins(activity)}
      >
        <CoinIconSmall src="/coin.png" alt="Coin" />
        <span>Desbloquear con 8 Cristales</span>
      </UnlockWithCoinsButton>
    </ButtonsColumn>
  </LockedContainer>
)}
                  </ActivityCard>
                ))}
              </ActivitiesGrid>
            </CategorySection>
          </React.Fragment>
        ))}

        {/* 🔍 MENSAJE SIN RESULTADOS */}
        {filteredCategories.length === 0 && debouncedSearch && (
          <NoResultsContainer>
            <NoResultsIcon>
              <Search size={48} />
            </NoResultsIcon>
            <NoResultsTitle>No se encontraron juegos</NoResultsTitle>
            <NoResultsText>
              Intenta con otros términos de búsqueda
            </NoResultsText>
            <ClearSearchButton onClick={() => setSearchTerm('')}>
              Limpiar búsqueda
            </ClearSearchButton>
          </NoResultsContainer>
        )}
      </Main>

      {lockedActivity && (
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
                <strong>{lockedActivity.name}</strong> está disponible con KnowlyPlus.
                <br/><br/>
                Accede a todos los juegos y contenido exclusivo sin límites.
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
        {/* 🎮 MODAL DE ÉXITO */}
{/* 🎮 MODAL DE ÉXITO */}
{showSuccessModal.show && (
  <ModalOverlay onClick={() => {
    // Solo cerrar el modal, NO navegar
    setShowSuccessModal({ show: false, activity: null, remainingCoins: 0 });
  }}>
    <SuccessModalContent onClick={(e) => e.stopPropagation()}>
      <SuccessIcon>
        <Trophy size={60} color="#10b981" />
      </SuccessIcon>
      <SuccessTitle>¡Actividad Desbloqueada!</SuccessTitle>
      <SuccessMessage>
        <strong>{showSuccessModal.activity?.name}</strong> ahora está disponible para ti.
      </SuccessMessage>
      <CoinsInfoBox>
        <CoinIconMedium src="/coin.png" alt="Coin" />
        <CoinsInfoText>
          Cristales restantes: <strong>{showSuccessModal.remainingCoins}</strong>
        </CoinsInfoText>
      </CoinsInfoBox>
      <SuccessButton onClick={() => {
        // Cerrar modal Y navegar solo cuando hacen clic en el botón
        setShowSuccessModal({ show: false, activity: null, remainingCoins: 0 });
        navigate(showSuccessModal.activity.route);
      }}>
        <Gamepad2 size={18} />
        Ir a la Actividad
        <ChevronRight size={18} />
      </SuccessButton>
    </SuccessModalContent>
  </ModalOverlay>
)}
{/* 🎮 MODAL DE CRISTALES INSUFICIENTES */}
{showInsufficientCoinsModal.show && (
  <ModalOverlay onClick={() => setShowInsufficientCoinsModal({ show: false, activity: null, currentCoins: 0, neededCoins: 0 })}>
    <ErrorModalContent onClick={(e) => e.stopPropagation()}>
      <ErrorIcon>
        <AlertTriangle size={60} color="#ef4444" />
      </ErrorIcon>
      <ErrorTitle>Cristales Insuficientes</ErrorTitle>
      <ErrorMessage>
        No tienes suficientes cristales para desbloquear <strong>{showInsufficientCoinsModal.activity?.name}</strong>
      </ErrorMessage>
      <CoinsComparisonBox>
        <CoinsComparisonItem>
          <CoinsLabel>Tienes:</CoinsLabel>
          <CoinsValue insufficient>
            <CoinIconMedium src="/coin.png" alt="Coin" />
            {showInsufficientCoinsModal.currentCoins}
          </CoinsValue>
        </CoinsComparisonItem>
        <CoinsComparisonDivider>/</CoinsComparisonDivider>
        <CoinsComparisonItem>
          <CoinsLabel>Necesitas:</CoinsLabel>
          <CoinsValue>
            <CoinIconMedium src="/coin.png" alt="Coin" />
            {showInsufficientCoinsModal.neededCoins}
          </CoinsValue>
        </CoinsComparisonItem>
      </CoinsComparisonBox>
      <ErrorButtonsRow>
        <ErrorSecondaryButton onClick={() => setShowInsufficientCoinsModal({ show: false, activity: null, currentCoins: 0, neededCoins: 0 })}>
          Cerrar
        </ErrorSecondaryButton>
        <ErrorPrimaryButton onClick={() => {
          setShowInsufficientCoinsModal({ show: false, activity: null, currentCoins: 0, neededCoins: 0 });
          navigate('/precios');
        }}>
          <Sparkles size={16} />
          Obtener Cristales
        </ErrorPrimaryButton>
      </ErrorButtonsRow>
    </ErrorModalContent>
  </ModalOverlay>
)}

    </GradosContainer>
  );
}


export default SelecNivel;

// 🎨 CAMBIO: ButtonsRow por ButtonsColumn
const ButtonsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const UnlockWithCoinsButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CoinIconSmall = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

// 🎉 MODAL DE ÉXITO
const SuccessModalContent = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 450px;
  width: 90%;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: successAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }

  @keyframes successAppear {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const SuccessIcon = styled.div`
  margin-bottom: 1.5rem;
  animation: bounceIn 0.6s ease;

  @keyframes bounceIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SuccessTitle = styled.h3`
  color: #10b981;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
`;

const SuccessMessage = styled.p`
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;

  strong {
    color: #1e293b;
    font-weight: 700;
  }
`;

const CoinsInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 2px solid #fbbf24;
`;

const CoinIconMedium = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const CoinsInfoText = styled.span`
  color: #92400e;
  font-size: 1rem;
  font-weight: 600;

  strong {
    font-size: 1.25rem;
    font-weight: 800;
  }
`;

const SuccessButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ❌ MODAL DE ERROR
const ErrorModalContent = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 450px;
  width: 90%;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: errorShake 0.5s ease;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  }

  @keyframes errorShake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-5px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(5px);
    }
  }
`;

const ErrorIcon = styled.div`
  margin-bottom: 1.5rem;
  animation: pulse 2s ease infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const ErrorTitle = styled.h3`
  color: #ef4444;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
`;

const ErrorMessage = styled.p`
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;

  strong {
    color: #1e293b;
    font-weight: 700;
  }
`;

const CoinsComparisonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 2px solid #e2e8f0;
`;

const CoinsComparisonItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CoinsLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CoinsValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.insufficient ? '#ef4444' : '#10b981'};
`;

const CoinsComparisonDivider = styled.span`
  color: #cbd5e1;
  font-size: 2rem;
  font-weight: 300;
`;

const ErrorButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const ErrorSecondaryButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

const ErrorPrimaryButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
`;
// Styled Components
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
  background-color: ${props => props.color}20;
  
  ${ActivityCard}:hover & {
    transform: scale(1.1);
  }

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

const LockedBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(245, 158, 11, 0.95);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  backdrop-filter: blur(10px);
  animation: lockPulse 2s ease-in-out infinite;

  @keyframes lockPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
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

const LockedContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
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
const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
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