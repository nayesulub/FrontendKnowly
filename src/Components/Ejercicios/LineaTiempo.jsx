// LineaTiempo.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { User, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ===============================
//  CONFIGURACIÓN DE LA LÍNEA DEL TIEMPO
// ===============================
const eventosBase = [
  {
    id: 1,
    anio: 1810,
    orden: 1,
    titulo: "Grito de Dolores",
    descripcion:
      "Miguel Hidalgo llama al pueblo a levantarse en armas contra el dominio español.",
  },
  {
    id: 2,
    anio: 1811,
    orden: 2,
    titulo: "Captura y fusilamiento de Hidalgo",
    descripcion:
      "Los primeros líderes insurgentes (Hidalgo, Allende, Aldama y Jiménez) son capturados y ejecutados.",
  },
  {
    id: 3,
    anio: 1813,
    orden: 3,
    titulo: "Congreso de Chilpancingo",
    descripcion:
      "José María Morelos convoca un congreso donde se proclama formalmente la Independencia.",
  },
  {
    id: 4,
    anio: 1815,
    orden: 4,
    titulo: "Fusilamiento de Morelos",
    descripcion:
      "Morelos es capturado por las fuerzas realistas y fusilado, pero el movimiento continúa.",
  },
  {
    id: 5,
    anio: 1821,
    orden: 5,
    titulo: "Plan de Iguala",
    descripcion:
      "Agustín de Iturbide y Vicente Guerrero acuerdan unificar fuerzas en torno a las Tres Garantías.",
  },
  {
    id: 6,
    anio: 1821,
    orden: 6,
    titulo: "Consumación de la Independencia",
    descripcion:
      "El Ejército Trigarante entra a la Ciudad de México, consumando la Independencia.",
  },
];

const ordenCorrectoIds = [...eventosBase]
  .sort((a, b) => a.orden - b.orden)
  .map((e) => e.id);

