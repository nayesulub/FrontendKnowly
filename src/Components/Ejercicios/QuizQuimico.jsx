// QuizQuimico.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { User, LogOut, ArrowLeft, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizQuimico = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // =========================
  //   DATOS DEL QUIZ
  // =========================
  const preguntas = [
    {
      titulo: "Estados de la materia",
      definiciones: [
        {
          id: "d1",
          texto:
            "Estado de la materia que tiene forma y volumen definidos. Las partículas están muy juntas y ordenadas.",
          respuesta: "Sólido",
        },
        {
          id: "d2",
          texto:
            "Estado de la materia que tiene volumen definido pero adopta la forma del recipiente que lo contiene.",
          respuesta: "Líquido",
        },
        {
          id: "d3",
          texto:
            "Estado de la materia que no tiene ni forma ni volumen definidos. Sus partículas están muy separadas.",
          respuesta: "Gas",
        },
        {
          id: "d4",
          texto:
            "Cambio de estado de líquido a gas que ocurre en toda la masa del líquido al alcanzar cierta temperatura.",
          respuesta: "Ebullición",
        },
      ],
      palabras: ["Gas", "Sólido", "Líquido", "Ebullición"],
    },
    {
      titulo: "Partículas y estructuras",
      definiciones: [
        {
          id: "d1",
          texto:
            "Unidad básica de la materia que conserva las propiedades de un elemento químico.",
          respuesta: "Átomo",
        },
        {
          id: "d2",
          texto:
            "Sustancia formada por la unión de dos o más átomos unidos químicamente.",
          respuesta: "Molécula",
        },
        {
          id: "d3",
          texto:
            "Región alrededor del núcleo donde es más probable encontrar a los electrones.",
          respuesta: "Orbital",
        },
        {
          id: "d4",
          texto:
            "Cargas negativas que se encuentran en los orbitales de un átomo.",
          respuesta: "Electrones",
        },
      ],
      palabras: ["Molécula", "Electrones", "Orbital", "Átomo"],
    },
    {
      titulo: "Cambios y procesos químicos",
      definiciones: [
        {
          id: "d1",
          texto:
            "Proceso en el que una o más sustancias se transforman en otras nuevas con propiedades diferentes.",
          respuesta: "Reacción química",
        },
        {
          id: "d2",
          texto:
            "Sustancia que se consume en una reacción química para formar productos.",
          respuesta: "Reactivo",
        },
        {
          id: "d3",
          texto:
            "Ley que indica que la masa no se crea ni se destruye en una reacción química.",
          respuesta: "Ley de conservación de la masa",
        },
        {
          id: "d4",
          texto:
            "Proceso físico en el que una sustancia pasa del estado sólido al gaseoso sin pasar por el líquido.",
          respuesta: "Sublimación",
        },
      ],
      palabras: [
        "Ley de conservación de la masa",
        "Reacción química",
        "Reactivo",
        "Sublimación",
      ],
    },
  ];

  // =========================
  //   ESTADOS GENERALES
  // =========================
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [palabraArrastrada, setPalabraArrastrada] = useState(null);
  const [matches, setMatches] = useState({}); // { definicionId: palabra }
  const [palabrasUsadas, setPalabrasUsadas] = useState([]);
  const [verificado, setVerificado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempo, setTiempo] = useState(45);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  // Header / usuario
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Puntos
  const PUNTOS_POR_CORRECTA = 30;
  const BONUS_TIEMPO_RAPIDO = 10; // Si responde en menos de 25 segundos

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
  //   DRAG & DROP
  // =========================
  const handleDragStart = (palabra) => {
    if (verificado) return;
    setPalabraArrastrada(palabra);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, definicionId) => {
    e.preventDefault();
    if (!palabraArrastrada || verificado) return;

    setMatches((prev) => {
      // Evitar que la misma palabra quede en dos definiciones a la vez
      const nuevo = { ...prev };
      Object.keys(nuevo).forEach((key) => {
        if (nuevo[key] === palabraArrastrada) {
          delete nuevo[key];
        }
      });
      nuevo[definicionId] = palabraArrastrada;

      const usadas = Object.values(nuevo);
      setPalabrasUsadas(usadas);

      return nuevo;
    });

    setPalabraArrastrada(null);
  };

  // =========================
  //   CHECK / VERIFICAR
  // =========================
  const handleCheck = () => {
    if (verificado) return;

    const pregunta = preguntas[preguntaActual];
    const totalDef = pregunta.definiciones.length;

    if (Object.keys(matches).length === 0) return;

    let correctas = 0;
    pregunta.definiciones.forEach((def) => {
      if (matches[def.id] === def.respuesta) {
        correctas++;
      }
    });

    setVerificado(true);

    // Puntos proporcionales a aciertos
    const porcentaje = correctas / totalDef;
    let puntosGanados = Math.round(PUNTOS_POR_CORRECTA * porcentaje);

    if (porcentaje === 1 && tiempo > 25) {
      puntosGanados += BONUS_TIEMPO_RAPIDO;
    }

    if (puntosGanados > 0) {
      setPuntuacion((prev) => prev + puntosGanados);
    }
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
  //   SIGUIENTE / FINALIZAR
  // =========================
  const handleSiguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual((prev) => prev + 1);
      setMatches({});
      setPalabrasUsadas([]);
      setVerificado(false);
      setTiempo(45);
    } else {
      // Finalizar ejercicio
      const puntosFinales = puntuacion;
      const nuevosPuntosTotales = actualizarPuntosUsuario(puntosFinales);

      setJuegoTerminado(true);

      setTimeout(() => {
        alert(
          `¡Has finalizado el ejercicio de Química!\n\nPuntos ganados: ${puntosFinales}\nPuntos totales: ${nuevosPuntosTotales}`
        );
      }, 100);
    }
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
  //   REINICIAR QUIZ
  // =========================
  const handleReiniciar = () => {
    setPreguntaActual(0);
    setPalabraArrastrada(null);
    setMatches({});
    setPalabrasUsadas([]);
    setVerificado(false);
    setPuntuacion(0);
    setTiempo(45);
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
          <TituloFinal>¡Ejercicio de Química Completado! ⚗️</TituloFinal>
          <PuntuacionFinal>
            Puntos ganados en este ejercicio:{" "}
            <PuntuacionNumero>{puntuacion}</PuntuacionNumero>
          </PuntuacionFinal>
          <PuntuacionFinal
            style={{ fontSize: "16px", marginTop: "8px" }}
          >
            Puntos totales:{" "}
            <span
              style={{ fontWeight: "bold", color: "#7c3aed" }}
            >
              {user?.points || 0}
            </span>
          </PuntuacionFinal>
          <MensajeMotivacional>
            Has relacionado conceptos clave de la Química. ¡Sigue
            explorando el mundo de los átomos y las reacciones!
          </MensajeMotivacional>
          <BotonesFinales>
            <BotonReiniciar onClick={handleReiniciar}>
              Reintentar Ejercicio
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
            Se acabó el tiempo para completar esta actividad.
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

  // =========================
  //   PREGUNTA ACTUAL
  // =========================
  const pregunta = preguntas[preguntaActual];
  const totalDefiniciones = pregunta.definiciones.length;
  const puedeVerificar =
    Object.keys(matches).length > 0 && !verificado;

  // Contar correctas para feedback
  let correctas = 0;
  if (verificado) {
    pregunta.definiciones.forEach((def) => {
      if (matches[def.id] === def.respuesta) {
        correctas++;
      }
    });
  }

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
            <Badge>
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </Badge>
          </LeftSection>
          <BadgeContainer>
            <Badge>⭐ {puntuacion} pts</Badge>
            <Badge>⏱️ {tiempo}s</Badge>
            {tiempo > 25 && !verificado && (
              <BadgeBonus>🔥 Bonus disponible!</BadgeBonus>
            )}
          </BadgeContainer>
        </SubHeaderContent>
      </SubHeader>

      <MainContent>
        <InstruccionesBox>
          <InstruccionTitulo>
            🧪 Instrucciones - Relaciona columnas
          </InstruccionTitulo>
          <InstruccionTexto>
            Arrastra cada concepto de la columna derecha hacia la
            definición correcta en la columna izquierda. Completa todos
            los emparejamientos y luego haz clic en{" "}
            <strong>“Verificar”</strong>.
          </InstruccionTexto>
        </InstruccionesBox>

        <PreguntaBox>
          <TituloPregunta>{pregunta.titulo}</TituloPregunta>
          <MatchingLayout>
            <ColumnaDefiniciones>
              {pregunta.definiciones.map((def, index) => {
                const palabraSeleccionada = matches[def.id];
                const esCorrecta =
                  verificado && palabraSeleccionada === def.respuesta;
                const esIncorrecta =
                  verificado &&
                  palabraSeleccionada &&
                  palabraSeleccionada !== def.respuesta;

                return (
                  <DefinicionCard key={def.id}>
                    <NumeroDefinicion>{index + 1}</NumeroDefinicion>
                    <TextoDefinicion>{def.texto}</TextoDefinicion>
                    <EspacioRespuesta
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, def.id)}
                      tieneRespuesta={!!palabraSeleccionada}
                      esCorrecta={esCorrecta}
                      esIncorrecta={esIncorrecta}
                    >
                      {palabraSeleccionada ? (
                        <PalabraColocada
                          esCorrecta={esCorrecta}
                          esIncorrecta={esIncorrecta}
                        >
                          {palabraSeleccionada}
                        </PalabraColocada>
                      ) : (
                        <PlaceholderTexto>Arrastra aquí</PlaceholderTexto>
                      )}
                    </EspacioRespuesta>
                  </DefinicionCard>
                );
              })}
            </ColumnaDefiniciones>

            <ColumnaPalabras>
              <PalabrasHeader>
                <GripVertical size={20} color="#7c3aed" />
                <span>Conceptos químicos</span>
              </PalabrasHeader>
              <PalabrasGrid>
                {pregunta.palabras.map((palabra, index) => (
                  <PalabraChip
                    key={index}
                    draggable={!verificado}
                    onDragStart={() => handleDragStart(palabra)}
                    disabled={
                      verificado ||
                      palabrasUsadas.includes(palabra) &&
                      !Object.values(matches).includes(palabraArrastrada)
                    }
                    isDragging={palabraArrastrada === palabra}
                  >
                    <GripVertical size={16} />
                    {palabra}
                  </PalabraChip>
                ))}
              </PalabrasGrid>
            </ColumnaPalabras>
          </MatchingLayout>
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
            <BotonSiguiente onClick={handleSiguiente}>
              {preguntaActual < preguntas.length - 1
                ? "Siguiente →"
                : "Finalizar"}
            </BotonSiguiente>
          )}
        </BotonesContainer>

        {verificado && (
          <FeedbackBox>
            {correctas === totalDefiniciones ? (
              <FeedbackCorrecto>
                <FeedbackTexto correcto>
                  ✓ ¡Excelente! Has acertado todas las relaciones.{" "}
                  {tiempo > 25 && (
                    <BonusTexto>
                      🔥 ¡Bonus por rapidez! +{BONUS_TIEMPO_RAPIDO} pts
                    </BonusTexto>
                  )}
                </FeedbackTexto>
                <ExplicacionTexto>
                  Dominas los conceptos básicos de este tema. Continúa
                  con la siguiente pregunta para seguir practicando.
                </ExplicacionTexto>
              </FeedbackCorrecto>
            ) : (
              <FeedbackIncorrecto>
                <FeedbackTexto>
                  ✗ Has acertado {correctas} de {totalDefiniciones}{" "}
                  relaciones.
                </FeedbackTexto>
                <ExplicacionTexto>
                  Revisa las combinaciones y observa cuáles definiciones
                  quedaron con el concepto correcto. En la siguiente
                  pregunta podrás mejorar tu resultado.
                </ExplicacionTexto>
              </FeedbackIncorrecto>
            )}
          </FeedbackBox>
        )}
      </MainContent>
    </Container>
  );
};

