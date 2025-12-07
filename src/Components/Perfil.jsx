import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Mail, Globe, Lock, Edit2, BookOpen, Calculator, Users, LogOut, ArrowLeft, Save, X, Book, Award } from 'lucide-react';
import instance from "../api/axios";

// Configuración de niveles e iconos
const LEVEL_CONFIG = {
  1: { icon: '/niveles/nivel1.png', name: 'Aprendiz', pointsRequired: 0 },
  2: { icon: '/niveles/nivel2.png', name: 'Estudiante', pointsRequired: 50 },
  3: { icon: '/niveles/nivel3.png', name: 'Conocedor', pointsRequired: 250 },
  4: { icon: '/niveles/nivel4.png', name: 'Experto', pointsRequired: 500 },
  5: { icon: '/niveles/nivel5.png', name: 'Maestro', pointsRequired: 1000 },
  6: { icon: '/niveles/nivel6.png', name: 'Sabio', pointsRequired: 2000 },
  7: { icon: '/niveles/nivel7.png', name: 'Gurú', pointsRequired: 3500 },
  8: { icon: '/niveles/nivel8.png', name: 'Leyenda', pointsRequired: 5000 }
};

export function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    country: '',
    age: '',
    currentPassword: '',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Función para calcular nivel basado en puntos
  const calculateLevel = (points) => {
    let level = 1;
    for (let i = Object.keys(LEVEL_CONFIG).length; i >= 1; i--) {
      if (points >= LEVEL_CONFIG[i].pointsRequired) {
        level = i;
        break;
      }
    }
    return level;
  };

  // Función para calcular progreso al siguiente nivel
  const calculateProgress = (points) => {
    const currentLevel = calculateLevel(points);
    const nextLevel = currentLevel + 1;
    
    if (!LEVEL_CONFIG[nextLevel]) {
      return 100; // Máximo nivel alcanzado
    }
    
    const currentLevelPoints = LEVEL_CONFIG[currentLevel].pointsRequired;
    const nextLevelPoints = LEVEL_CONFIG[nextLevel].pointsRequired;
    const pointsInCurrentLevel = points - currentLevelPoints;
    const pointsNeededForNext = nextLevelPoints - currentLevelPoints;
    
    return (pointsInCurrentLevel / pointsNeededForNext) * 100;
  };

  // Verificar sesión de usuario
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setEditData({
            username: parsedUser.username || '',
            email: parsedUser.email || '',
            country: parsedUser.country || '',
            age: parsedUser.age || '',
            currentPassword: '',
            password: ''
          });
        } else {
          // Usuario demo si no hay sesión
          const demoUser = {
            username: 'Usuario Demo',
            email: 'usuario@ejemplo.com',
            country: 'México',
            age: 18,
            idrol: 2,
            points: 150 // Puntos demo para mostrar el sistema
          };
          setUser(demoUser);
          setEditData({
            username: demoUser.username,
            email: demoUser.email,
            country: demoUser.country,
            age: demoUser.age,
            currentPassword: '',
            password: ''
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Manejar clics fuera del menú
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

  const toggleUserMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelClick = () => {
    setEditData({
      username: user.username || '',
      email: user.email || '',
      country: user.country || '',
      age: user.age || '',
      currentPassword: '',
      password: ''
    });
    setIsEditing(false);
    setSaveError(null);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
  
    try {
      // Validaciones
      if (!editData.username || !editData.email) {
        throw new Error('El usuario y el email son obligatorios.');
      }
  
      if (!/^\S+@\S+\.\S+$/.test(editData.email)) {
        throw new Error('Formato de email incorrecto.');
      }
  
      if (editData.age && (isNaN(Number(editData.age)) || Number(editData.age) < 8)) {
        throw new Error('Edad no válida.');
      }
  
      // Validar contraseña si está presente
      if (editData.password && editData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
      }

      // Validar que si hay nueva contraseña, debe haber contraseña actual
      if (editData.password && !editData.currentPassword) {
        throw new Error('Para cambiar la contraseña, debes ingresar tu contraseña actual.');
      }
  
      // Preparar datos a enviar
      const payload = {
        username: editData.username,
        email: editData.email,
        country: editData.country,
        age: editData.age
      };

      // Solo incluir contraseñas si el usuario está cambiando la contraseña
      if (editData.password) {
        payload.password = editData.password;
        payload.currentPassword = editData.currentPassword;
      }
  
      const { data } = await instance.put(`/user/${user.id}`, payload);
  
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
      setEditData(prev => ({ 
        ...prev, 
        currentPassword: '',
        password: '' 
      }));
  
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError(err.message || "Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Cargando perfil...</LoadingText>
        </LoadingContainer>
      </ProfileContainer>
    );
  }

  const firstName = user?.username ? user.username.split(' ')[0] : 'Usuario';
  const userPoints = user?.points || 0;
  const userLevel = calculateLevel(userPoints);
  const progressToNext = calculateProgress(userPoints);
  const currentLevelConfig = LEVEL_CONFIG[userLevel];
  const nextLevelConfig = LEVEL_CONFIG[userLevel + 1];

  return (
    <ProfileContainer>
      <Header>
        <Logo src="./Knowly.png" alt="Knowly" onClick={() => navigate('/')} />
        <Nav>
          <NavItemsWrapper>
            {user ? (
              <UserInfo ref={menuRef}>
                <UserNameInHeader>{firstName}</UserNameInHeader>
                <UserAvatar onClick={toggleUserMenu}>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </UserAvatar>
                {showMenu && (
                  <UserMenuDropdown>
                    <MenuItem>
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
                <NavLink href="/login">Accede</NavLink>
                <RegisterButton onClick={() => navigate('/registro')}>Regístrate</RegisterButton>
              </>
            )}
          </NavItemsWrapper>
        </Nav>
      </Header>

      <Main>
        <TitleSection>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </BackButton>
          <PageTitle>Mi Perfil</PageTitle>
        </TitleSection>

        <ContentGrid>
          {/* Columna izquierda */}
          <UserCard>
            <CardTitle>
              Información básica
              {!isEditing ? (
                <EditButton onClick={handleEditClick}>
                  <Edit2 size={16} />
                  Editar
                </EditButton>
              ) : (
                <SaveButtonsWrapper>
                  <CancelButton onClick={handleCancelClick} disabled={isSaving}>
                    <X size={16} />
                  </CancelButton>
                  <SaveButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : <><Save size={16} /> Guardar</>}
                  </SaveButton>
                </SaveButtonsWrapper>
              )}
            </CardTitle>

            <AvatarSection>
              <AvatarWrapper>
                <Avatar>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </AvatarWrapper>
            </AvatarSection>

            {saveError && <ErrorMessage>{saveError}</ErrorMessage>}

            <FormSection>
              <InputGroup>
                <InputLabel><Mail size={18} />Email</InputLabel>
                <StyledInput
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={isSaving}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><User size={18} />Usuario</InputLabel>
                <StyledInput
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={isSaving}
                />
              </InputGroup>

              <InputRow>
                <InputGroup>
                  <InputLabel><Globe size={18} />País</InputLabel>
                  <StyledInput
                    type="text"
                    name="country"
                    value={editData.country}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isSaving}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel><User size={18} />Edad</InputLabel>
                  <StyledInput
                    type="number"
                    name="age"
                    value={editData.age}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isSaving}
                    min="5"
                    max="100"
                  />
                </InputGroup>
              </InputRow>

              <InputGroup>
                <InputLabel><Lock size={18} />Contraseña Actual</InputLabel>
                <PasswordWrapper>
                  <StyledInput
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={editData.currentPassword}
                    onChange={handleChange}
                    placeholder="Contraseña actual"
                    readOnly={!isEditing}
                    disabled={isSaving}
                  />
                  {isEditing && (
                    <PasswordToggle onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </PasswordToggle>
                  )}
                </PasswordWrapper>
              </InputGroup>

              <InputGroup>
                <InputLabel><Lock size={18} />Nueva Contraseña</InputLabel>
                <PasswordWrapper>
                  <StyledInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={editData.password}
                    onChange={handleChange}
                    placeholder="Nueva contraseña"
                    readOnly={!isEditing}
                    disabled={isSaving}
                  />
                  {isEditing && (
                    <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </PasswordToggle>
                  )}
                </PasswordWrapper>
              </InputGroup>
            </FormSection>
          </UserCard>

          {/* Columna derecha */}
          <LearningSection>
            {/* Sección de Nivel */}
            <CardTitle>
             
              Nivel
               <Award size={24} style={{ color: '#fbbf24' }} />
            </CardTitle>
            
            <LevelCard>
              <LevelHeader>
                <LevelIconWrapper>
                  <LevelIcon 
                    src={currentLevelConfig.icon} 
                    alt={`Nivel ${userLevel}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="35" fill="%237c3aed"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold">' + userLevel + '</text></svg>';
                    }}
                  />
                </LevelIconWrapper>
                <LevelInfo>
                  <LevelNumber>Nivel {userLevel}</LevelNumber>
                  <LevelName>{currentLevelConfig.name}</LevelName>
                  <PointsDisplay>{userPoints} puntos</PointsDisplay>
                </LevelInfo>
              </LevelHeader>

              <ProgressSection>
                <ProgressHeader>
                  <ProgressLabel>Progreso al siguiente nivel</ProgressLabel>
                  {nextLevelConfig && (
                    <ProgressPoints>
                      {userPoints} / {nextLevelConfig.pointsRequired} pts
                    </ProgressPoints>
                  )}
                </ProgressHeader>
                <ProgressBarContainer>
                  <ProgressBarFill progress={progressToNext} />
                </ProgressBarContainer>
                {nextLevelConfig && (
                  <NextLevelInfo>
                    <NextLevelText>Siguiente: {nextLevelConfig.name}</NextLevelText>
                    <NextLevelText>{nextLevelConfig.pointsRequired - userPoints} puntos restantes</NextLevelText>
                  </NextLevelInfo>
                )}
                {!nextLevelConfig && (
                  <NextLevelInfo>
                    <NextLevelText style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                      ¡Nivel máximo alcanzado! 🎉
                    </NextLevelText>
                  </NextLevelInfo>
                )}
              </ProgressSection>
            </LevelCard>

            <SectionDivider />

            {/* Sección de Mi Aprendizaje */}
            <CardTitle style={{ marginTop: '2rem' }}>Mi aprendizaje <Book size={24} style={{ color: '#fbbf24' }} /></CardTitle>
            <ActivitiesGrid>
              <ActivityCard>
                <CategoryHeader color="#e2934aff">
                  <BookOpen size={20} />
                  <CategoryTitle>Lenguajes</CategoryTitle>
                </CategoryHeader>
                <ActivityContent>
                  <EmptyState>Sin actividades completadas</EmptyState>
                </ActivityContent>
              </ActivityCard>
              <ActivityCard>
                <CategoryHeader color="#e2c44aff">
                  <BookOpen size={20} />
                  <CategoryTitle>Saberes y Pensamiento Científico</CategoryTitle>
                </CategoryHeader>
                <ActivityContent>
                  <EmptyState>Sin actividades completadas</EmptyState>
                </ActivityContent>
              </ActivityCard>
              <ActivityCard>
                <CategoryHeader color="#57e24aff">
                  <BookOpen size={20} />
                  <CategoryTitle>Etica, Naturaleza y Sociedades</CategoryTitle>
                </CategoryHeader>
                <ActivityContent>
                  <EmptyState>Sin actividades completadas</EmptyState>
                </ActivityContent>
              </ActivityCard>
              <ActivityCard>
                <CategoryHeader color="#8c4ae2ff">
                  <BookOpen size={20} />
                  <CategoryTitle>Tecnologías</CategoryTitle>
                </CategoryHeader>
                <ActivityContent>
                  <EmptyState>Sin actividades completadas</EmptyState>
                </ActivityContent>
              </ActivityCard>
            </ActivitiesGrid>
          </LearningSection>
        </ContentGrid>
      </Main>
    </ProfileContainer>
  );
}

export default Perfil;

// Styled Components

const ProfileContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  width: 100vw;
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
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
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
  gap: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const UserNameInHeader = styled.span`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 5px;

  @media (max-width: 768px) {
    display: none;
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
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 95%;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(6, 182, 212, 0.25);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 18px rgba(6, 182, 212, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 12px;
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

const PageTitle = styled.h1`
  color: #1e293b;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardTitle = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputLabel = styled.label`
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledInput = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  background: ${props => props.readOnly ? '#f8fafc' : 'white'};
  transition: all 0.3s ease;
  cursor: ${props => props.readOnly ? 'default' : 'text'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:focus {
    outline: none;
    border-color: ${props => props.readOnly ? '#e2e8f0' : '#7c3aed'};
    background: white;
    box-shadow: ${props => props.readOnly ? 'none' : '0 0 0 3px rgba(124, 58, 237, 0.1)'};
  }

  &::placeholder {
    color: #94a3b8;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const LearningSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  grid-column: ${props => props.fullWidth ? 'span 2' : 'span 1'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    border-color: #7c3aed;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const CategoryHeader = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 700;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
`;

const ActivityContent = styled.div`
  padding: 2rem 1.5rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.p`
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  margin: 0;
`;

const EditButton = styled.button`
  background: #e0f2f1;
  color: #00897b;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #b2dfdb;
    transform: translateY(-1px);
  }
`;

const SaveButton = styled(EditButton)`
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  margin-left: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #43A047 0%, #4CAF50 100%);
  }

  &:disabled {
    background: #A5D6A7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #ffebee;
  color: #e57373;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ef9a9a;
    color: white;
  }

  &:disabled {
    background: #F8F8F8;
    color: #BDBDBD;
    cursor: not-allowed;
  }
`;

const SaveButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
  border: 1px solid #fca5a5;
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #64748b;

  &:hover {
    color: #7c3aed;
  }
`;

// Nuevos componentes para el sistema de niveles

const LevelCard = styled.div`
  background: linear-gradient(135deg, #cb8afdff 0%, #d9c7feff 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #8124fbff;
  box-shadow: 0 4px 15px rgba(158, 36, 251, 0.2);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LevelIconWrapper = styled.div`
  flex-shrink: 0;
`;

const LevelIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #8124fba3;
  background: white;
  padding: 8px;
  box-shadow: 0 4px 15px rgba(165, 36, 251, 0.3);
  object-fit: contain;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const LevelInfo = styled.div`
  flex: 1;
`;

const LevelNumber = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffffff;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LevelName = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffffff;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PointsDisplay = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffffff;
`;

const ProgressSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`;

const ProgressLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProgressPoints = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #7c3aed;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%);
  border-radius: 20px;
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
`;

const NextLevelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
`;

const NextLevelText = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const SectionDivider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
  margin: 2rem 0;
`