const mezclarEventos = (lista) => {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

const LineaTiempo = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // =========================
  //   ESTADOS GENERALES
  // =========================
  const [eventos, setEventos] = useState(() => mezclarEventos(eventosBase));
  const [dragIndex, setDragIndex] = useState(null);
  const [verificado, setVerificado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [correctos, setCorrectos] = useState(0);
  const [tiempo, setTiempo] = useState(60);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  // Header / usuario
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Puntos
  const PUNTOS_POR_EJERCICIO = 60;
  const BONUS_TIEMPO_RAPIDO = 15; // si el orden está perfecto y queda buen tiempo

  // =========================
  //   CARGAR USUARIO
  // =========================
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      const demoUser = {
        username: "Usuario Demo",
        email: "usuario@ejemplo.com",
        country: "México",
        age: 18,
        idrol: 2,
        points: 0,
        coins: 0,
      };
      setUser(demoUser);
      localStorage.setItem("user", JSON.stringify(demoUser));
    }
  }, []);

  // =========================
  //   CRONÓMETRO
  // =========================
  useEffect(() => {
    if (tiempo > 0 && !verificado && !juegoTerminado) {
      const timer = setTimeout(() => setTiempo((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tiempo === 0 && !verificado && !juegoTerminado) {
      setTiempoAgotado(true);
    }
  }, [tiempo, verificado, juegoTerminado]);

  // =========================
  //   CLICK FUERA DEL MENÚ
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  //   DRAG & DROP DE TARJETAS
  // =========================
  const handleDragStart = (index) => {
    if (verificado) return;
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (verificado) return;
    if (dragIndex === null || dragIndex === index) return;

    const nuevaLista = [...eventos];
    const [movido] = nuevaLista.splice(dragIndex, 1);
    nuevaLista.splice(index, 0, movido);
    setEventos(nuevaLista);
    setDragIndex(null);
  };

  // =========================
  //   VERIFICAR ORDEN
  // =========================
  const handleCheck = () => {
    if (verificado) return;

    const total = eventos.length;
    let bienColocados = 0;

    eventos.forEach((ev, idx) => {
      if (ev.id === ordenCorrectoIds[idx]) {
        bienColocados++;
      }
    });

    setCorrectos(bienColocados);

    const porcentaje = total > 0 ? bienColocados / total : 0;
    let puntosGanados = Math.round(PUNTOS_POR_EJERCICIO * porcentaje);

    if (bienColocados === total && tiempo > 30) {
      puntosGanados += BONUS_TIEMPO_RAPIDO;
    }

    if (puntosGanados > 0) {
      setPuntuacion((prev) => prev + puntosGanados);
    }

    setVerificado(true);
  };

  // =========================
  //   ACTUALIZAR PUNTOS USER
  // =========================
  const actualizarPuntosUsuario = (puntosGanados) => {
    if (user) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const nuevosPuntos = (parsedUser.points || 0) + puntosGanados;

        const userActualizado = {
          ...parsedUser,
          points: nuevosPuntos,
        };

        localStorage.setItem("user", JSON.stringify(userActualizado));
        setUser(userActualizado);

        return nuevosPuntos;
      }
    }
    return 0;
  };

  // =========================
  //   FINALIZAR
  // =========================
  const handleFinalizar = () => {
    const puntosFinales = puntuacion;
    const nuevosPuntosTotales = actualizarPuntosUsuario(puntosFinales);

    setJuegoTerminado(true);

    setTimeout(() => {
      alert(
        `¡Has finalizado la Línea del Tiempo de la Independencia!\n\nPuntos ganados: ${puntosFinales}\nPuntos totales: ${nuevosPuntosTotales}`
      );
    }, 100);
  };

  // =========================
  //   HEADER / MENÚ USUARIO
  // =========================
  const toggleUserMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowMenu(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate("/perfil");
  };

  // =========================
  //   REINICIAR
  // =========================
  const handleReiniciar = () => {
    setEventos(mezclarEventos(eventosBase));
    setDragIndex(null);
    setVerificado(false);
    setPuntuacion(0);
    setCorrectos(0);
    setTiempo(60);
    setJuegoTerminado(false);
    setTiempoAgotado(false);
  };

  // =========================
  //   VISTAS ESPECIALES
  // =========================
  if (juegoTerminado) {
    return (
      <PantallaFinal>
        <CardFinal>
          <LogoCarta src="././Knowly.png" alt="Knowly" />
          <TituloFinal>¡Actividad Completada! 🇲🇽</TituloFinal>
          <PuntuacionFinal>
            Puntos ganados en este ejercicio:{" "}
            <PuntuacionNumero>{puntuacion}</PuntuacionNumero>
          </PuntuacionFinal>
          <PuntuacionFinal style={{ fontSize: "16px", marginTop: "8px" }}>
            Puntos totales:{" "}
            <span style={{ fontWeight: "bold", color: "#7c3aed" }}>
              {user?.points || 0}
            </span>
          </PuntuacionFinal>
          <MensajeMotivacional>
            Has organizado los acontecimientos más importantes de la
            Independencia de México. ¡Gran trabajo histórico!
          </MensajeMotivacional>
          <BotonesFinales>
            <BotonReiniciar onClick={handleReiniciar}>
              Reintentar Línea del Tiempo
            </BotonReiniciar>
            <BotonPerfil onClick={() => navigate("/perfil")}>
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
          <TituloFinal style={{ color: "#ef4444" }}>
            ¡Tiempo Agotado!
          </TituloFinal>
          <PuntuacionFinal>
            Se acabó el tiempo para ordenar la línea del tiempo.
            <br />
            Puntos ganados hasta ahora:{" "}
            <PuntuacionNumero style={{ color: "#ef4444" }}>
              {puntuacion}
            </PuntuacionNumero>
          </PuntuacionFinal>
          <BotonReiniciar
            onClick={handleReiniciar}
            style={{ backgroundColor: "#ef4444" }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#dc2626")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#ef4444")
            }
          >
            Reiniciar Actividad
          </BotonReiniciar>
        </CardFinal>
      </PantallaFinal>
    );
  }

  const totalEventos = eventos.length;
  const puedeVerificar = !verificado && totalEventos > 0;

  return (
    <Container>
      <Header>
        <Logo src="././Knowly.png" alt="Knowly" />
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
                  {user.username
                    ? user.username.charAt(0).toUpperCase()
                    : "U"}
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
              <RegisterButton>Regístrate</RegisterButton>
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
            <Badge>Actividad: Línea del Tiempo Independencia de México</Badge>
          </LeftSection>
          <BadgeContainer>
            <Badge>⭐ {puntuacion} pts</Badge>
            <Badge>⏱️ {tiempo}s</Badge>
            {tiempo > 30 && !verificado && (
              <BadgeBonus>🔥 Bonus disponible!</BadgeBonus>
            )}
          </BadgeContainer>
        </SubHeaderContent>
      </SubHeader>

      <MainContent>
        <InstruccionesBox>
          <InstruccionTitulo>📜 Instrucciones</InstruccionTitulo>
          <InstruccionTexto>
            Arrastra las tarjetas de eventos para ordenarlas
            cronológicamente y formar la{" "}
            <strong>Línea del Tiempo de la Independencia de México</strong>.
            La posición 1 representa el evento más antiguo y la última
            posición el más reciente. Cuando termines, haz clic en{" "}
            <strong>“Verificar”</strong>.
          </InstruccionTexto>
        </InstruccionesBox>

        <PreguntaBox>
          <TimelineContainer>
            <TimelineLine />
            {eventos.map((evento, index) => {
              const esCorrectaPosicion =
                verificado && evento.id === ordenCorrectoIds[index];

              const esIncorrectaPosicion =
                verificado && evento.id !== ordenCorrectoIds[index];

              return (
                <TimelineItemWrapper key={evento.id}>
                  <TimelinePositionBadge>{index + 1}</TimelinePositionBadge>
                  <TimelineDot
                    esCorrecta={esCorrectaPosicion}
                    esIncorrecta={esIncorrectaPosicion}
                  />
                  <TimelineCard
                    draggable={!verificado}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    esCorrecta={esCorrectaPosicion}
                    esIncorrecta={esIncorrectaPosicion}
                  >
                    <TimelineYear>{evento.anio}</TimelineYear>
                    <TimelineTitle>{evento.titulo}</TimelineTitle>
                    <TimelineDescription>
                      {evento.descripcion}
                    </TimelineDescription>
                  </TimelineCard>
                </TimelineItemWrapper>
              );
            })}
          </TimelineContainer>
        </PreguntaBox>

        <BotonesContainer>
          {!verificado ? (
            <BotonCheck
              onClick={handleCheck}
              disabled={!puedeVerificar}
              activo={!!puedeVerificar}
            >
              Verificar ✓
            </BotonCheck>
          ) : (
            <BotonSiguiente onClick={handleFinalizar}>
              Finalizar
            </BotonSiguiente>
          )}
        </BotonesContainer>

        {verificado && (
          <FeedbackBox>
            {correctos === totalEventos ? (
              <FeedbackCorrecto>
                <FeedbackTexto correcto>
                  ✓ ¡Excelente! Ordenaste correctamente todos los eventos de
                  la Independencia.
                  {tiempo > 30 && (
                    <BonusTexto>
                      🔥 ¡Bonus por rapidez! +{BONUS_TIEMPO_RAPIDO} pts
                    </BonusTexto>
                  )}
                </FeedbackTexto>
                <ExplicacionTexto>
                  Ahora tienes clara la secuencia histórica desde el Grito de
                  Dolores hasta la consumación de la Independencia.
                </ExplicacionTexto>
              </FeedbackCorrecto>
            ) : (
              <FeedbackIncorrecto>
                <FeedbackTexto>
                  Has colocado correctamente {correctos} de{" "}
                  {totalEventos} eventos.
                </FeedbackTexto>
                <ExplicacionTexto>
                  Observa los colores: las tarjetas en verde están en la
                  posición correcta y las marcadas en rojo necesitan
                  revisarse. Puedes analizar el orden antes de finalizar.
                </ExplicacionTexto>
              </FeedbackIncorrecto>
            )}
          </FeedbackBox>
        )}
      </MainContent>
    </Container>
  );
};

