import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { User, LogOut, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemoramaCiencias = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Estados para el header
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Estados del juego
  const [cartas, setCartas] = useState([]);
  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  const [cartasEmparejadas, setCartasEmparejadas] = useState([]);
  const [intentos, setIntentos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [puntosGanados, setPuntosGanados] = useState(0);

  // Sistema de puntos
  const PUNTOS_POR_ACIERTO = 15;
  const BONUS_ESTRELLAS_3 = 50;  // Bonus por 3 estrellas
  const BONUS_ESTRELLAS_2 = 25;  // Bonus por 2 estrellas
  const BONUS_RAPIDEZ = 30;      // Bonus por completar en menos de 2 minutos

  // Datos de las cartas (pares relacionados)
  const datosCartas = [
    { id: 1, tipo: 'animal', nombre: 'León', pareja: 2, imagen: './leon.png' },
    { id: 2, tipo: 'habitat', nombre: 'Sabana', pareja: 1, imagen: './sabana.png' },
    { id: 3, tipo: 'planta', nombre: 'Cactus', pareja: 4, imagen: './cactus.png' },
    { id: 4, tipo: 'habitat', nombre: 'Desierto', pareja: 3, imagen: './desierto.png' },
    { id: 5, tipo: 'animal', nombre: 'Pez', pareja: 6, imagen: './pez.png' },
    { id: 6, tipo: 'habitat', nombre: 'Océano', pareja: 5, imagen: './oceano.png' },
    { id: 7, tipo: 'ser', nombre: 'Oso', pareja: 8, imagen: './oso.png' },
    { id: 8, tipo: 'caracteristica', nombre: 'Omnívoro', pareja: 7, imagen: './omnivoro.png' },
    { id: 9, tipo: 'planta', nombre: 'Rosa', pareja: 10, imagen: './rosa.png' },
    { id: 10, tipo: 'parte', nombre: 'Pétalos', pareja: 9, imagen: './petalos.png' },
    { id: 11, tipo: 'animal', nombre: 'Águila', pareja: 12, imagen: './aguila.png' },
    { id: 12, tipo: 'caracteristica', nombre: 'Aéreo', pareja: 11, imagen: './aereo.png' }
  ];

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Usuario demo si no hay sesión
      const demoUser = {
        username: 'Usuario Demo',
        email: 'usuario@ejemplo.com',
        country: 'México',
        age: 18,
        idrol: 2,
        points: 0
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  }, []);

  // Inicializar juego
  useEffect(() => {
    inicializarJuego();
  }, []);

  // Cronómetro
  useEffect(() => {
    let intervalo;
    if (juegoIniciado && !juegoTerminado) {
      intervalo = setInterval(() => {
        setTiempo(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [juegoIniciado, juegoTerminado]);

  // Verificar si el juego terminó y calcular puntos
  useEffect(() => {
    if (cartasEmparejadas.length === datosCartas.length && cartasEmparejadas.length > 0) {
      setJuegoTerminado(true);
      setJuegoIniciado(false);
      
      // Calcular puntos
      calcularYGuardarPuntos();
    }
  }, [cartasEmparejadas]);

  // Manejo de clics fuera del menú
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

  const calcularEstrellas = () => {
    if (intentos <= cartas.length / 2 + 2) return 3;
    if (intentos <= cartas.length) return 2;
    return 1;
  };

  const calcularYGuardarPuntos = () => {
    let puntos = 0;
    
    // Puntos base por aciertos
    puntos += aciertos * PUNTOS_POR_ACIERTO;
    
    // Bonus por estrellas
    const estrellas = calcularEstrellas();
    if (estrellas === 3) {
      puntos += BONUS_ESTRELLAS_3;
    } else if (estrellas === 2) {
      puntos += BONUS_ESTRELLAS_2;
    }
    
    // Bonus por rapidez (menos de 2 minutos)
    if (tiempo < 120) {
      puntos += BONUS_RAPIDEZ;
    }
    
    setPuntosGanados(puntos);
    actualizarPuntosUsuario(puntos);
  };

  // Función para actualizar los puntos del usuario en localStorage
  const actualizarPuntosUsuario = (puntosNuevos) => {
    if (user) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const nuevosPuntos = (parsedUser.points || 0) + puntosNuevos;
        
        const userActualizado = {
          ...parsedUser,
          points: nuevosPuntos
        };
        
        localStorage.setItem('user', JSON.stringify(userActualizado));
        setUser(userActualizado);
      }
    }
  };

  const inicializarJuego = () => {
    const cartasMezcladas = [...datosCartas].sort(() => Math.random() - 0.5);
    setCartas(cartasMezcladas);
    setCartasVolteadas([]);
    setCartasEmparejadas([]);
    setIntentos(0);
    setAciertos(0);
    setTiempo(0);
    setJuegoIniciado(false);
    setJuegoTerminado(false);
    setPuntosGanados(0);
  };

  const handleClickCarta = (carta) => {
    if (!juegoIniciado) setJuegoIniciado(true);

    // Evitar clicks en cartas ya emparejadas o ya volteadas
    if (
      cartasEmparejadas.includes(carta.id) ||
      cartasVolteadas.includes(carta.id) ||
      cartasVolteadas.length === 2
    ) {
      return;
    }

    const nuevasVolteadas = [...cartasVolteadas, carta.id];
    setCartasVolteadas(nuevasVolteadas);

    // Si se voltearon 2 cartas
    if (nuevasVolteadas.length === 2) {
      setIntentos(intentos + 1);
      const [id1, id2] = nuevasVolteadas;
      const carta1 = cartas.find(c => c.id === id1);
      const carta2 = cartas.find(c => c.id === id2);

      // Verificar si son pareja
      if (carta1.pareja === carta2.id) {
        setAciertos(aciertos + 1);
        setTimeout(() => {
          setCartasEmparejadas([...cartasEmparejadas, id1, id2]);
          setCartasVolteadas([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCartasVolteadas([]);
        }, 1000);
      }
    }
  };

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowMenu(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate('/perfil');
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
  };

  if (juegoTerminado) {
    const estrellas = calcularEstrellas();
    const tieneBonus = tiempo < 120;

    return (
      <PantallaFinal>
        <CardFinal>
          <LogoCarta src="././Knowly.png" alt="Knowly" />
          <TituloFinal>¡Felicidades!</TituloFinal>
          <PuntuacionFinal>
            Completaste el memorama con <PuntuacionNumero>{intentos}</PuntuacionNumero> intentos
            <br />
            en <PuntuacionNumero>{formatearTiempo(tiempo)}</PuntuacionNumero>
          </PuntuacionFinal>
          
          <Estrellas>
            {estrellas === 3 ? '⭐⭐⭐' : estrellas === 2 ? '⭐⭐' : '⭐'}
          </Estrellas>

          <DesglosePuntos>
            <ItemPuntos>
              <span>Parejas encontradas ({aciertos})</span>
              <span>+{aciertos * PUNTOS_POR_ACIERTO} pts</span>
            </ItemPuntos>
            
            {estrellas === 3 && (
              <ItemPuntos bonus>
                <span>🌟 Bonus 3 estrellas</span>
                <span>+{BONUS_ESTRELLAS_3} pts</span>
              </ItemPuntos>
            )}
            
            {estrellas === 2 && (
              <ItemPuntos bonus>
                <span>🌟 Bonus 2 estrellas</span>
                <span>+{BONUS_ESTRELLAS_2} pts</span>
              </ItemPuntos>
            )}
            
            {tieneBonus && (
              <ItemPuntos bonus>
                <span>⚡ Bonus por rapidez</span>
                <span>+{BONUS_RAPIDEZ} pts</span>
              </ItemPuntos>
            )}
            
            <ItemPuntosTotal>
              <span>Total ganado</span>
              <span>{puntosGanados} pts</span>
            </ItemPuntosTotal>
          </DesglosePuntos>

          <PuntuacionFinal style={{ fontSize: '16px', marginTop: '16px' }}>
            Puntos totales: <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>{user?.points || 0}</span>
          </PuntuacionFinal>

          <BotonesFinales>
            <BotonReiniciar onClick={inicializarJuego}>
              <RotateCcw size={20} />
              Jugar de Nuevo
            </BotonReiniciar>
            <BotonPerfil onClick={() => navigate('/perfil')}>
              Ver mi Perfil
            </BotonPerfil>
          </BotonesFinales>
        </CardFinal>
      </PantallaFinal>
    );
  }

  return (
    <Container>
      {/* Header Principal */}
    <Header>
  <Logo src="././Knowly.png" alt="Knowly" />
  <Nav>
    <NavLink href="#">ASIGNATURAS</NavLink>
    <NavLink href="#">GRADOS</NavLink>
    <NavLink href="#">PRECIOS</NavLink>
    {user ? (
      <>
        {/* NUEVO: Contenedor de Monedas */}
        <CoinsContainer>
          <CoinIcon>
            <img src="/coin.png" alt="Coin" />
          </CoinIcon>
          <CoinsAmount>{user.coins || 0}</CoinsAmount>
        </CoinsContainer>
        
        <UserInfo ref={menuRef}>
          <UserAvatar onClick={toggleUserMenu}>
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
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
        <NavLink href="#">ACCEDE</NavLink>
        <RegisterButton>Registrate</RegisterButton>
      </>
    )}
  </Nav>
</Header>

      {/* SubHeader con información del juego */}
      <SubHeader>
        <SubHeaderContent>
          <LeftSection>
            <BotonRegresar onClick={handleGoBack}>
              <ArrowLeft size={20} />
              <span>Salir</span>
            </BotonRegresar>
            <Badge>
              🌱 Los Seres Vivos
            </Badge>
          </LeftSection>
          <BadgeContainer>
            <Badge>🎯 {aciertos}/{cartas.length / 2}</Badge>
            <Badge>🔄 {intentos} intentos</Badge>
            <Badge>⏱️ {formatearTiempo(tiempo)}</Badge>
            {tiempo < 120 && juegoIniciado && (
              <BadgeBonus>⚡ Bonus disponible!</BadgeBonus>
            )}
          </BadgeContainer>
        </SubHeaderContent>
      </SubHeader>

      {/* Main Content - Memorama */}
      <MainContent>
        <TituloJuego>
          <Award size={32} color="#10b981" />
          <span>Encuentra las parejas relacionadas</span>
        </TituloJuego>

        <GridCartas>
          {cartas.map((carta) => {
            const estaVolteada = cartasVolteadas.includes(carta.id);
            const estaEmparejada = cartasEmparejadas.includes(carta.id);
            const mostrarFrente = estaVolteada || estaEmparejada;

            return (
              <CartaContainer
                key={carta.id}
                onClick={() => handleClickCarta(carta)}
                className={mostrarFrente ? 'volteada' : ''}
              >
                <CartaInterna className={mostrarFrente ? 'girada' : ''}>
                  {/* Parte trasera */}
                  <CartaTrasera>
                    <LogoCarta src="././Knowly.png" alt="Knowly" />
                  </CartaTrasera>

                  {/* Parte frontal */}
                  <CartaFrente emparejada={estaEmparejada}>
                    <ImagenCarta src={carta.imagen} alt={carta.nombre} />
                    <NombreCarta>{carta.nombre}</NombreCarta>
                    {estaEmparejada && <CheckMarca>✓</CheckMarca>}
                  </CartaFrente>
                </CartaInterna>
              </CartaContainer>
            );
          })}
        </GridCartas>

        <BotonReiniciarJuego onClick={inicializarJuego}>
          <RotateCcw size={20} />
          Reiniciar Juego
        </BotonReiniciarJuego>
      </MainContent>
    </Container>
  );
};

// ============= STYLED COMPONENTS =============

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

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #fef3c7 100%);
  padding: 0;
  width: 100%;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

const LogoCarta = styled.img`
  height: 60px;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  &:hover {
    color: #fbbf24;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
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
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

const SubHeader = styled.div`
  background: linear-gradient(135deg, #6f3abfff 0%, #6f3abfff 100%);
  color: white;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SubHeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const BotonRegresar = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background-color: white;
    color: #40375bff;
    transform: translateX(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateX(-1px);
  }

  span {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Badge = styled.div`
  background-color: white;
  color: #3b3d53ff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BadgeBonus = styled(Badge)`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px;

  @media (max-width: 768px) {
    padding: 24px 12px;
  }
`;

const TituloJuego = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: bold;
  color: #494762ff;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
    flex-direction: column;
    gap: 8px;
  }
`;

const GridCartas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  perspective: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const CartaContainer = styled.div`
  aspect-ratio: 3/4;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &.volteada {
    pointer-events: none;
  }
`;

const CartaInterna = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &.girada {
    transform: rotateY(180deg);
  }
`;

const CartaTrasera = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
  border: 3px solid #ffffff;
`;

const CartaFrente = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: ${props => props.emparejada 
    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 3px solid ${props => props.emparejada ? '#10b981' : '#e5e7eb'};
  transform: rotateY(180deg);
  position: relative;
`;

const ImagenCarta = styled.img`
  width: 80%;
  height: 60%;
  object-fit: contain;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

const NombreCarta = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CheckMarca = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #10b981;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes checkPop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const BotonReiniciarJuego = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const PantallaFinal = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, rgba(124, 58, 237, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CardFinal = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 48px;
  text-align: center;
  max-width: 500px;
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes popIn {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const TituloFinal = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #283e2bff;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const PuntuacionFinal = styled.p`
  font-size: 18px;
  color: #4b5563;
  margin-bottom: 20px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const PuntuacionNumero = styled.span`
  font-weight: bold;
  color: #7c3aed;
  font-size: 24px;
`;

const Estrellas = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
  animation: twinkle 1.5s ease-in-out infinite;

  @keyframes twinkle {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const DesglosePuntos = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 20px;
  margin: 24px 0;
  border: 2px solid #e2e8f0;
`;

const ItemPuntos = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 16px;
  color: ${props => props.bonus ? '#7c3aed' : '#4b5563'};
  font-weight: ${props => props.bonus ? '600' : '500'};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ItemPuntosTotal = styled(ItemPuntos)`
  color: #7c3aed;
  font-weight: 700;
  font-size: 18px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 2px solid #7c3aed;
  border-bottom: none;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BotonesFinales = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BotonReiniciar = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6f3abfff 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);

  &:hover {
    background: linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const BotonPerfil = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.3);

  &:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

export default MemoramaCiencias;