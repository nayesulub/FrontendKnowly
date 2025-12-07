// CrucigramaBiologico.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { User, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// =====================================
//  CONFIGURACIÓN DEL CRUCIGRAMA
// =====================================
// Usamos una cuadrícula 12x12 y definimos las palabras con posición
// 0 = primera fila/columna (como en arrays de JS).
const crosswordConfig = {
  rows: 12,
  cols: 12,
  words: [
    {
      id: "CELULA",
      answer: "CELULA",
      clueNumber: 1,
      clue:
        "Unidad estructural y funcional básica de todos los seres vivos.",
      direction: "across",
      row: 3,
      col: 2,
    },
    {
      id: "NUCLEO",
      answer: "NUCLEO",
      clueNumber: 3,
      clue:
        "Estructura dentro de la célula que contiene el material genético (ADN).",
      direction: "down",
      row: 2,
      col: 5,
    },
    {
      id: "ADN",
      answer: "ADN",
      clueNumber: 4,
      clue:
        "Molécula que almacena la información genética de los seres vivos.",
      direction: "down",
      row: 3,
      col: 7,
    },
    {
      id: "TEJIDO",
      answer: "TEJIDO",
      clueNumber: 2,
      clue:
        "Conjunto de células similares que cumplen una misma función en un organismo.",
      direction: "across",
      row: 6,
      col: 4,
    },
    {
      id: "ORGANO",
      answer: "ORGANO",
      clueNumber: 5,
      clue:
        "Estructura formada por diferentes tejidos que trabajan juntos para realizar una función específica.",
      direction: "down",
      row: 6,
      col: 9,
    },
  ],
};

// Construimos la plantilla fija del crucigrama (cuadrícula y celdas activas)
const buildCrosswordGrid = (config) => {
  const grid = Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col) => ({
      row,
      col,
      isActive: false,
      positions: [], // { wordId, index }
      solutionLetter: null,
      number: null,
    }))
  );

  config.words.forEach((word) => {
    const { id, answer, direction, row, col, clueNumber } = word;
    const upper = answer.toUpperCase();

    for (let i = 0; i < upper.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "down" ? col : col + i;

      const cell = grid[r][c];
      cell.isActive = true;
      cell.positions.push({ wordId: id, index: i });

      const letter = upper[i];
      if (!cell.solutionLetter) {
        cell.solutionLetter = letter;
      }

      if (i === 0) {
        cell.number = clueNumber;
      }
    }
  });

  return grid;
};

const gridTemplate = buildCrosswordGrid(crosswordConfig);
const horizontalClues = crosswordConfig.words.filter(
  (w) => w.direction === "across"
);
const verticalClues = crosswordConfig.words.filter(
  (w) => w.direction === "down"
);