export default LineaTiempo;

// =====================================
//   STYLED COMPONENTS
// =====================================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #ffffff, #dbeafe);
  padding: 0;
  width: 100%;
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
`;

const CoinIcon = styled.div`
  color: #fbbf24;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5));

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const CoinsAmount = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
`;

const MenuSeparator = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;

const SubHeader = styled.div`
  background-color: #6f3abf;
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
`;

const Badge = styled.div`
  background-color: white;
  color: #5d628e;
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
    0%,
    100% {
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

const InstruccionesBox = styled.div`
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-left: 4px solid #7c3aed;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
`;

const InstruccionTitulo = styled.h3`
  margin: 0 0 8px 0;
  color: #7c3aed;
  font-size: 18px;
  font-weight: bold;
`;

const InstruccionTexto = styled.p`
  margin: 0;
  color: #4c1d95;
  font-size: 14px;
  line-height: 1.5;
`;

const PreguntaBox = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 32px 32px 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const TimelineContainer = styled.div`
  position: relative;
  margin-left: 32px;

  @media (max-width: 600px) {
    margin-left: 20px;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #7c3aed, #a855f7);
  border-radius: 999px;
`;

const TimelineItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
`;

const TimelinePositionBadge = styled.div`
  min-width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const TimelineDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 6px;
  border: 3px solid
    ${(props) =>
      props.esCorrecta
        ? "#10b981"
        : props.esIncorrecta
        ? "#ef4444"
        : "#7c3aed"};
  background: ${(props) =>
    props.esCorrecta
      ? "#d1fae5"
      : props.esIncorrecta
      ? "#fee2e2"
      : "#ede9fe"};
`;

const TimelineCard = styled.div`
  background: ${(props) =>
    props.esCorrecta
      ? "#d1fae5"
      : props.esIncorrecta
      ? "#fee2e2"
      : "#f9fafb"};
  border-left: 4px solid
    ${(props) =>
      props.esCorrecta
        ? "#10b981"
        : props.esIncorrecta
        ? "#ef4444"
        : "#7c3aed"};
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(148, 163, 184, 0.3);
  cursor: grab;
  flex: 1;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    cursor: grabbing;
    transform: scale(0.99);
  }