export default QuizQuimico;

// =====================================
//   STYLED COMPONENTS (Mismo estilo)
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

const TituloPregunta = styled.h2`
  font-size: 20px;
  color: #1f2937;
  margin: 0 0 20px 0;
  text-align: center;
`;

const MatchingLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.4fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ColumnaDefiniciones = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DefinicionCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px 16px 16px;
  border: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 12px;
  align-items: center;
`;

const NumeroDefinicion = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const TextoDefinicion = styled.p`
  margin: 0;
  font-size: 14px;
  color: #111827;
  line-height: 1.4;
`;

const EspacioRespuesta = styled.div`
  grid-column: 1 / -1;
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 6px 12px;
  border: 3px dashed
    ${(props) =>
      props.esCorrecta
        ? "#10b981"
        : props.esIncorrecta
        ? "#ef4444"
        : props.tieneRespuesta
        ? "#7c3aed"
        : "#cbd5e1"};
  border-radius: 12px;
  background: ${(props) =>
    props.esCorrecta
      ? "#d1fae5"
      : props.esIncorrecta
      ? "#fee2e2"
      : props.tieneRespuesta
      ? "#ede9fe"
      : "#f8fafc"};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) =>
      !props.tieneRespuesta && !props.esCorrecta && !props.esIncorrecta
        ? "#7c3aed"
        : undefined};
    background: ${(props) =>
      !props.tieneRespuesta && !props.esCorrecta && !props.esIncorrecta
        ? "#ede9fe"
        : undefined};
  }
`;

const PlaceholderTexto = styled.span`
  color: #94a3b8;
  font-size: 13px;
  font-style: italic;
`;

const PalabraColocada = styled.div`
  padding: 6px 14px;
  background: ${(props) =>
    props.esCorrecta ? "#10b981" : props.esIncorrecta ? "#ef4444" : "#7c3aed"};
  color: white;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s ease;
`;

const ColumnaPalabras = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 16px 18px 20px;
  border: 1px solid #e5e7eb;
`;

const PalabrasHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: #7c3aed;
  margin-bottom: 16px;
`;

const PalabrasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
`;

const PalabraChip = styled.button`
  background: ${(props) => (props.disabled ? "#e5e7eb" : "#f3f0ff")};
  border: 2px solid ${(props) => (props.disabled ? "#cbd5e1" : "#7c3aed")};
  color: ${(props) => (props.disabled ? "#6b7280" : "#4c1d95")};
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "grab")};
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.isDragging ? "0 4px 12px rgba(124,58,237,0.3)" : "none"};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.05)")};
  }
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
