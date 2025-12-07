import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EjerciciosPreguntas = () => {
  const navigate = useNavigate();
  const { actividadId } = useParams(); // 🔹 /actividades/:actividadId/preguntas
  const menuRef = useRef(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  // 🔹 PREGUNTAS DESDE LA API
  const [actividad, setActividad] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loadingPreguntas, setLoadingPreguntas] = useState(true);
  const [errorPreguntas, setErrorPreguntas] = useState(null);

  // Estado del juego
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [verificado, setVerificado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempo, setTiempo] = useState(30);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  // Estados para el header
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Puntos por respuesta correcta y bonus por tiempo
  const PUNTOS_POR_CORRECTA = 20;
  const BONUS_TIEMPO_RAPIDO = 5; // Si responde en menos de 15 segundos

  // 🔹 Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      const demoUser = {
        username: 'Usuario Demo',
        email: 'usuario@ejemplo.com',
        country: 'México',
        age: 18,
        idrol: 2,
        points: 0,
        coins: 0,
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  }, []);

  // 🔹 Traer preguntas desde la API según la actividad
  useEffect(() => {
    if (!actividadId) {
      navigate(-1);
      return;
    }

    const fetchPreguntas = async () => {
      try {
        setLoadingPreguntas(true);
        setErrorPreguntas(null);

        const res = await fetch(`http://localhost:8000/api/actividades/${actividadId}/preguntas`);

        if (!res.ok) {
          const raw = await res.text();
          throw new Error(`Error al cargar preguntas: ${res.status} - ${raw}`);
        }

        const data = await res.json();

        setActividad(data.actividad || null);

        const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
        const colores = ['#60A5FA', '#FBBF24', '#F87171', '#34D399', '#F472B6', '#A78BFA'];

        const preguntasMapeadas = (data.preguntas || []).map((p) => {
          const opcionesMap = (p.opciones || []).map((o, index) => ({
            id: letras[index],
            texto: o.texto,
            color: colores[index % colores.length],
            es_correcta: !!o.es_correcta,
          }));

          const indiceCorrecta = opcionesMap.findIndex((o) => o.es_correcta);

          return {
            id: p.id,
            pregunta: p.titulo,
            descripcion: p.descripcion,
            opciones: opcionesMap,
            correcta: indiceCorrecta !== -1 ? opcionesMap[indiceCorrecta].id : null,
          };
        });

        setPreguntas(preguntasMapeadas);
        setPreguntaActual(0);
        setSeleccion(null);
        setVerificado(false);
        setPuntuacion(0);
        setTiempo(30);
        setJuegoTerminado(false);
        setTiempoAgotado(false);
      } catch (err) {
        console.error(err);
        setErrorPreguntas(err.message || 'Error al cargar preguntas');
      } finally {
        setLoadingPreguntas(false);
      }
    };

    fetchPreguntas();
  }, [actividadId, navigate]);

  // ⏱️ useEffect para el cronómetro
  useEffect(() => {
    if (loadingPreguntas || preguntas.length === 0) return;

    if (tiempo > 0 && !verificado && !juegoTerminado) {
      const timer = setTimeout(() => setTiempo((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tiempo === 0 && !verificado && !juegoTerminado) {
      setTiempoAgotado(true);
    }
  }, [tiempo, verificado, juegoTerminado, loadingPreguntas, preguntas.length]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSeleccion = (opcionId) => {
    if (!verificado) {
      setSeleccion(opcionId);
    }
  };

  const handleCheck = () => {
    if (!seleccion) return;

    setVerificado(true);

    const actual = preguntas[preguntaActual];
    if (!actual || !actual.correcta) return;

    if (seleccion === actual.correcta) {
      let puntosGanados = PUNTOS_POR_CORRECTA;

      // Bonus por responder rápido
      if (tiempo > 15) {
        puntosGanados += BONUS_TIEMPO_RAPIDO;
      }

      setPuntuacion((prev) => prev + puntosGanados);
    }
  };

  // 🔹 Actualizar los puntos del usuario en localStorage
  const actualizarPuntosUsuario = (puntosGanadosEnEstaActividad) => {
  if (user) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const nuevosPuntos = (parsedUser.points || 0) + puntosGanadosEnEstaActividad;

      const userActualizado = {
        ...parsedUser,
        points: nuevosPuntos,
      };

      localStorage.setItem('user', JSON.stringify(userActualizado));
      setUser(userActualizado);

      return nuevosPuntos;
    }
  }
  return 0;
};

const marcarActividadCompletada = async (puntosFinales) => {
  try {
    const token = localStorage.getItem('token');
    console.log('marcarActividadCompletada token:', token, 'actividadId:', actividadId);

    const res = await fetch(`http://localhost:8000/api/actividades/${actividadId}/completar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si usas token Bearer:
        Authorization: token ? `Bearer ${token}` : undefined,
      },
     // Si usas Sanctum SPA con cookies, usa credentials: 'include' en lugar de Authorization
     // credentials: 'include',
      body: JSON.stringify({ puntuacion: puntosFinales }),
    });

    console.log('RESPUESTA MARCAR ACTIVIDAD:', res.status, await res.text());
    if (!res.ok) {
      throw new Error(`Error marcar actividad: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

  const enviarPuntosAlServidor = async (puntosFinales) => {
  try {
    const token = localStorage.getItem('token'); 
    console.log('user:', localStorage.getItem('user'));
    console.log('token:', localStorage.getItem('token'));
// el que guardas al hacer login

    const res = await fetch('http://localhost:8000/api/user/add-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // si usas Bearer
      },
      body: JSON.stringify({ points: puntosFinales }),
    });

    if (!res.ok) {
      const raw = await res.text();
      console.error('Error al actualizar puntos:', res.status, raw);
      return null;
    }

    const data = await res.json();
    // data.user trae el user actualizado según el controlador que hicimos
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};


  const handleSiguiente = async () => {
  if (preguntaActual < preguntas.length - 1) {
    setPreguntaActual((prev) => prev + 1);
    setSeleccion(null);
    setVerificado(false);
    setTiempo(30);
  } else {
    const puntosFinales = puntuacion;

    // 1️⃣ Actualizar puntos del usuario
    const userActualizado = await enviarPuntosAlServidor(puntosFinales);

    // 2️⃣ Registrar que completó esta actividad
    await marcarActividadCompletada(puntosFinales);

    setJuegoTerminado(true);

    setTimeout(() => {
      alert(
        `¡Has finalizado el ejercicio!\n\nPuntos ganados en esta actividad: ${puntosFinales}\nPuntos totales: ${
          userActualizado?.points ?? user?.points ?? 0
        }`
      );
    }, 100);
  }
};

  const toggleUserMenu = () => setShowMenu(!showMenu);

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

  const handleReiniciar = () => {
    setPreguntaActual(0);
    setSeleccion(null);
    setVerificado(false);
    setPuntuacion(0);
    setTiempo(30);
    setJuegoTerminado(false);
    setTiempoAgotado(false);
  };

  const getOpcionEstilo = (opcionId) => {
    const actual = preguntas[preguntaActual];
    const opcion = actual?.opciones.find((o) => o.id === opcionId);
    if (!opcion) return {};

    let style = {
      backgroundColor: opcion.color,
      padding: '24px',
      borderRadius: '12px',
      cursor: verificado ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '3px solid transparent',
    };

    if (!verificado) {
      if (seleccion === opcionId) {
        style.border = '3px solid #1f2937';
        style.transform = 'scale(1.05)';
      }
    } else {
      if (opcionId === actual.correcta) {
        style.backgroundColor = '#10B981';
        style.border = '3px solid #059669';
      } else if (seleccion === opcionId && opcionId !== actual.correcta) {
        style.backgroundColor = '#EF4444';
        style.border = '3px solid #DC2626';
      } else {
        style.opacity = '0.5';
      }
    }

    return style;
  };

  // 🔹 Pantallas de estado (cargando, error, sin preguntas, tiempo agotado, terminado)

  if (loadingPreguntas) {
    return (
      <PantallaFinal>
        <CardFinal>
          <LogoCarta src="/Knowly.png" alt="Knowly" />
          <TituloFinal>Cargando preguntas...</TituloFinal>
          <PuntuacionFinal>Por favor espera un momento</PuntuacionFinal>
        </CardFinal>
      </PantallaFinal>
    );
  }

  if (errorPreguntas) {
    return (
      <PantallaFinal>
        <CardFinal>
          <EmojiGrande>⚠️</EmojiGrande>
          <TituloFinal style={{ color: '#ef4444' }}>Error</TituloFinal>
          <PuntuacionFinal>{errorPreguntas}</PuntuacionFinal>
          <BotonReiniciar onClick={handleGoBack}>
            Volver
          </BotonReiniciar>
        </CardFinal>
      </PantallaFinal>
    );
  }

  if (!loadingPreguntas && preguntas.length === 0) {
    return (
      <PantallaFinal>
        <CardFinal>
          <EmojiGrande>📭</EmojiGrande>
          <TituloFinal>Sin preguntas</TituloFinal>
          <PuntuacionFinal>
            Esta actividad todavía no tiene preguntas registradas.
          </PuntuacionFinal>
          <BotonReiniciar onClick={handleGoBack}>
            Volver
          </BotonReiniciar>
        </CardFinal>
      </PantallaFinal>
    );
  }

  if (juegoTerminado) {
    return (
      <PantallaFinal>
        <CardFinal>
          <LogoCarta src="/Knowly.png" alt="Knowly" />
          <TituloFinal>¡Ejercicio Completado!</TituloFinal>
          <PuntuacionFinal>
            Puntos ganados en esta actividad:{' '}
            <PuntuacionNumero>{puntuacion}</PuntuacionNumero>
          </PuntuacionFinal>
          <PuntuacionFinal style={{ fontSize: '16px', marginTop: '8px' }}>
            Puntos totales:{' '}
            <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>
              {user?.points || 0}
            </span>
          </PuntuacionFinal>
          <BotonesFinales>
            <BotonReiniciar onClick={handleReiniciar}>
              Reintentar Ejercicio
            </BotonReiniciar>
            <BotonPerfil onClick={() => navigate('/perfil')}>
              Ver mi Perfil
            </BotonPerfil>
          </BotonesFinales>
        </CardFinal>
      </PantallaFinal>
    );
  }

  if (tiempoAgotado) {
    return (
      <PantallaFinal>
        <CardFinal>
          <EmojiGrande>⏰</EmojiGrande>
          <TituloFinal style={{ color: '#ef4444' }}>¡Tiempo Agotado!</TituloFinal>
          <PuntuacionFinal>
            Se acabó el tiempo para responder esta pregunta.
            <br />
            Puntos ganados hasta ahora:{' '}
            <PuntuacionNumero style={{ color: '#ef4444' }}>
              {puntuacion}
            </PuntuacionNumero>
          </PuntuacionFinal>
          <BotonReiniciar
            onClick={handleReiniciar}
            style={{ backgroundColor: '#ef4444' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
          >
            Reiniciar Actividad
          </BotonReiniciar>
        </CardFinal>
      </PantallaFinal>
    );
  }

  // ✅ Render normal del juego
  const preguntaObj = preguntas[preguntaActual];

  return (
    <Container>
      <Header>
        <Logo src="/Knowly.png" alt="Knowly" />
        <Nav>
          <NavLink href="#">ASIGNATURAS</NavLink>
          <NavLink href="#">GRADOS</NavLink>
          <NavLink href="#">PRECIOS</NavLink>
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

      <SubHeader>
        <SubHeaderContent>
          <LeftSection>
            <BotonRegresar onClick={handleGoBack}>
              <ArrowLeft size={20} />
              <span>Salir</span>
            </BotonRegresar>
            <Badge>
              {actividad
                ? `${actividad.nombre} · Pregunta ${preguntaActual + 1} de ${preguntas.length}`
                : `Pregunta ${preguntaActual + 1} de ${preguntas.length}`}
            </Badge>
          </LeftSection>
          <BadgeContainer>
            <Badge>⭐ {puntuacion} pts</Badge>
            <Badge>⏱️ {tiempo}s</Badge>
            {tiempo > 15 && !verificado && (
              <BadgeBonus>🔥 Bonus disponible!</BadgeBonus>
            )}
          </BadgeContainer>
        </SubHeaderContent>
      </SubHeader>

      <MainContent>
        <PreguntaBox>
          <PreguntaTexto>
            "{preguntaObj.pregunta}"
          </PreguntaTexto>
        </PreguntaBox>

        <OpcionesGrid>
          {preguntaObj.opciones.map((opcion) => (
            <div
              key={opcion.id}
              onClick={() => handleSeleccion(opcion.id)}
              style={getOpcionEstilo(opcion.id)}
              onMouseEnter={(e) => {
                if (!verificado) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!verificado || seleccion !== opcion.id) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <OpcionContent>
                <OpcionLetra>{opcion.id}</OpcionLetra>
                <OpcionTexto>{opcion.texto}</OpcionTexto>
              </OpcionContent>
            </div>
          ))}
        </OpcionesGrid>

        <BotonesContainer>
          {!verificado ? (
            <BotonCheck onClick={handleCheck} disabled={!seleccion} activo={!!seleccion}>
              Check ✓
            </BotonCheck>
          ) : (
            <BotonSiguiente onClick={handleSiguiente}>
              {preguntaActual < preguntas.length - 1 ? 'Siguiente →' : 'Finalizar'}
            </BotonSiguiente>
          )}
        </BotonesContainer>

        {verificado && (
          <FeedbackBox>
            {seleccion === preguntaObj.correcta ? (
              <FeedbackCorrecto>
                <FeedbackTexto correcto>
                  ✓ ¡Correcto! +
                  {tiempo > 15
                    ? PUNTOS_POR_CORRECTA + BONUS_TIEMPO_RAPIDO
                    : PUNTOS_POR_CORRECTA}{' '}
                  puntos
                  {tiempo > 15 && (
                    <BonusTexto>
                      🔥 ¡Bonus por rapidez! +{BONUS_TIEMPO_RAPIDO} pts
                    </BonusTexto>
                  )}
                </FeedbackTexto>
              </FeedbackCorrecto>
            ) : (
              <FeedbackIncorrecto>
                <FeedbackTexto>
                  ✗ Incorrecto. La respuesta correcta es {preguntaObj.correcta}
                </FeedbackTexto>
              </FeedbackIncorrecto>
            )}
          </FeedbackBox>
        )}
      </MainContent>
    </Container>
  );
};
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

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #ffffff, #DBEAFE);
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
  max-height: 60px;
  height: auto;
  width: auto;
  max-width: 180px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;

  @media (max-width: 768px) {
    max-height: 50px;
    max-width: 140px;
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

const LogoCarta = styled.img`
  max-height: 80px;
  height: auto;
  width: auto;
  object-fit: contain;
  display: block;
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

const MenuSeparator = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;

const SubHeader = styled.div`
  background-color: #6f3abfff;
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
    color: #7c3aed;
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
  color: #5d628eff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
  font-size: 14px;
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
`;

const PreguntaBox = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const PreguntaTexto = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin: 0;
`;

const OpcionesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const OpcionContent = styled.div`
  text-align: center;
  color: white;
`;

const OpcionLetra = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const OpcionTexto = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const BotonesContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BotonCheck = styled.button`
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: ${props => props.activo ? 'pointer' : 'not-allowed'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${props => props.activo ? '#059669' : '#D1D5DB'};
  color: ${props => props.activo ? 'white' : '#6B7280'};

  &:hover {
    background-color: ${props => props.activo ? '#047857' : '#D1D5DB'};
  }
`;

const BotonSiguiente = styled.button`
  background-color: #2563EB;
  color: white;
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #1D4ED8;
  }
`;

const FeedbackBox = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const FeedbackCorrecto = styled.div`
  background-color: #D1FAE5;
  border: 2px solid #059669;
  border-radius: 12px;
  padding: 16px;
  display: inline-block;
`;

const FeedbackIncorrecto = styled.div`
  background-color: #FEE2E2;
  border: 2px solid #DC2626;
  border-radius: 12px;
  padding: 16px;
  display: inline-block;
`;

const FeedbackTexto = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: ${props => props.correcto ? '#047857' : '#DC2626'};
`;

const BonusTexto = styled.div`
  font-size: 14px;
  color: #f59e0b;
  margin-top: 8px;
  font-weight: 600;
`;

const PantallaFinal = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #7c3aed, #DBEAFE);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardFinal = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  padding: 48px;
  text-align: center;
  max-width: 500px;
`;

const EmojiGrande = styled.div`
  font-size: 72px;
  margin-bottom: 16px;
`;

const TituloFinal = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #3d3850ff;
  margin-bottom: 16px;
`;

const PuntuacionFinal = styled.p`
  font-size: 20px;
  color: #4B5563;
  margin-bottom: 24px;
`;

const PuntuacionNumero = styled.span`
  font-weight: bold;
  color: #7c3aed;
  font-size: 28px;
`;

const BotonesFinales = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const BotonReiniciar = styled.button`
  background-color: #7c3aed;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4e288eff;
    transform: translateY(-2px);
  }
`;

const BotonPerfil = styled.button`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    transform: translateY(-2px);
  }
`;

export default EjerciciosPreguntas;