`;

const TimelineYear = styled.div`
  font-weight: 800;
  font-size: 14px;
  color: #4f46e5;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  margin-top: 2px;
`;

const TimelineDescription = styled.div`
  font-size: 13px;
  color: #4b5563;
  margin-top: 4px;
`;

const BotonesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const BotonCheck = styled.button`
  background: ${(props) => (props.activo ? "#7c3aed" : "#c4b5fd")};
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: ${(props) => (props.activo ? "pointer" : "not-allowed")};
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.activo ? "#6d28d9" : "#c4b5fd")};
  }
`;

const BotonSiguiente = styled.button`
  background: #10b981;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #059669;
  }
`;

const FeedbackBox = styled.div`
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
`;

const FeedbackCorrecto = styled.div`
  border-left: 5px solid #10b981;
  padding-left: 16px;
`;

const FeedbackIncorrecto = styled.div`
  border-left: 5px solid #ef4444;
  padding-left: 16px;
`;

const FeedbackTexto = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.correcto ? "#10b981" : "#ef4444")};
  margin: 0 0 10px 0;
`;

const BonusTexto = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #f59e0b;
  font-weight: bold;
`;

const ExplicacionTexto = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.4;
`;

const PantallaFinal = styled.div`
  height: 100vh;
  display: flex;
    width: 100%;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  padding: 20px;
`;

const CardFinal = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

const LogoCarta = styled.img`
  width: 100px;
  margin-bottom: 16px;
`;

const TituloFinal = styled.h2`
  margin: 0 0 10px 0;
  font-size: 26px;
  color: #7c3aed;
`;

const PuntuacionFinal = styled.p`
  margin-top: 10px;
  font-size: 18px;
  color: #374151;
`;

const PuntuacionNumero = styled.span`
  color: #7c3aed;
  font-weight: bold;
`;

const MensajeMotivacional = styled.p`
  margin: 16px 0;
  color: #6b7280;
  font-size: 14px;
`;

const BotonesFinales = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const BotonReiniciar = styled.button`
  background: #7c3aed;
  color: white;
  padding: 12px 20px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6d28d9;
  }
`;

const BotonPerfil = styled.button`
  background: #10b981;
  color: white;
  padding: 12px 20px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

const EmojiGrande = styled.div`
  font-size: 60px;
  margin-bottom: 10px;
`;