const CrucigramaBiologico = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // =========================
  //   ESTADOS GENERALES
  // =========================
  const [answers, setAnswers] = useState({}); // { wordId: "RESPUESTA" }
  const [verificado, setVerificado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempo, setTiempo] = useState(60);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  // Header / usuario
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Puntos
  const PUNTOS_POR_CRUCIGRAMA = 50;
  const BONUS_TIEMPO_RAPIDO = 10; // si completa correctamente y quedan más de 30s

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
  //   MANEJO DE RESPUESTAS
  // =========================
  const handleWordChange = (wordId, value) => {
    if (verificado) return;
    const mayus = value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");
    setAnswers((prev) => ({
      ...prev,
      [wordId]: mayus,
    }));
  };

  // =========================
  //   CHECK / VERIFICAR
  // =========================
  const handleCheck = () => {
    if (verificado) return;

    let totalLetters = 0;
    let correctLetters = 0;

    crosswordConfig.words.forEach((word) => {
      const target = word.answer.toUpperCase();
      const userAnswer = (answers[word.id] || "").toUpperCase();

      totalLetters += target.length;

      for (let i = 0; i < target.length; i++) {
        if (userAnswer[i] === target[i]) {
          correctLetters++;
        }
      }
    });

    const porcentaje = totalLetters > 0 ? correctLetters / totalLetters : 0;
    let puntosGanados = Math.round(PUNTOS_POR_CRUCIGRAMA * porcentaje);

    // Bonus solo si todo es correcto y queda buen tiempo
    if (porcentaje === 1 && tiempo > 30) {
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
        `¡Has finalizado el Crucigrama Biológico!\n\nPuntos ganados: ${puntosFinales}\nPuntos totales: ${nuevosPuntosTotales}`
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
    setAnswers({});
    setVerificado(false);
    setPuntuacion(0);
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
          <TituloFinal>¡Crucigrama Biológico Completado! 🧬</TituloFinal>
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
            Has reforzado conceptos clave de Biología relacionando
            células, tejidos y órganos. ¡Excelente trabajo!
          </MensajeMotivacional>
          <BotonesFinales>
            <BotonReiniciar onClick={handleReiniciar}>
              Reintentar Crucigrama
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
            Se acabó el tiempo para completar el crucigrama.
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
  //   CÁLCULO DE LETRAS CORRECTAS (para feedback)
  // =========================
  let totalLetters = 0;
  let correctLetters = 0;

  crosswordConfig.words.forEach((word) => {
    const target = word.answer.toUpperCase();
    const userAnswer = (answers[word.id] || "").toUpperCase();

    totalLetters += target.length;
    for (let i = 0; i < target.length; i++) {
      if (userAnswer[i] === target[i]) {
        correctLetters++;
      }
    }
  });

  const puedeVerificar = !verificado && totalLetters > 0;

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
            <Badge>Actividad: Crucigrama Biológico</Badge>
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
          <InstruccionTitulo>🧬 Instrucciones</InstruccionTitulo>
          <InstruccionTexto>
            Completa el <strong>Crucigrama Biológico</strong>. Escribe
            cada palabra en el campo correspondiente a su pista. Las
            letras aparecerán en la cuadrícula y se cruzarán entre sí,
            como en un crucigrama tradicional. Cuando termines, haz clic
            en <strong>“Verificar”</strong>.
          </InstruccionTexto>
        </InstruccionesBox>

        <PreguntaBox>
          <LayoutCrucigrama>
            {/* COLUMNA: CUADRÍCULA */}
            <GridSection>
              <TituloSeccion>Crucigrama</TituloSeccion>
              <CrosswordGrid>
                {gridTemplate.map((row, rIdx) => (
                  <CrosswordRow key={rIdx}>
                    {row.map((cell, cIdx) => {
                      if (!cell.isActive) {
                        return <EmptyCell key={cIdx} />;
                      }

                      const refPos = cell.positions[0];
                      const wordAnswer =
                        (answers[refPos.wordId] || "").toUpperCase();
                      const char =
                        wordAnswer[refPos.index] &&
                        wordAnswer[refPos.index].toUpperCase();

                      const isCorrect =
                        verificado &&
                        char &&
                        char === cell.solutionLetter;
                      const isIncorrect =
                        verificado &&
                        char &&
                        char !== cell.solutionLetter;

                      return (
                        <CrosswordCell
                          key={cIdx}
                          esCorrecta={isCorrect}
                          esIncorrecta={isIncorrect}
                        >
                          {cell.number && (
                            <CellNumber>{cell.number}</CellNumber>
                          )}
                          <CellLetter>{char || ""}</CellLetter>
                        </CrosswordCell>
                      );
                    })}
                  </CrosswordRow>
                ))}
              </CrosswordGrid>
            </GridSection>

            {/* COLUMNA: PISTAS E INPUTS */}
            <CluesSection>
              <TituloSeccion>Pistas</TituloSeccion>

              <CluesBlock>
                <CluesHeading>Horizontales</CluesHeading>
                {horizontalClues.map((word) => (
                  <ClueRow key={word.id}>
                    <ClueNumber>{word.clueNumber}.</ClueNumber>
                    <ClueContent>
                      <ClueText>{word.clue}</ClueText>
                      <WordInput
                        placeholder={`${
                          word.answer.length
                        } letras, ej. ${word.answer.toUpperCase()}`}
                        maxLength={word.answer.length}
                        value={answers[word.id] || ""}
                        onChange={(e) =>
                          handleWordChange(word.id, e.target.value)
                        }
                        disabled={verificado}
                      />
                    </ClueContent>
                  </ClueRow>
                ))}
              </CluesBlock>

              <CluesBlock>
                <CluesHeading>Verticales</CluesHeading>
                {verticalClues.map((word) => (
                  <ClueRow key={word.id}>
                    <ClueNumber>{word.clueNumber}.</ClueNumber>
                    <ClueContent>
                      <ClueText>{word.clue}</ClueText>
                      <WordInput
                        placeholder={`${
                          word.answer.length
                        } letras, ej. ${word.answer.toUpperCase()}`}
                        maxLength={word.answer.length}
                        value={answers[word.id] || ""}
                        onChange={(e) =>
                          handleWordChange(word.id, e.target.value)
                        }
                        disabled={verificado}
                      />
                    </ClueContent>
                  </ClueRow>
                ))}
              </CluesBlock>
            </CluesSection>
          </LayoutCrucigrama>
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
            {correctLetters === totalLetters ? (
              <FeedbackCorrecto>
                <FeedbackTexto correcto>
                  ✓ ¡Excelente! Has completado correctamente el
                  crucigrama.
                  {tiempo > 30 && (
                    <BonusTexto>
                      🔥 ¡Bonus por rapidez! +{BONUS_TIEMPO_RAPIDO} pts
                    </BonusTexto>
                  )}
                </FeedbackTexto>
                <ExplicacionTexto>
                  Demostraste dominar la relación entre células, tejidos,
                  órganos y material genético. ¡Sigue explorando la
                  Biología!
                </ExplicacionTexto>
              </FeedbackCorrecto>
            ) : (
              <FeedbackIncorrecto>
                <FeedbackTexto>
                  Has acertado {correctLetters} de {totalLetters} letras
                  del crucigrama.
                </FeedbackTexto>
                <ExplicacionTexto>
                  Observa la cuadrícula: las celdas en verde están
                  correctas y las rojas tienen letras equivocadas. Puedes
                  revisar tus respuestas antes de finalizar.
                </ExplicacionTexto>
              </FeedbackIncorrecto>
            )}
          </FeedbackBox>
        )}
      </MainContent>
    </Container>
  );
};

export default CrucigramaBiologico;

// =====================================
//   STYLED COMPONENTS (mismo estilo)
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

const LayoutCrucigrama = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1.2fr) minmax(260px, 1.8fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const GridSection = styled.div``;

const CluesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TituloSeccion = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #111827;
`;

const CrosswordGrid = styled.div`
  border: 2px solid #4f46e5;
  border-radius: 8px;
  background: #e5e7eb;
  padding: 4px;
  display: inline-block;
`;

const CrosswordRow = styled.div`
  display: flex;
`;

const CrosswordCellBase = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #9ca3af;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
  }
`;

const EmptyCell = styled(CrosswordCellBase)`
  background: #9ca3af;
  border: 1px solid #6b7280;
`;

const CrosswordCell = styled(CrosswordCellBase)`
  background: ${(props) =>
    props.esCorrecta
      ? "#d1fae5"
      : props.esIncorrecta
      ? "#fee2e2"
      : "#f9fafb"};
  border-color: ${(props) =>
    props.esCorrecta
      ? "#10b981"
      : props.esIncorrecta
      ? "#ef4444"
      : "#9ca3af"};
`;

const CellNumber = styled.span`
  position: absolute;
  top: 1px;
  left: 2px;
  font-size: 9px;
  color: #4b5563;
`;

const CellLetter = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const CluesBlock = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px 14px 14px;
  border: 1px solid #e5e7eb;
`;

const CluesHeading = styled.h5`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const ClueRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const ClueNumber = styled.span`
  font-weight: 700;
  color: #4b5563;
  font-size: 13px;
  margin-top: 2px;
`;

const ClueContent = styled.div`
  flex: 1;
`;

const ClueText = styled.p`
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #111827;
  line-height: 1.35;
`;

const WordInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #c4b5fd;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &::placeholder {
    font-size: 11px;
    color: #9ca3af;
  }

  &:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }

  &:disabled {
    background: #e5e7eb;
    border-color: #cbd5e1;
    color: #6b7280;
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
