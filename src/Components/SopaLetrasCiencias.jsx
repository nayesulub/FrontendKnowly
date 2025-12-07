import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SopaLetrasCiencias() {
  const navigate = useNavigate();
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  
  // Estados para el header
  const [user, setUser] = useState({ name: 'Usuario', idrol: 2 });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  const grid = [
    ['P', 'P', 'L', 'A', 'N', 'E', 'T', 'A', 'N'],
    ['D', 'D', 'D', 'M', 'G', 'C', 'T', 'E', 'A'],
    ['N', 'T', 'D', 'B', 'D', 'U', 'D', 'B', 'T'],
    ['A', 'I', 'R', 'I', 'R', 'S', 'A', 'D', 'U'],
    ['C', 'E', 'R', 'E', 'D', 'U', 'C', 'E', 'R'],
    ['U', 'R', 'T', 'N', 'C', 'D', 'N', 'D', 'A'],
    ['I', 'R', 'D', 'T', 'L', 'I', 'E', 'P', 'L'],
    ['D', 'A', 'R', 'E', 'P', 'D', 'C', 'M', 'E'],
    ['A', 'D', 'L', 'D', 'C', 'D', 'S', 'L', 'Z'],
    ['R', 'E', 'U', 'T', 'I', 'L', 'I', 'Z', 'A']
  ];

  const words = [
    { word: 'TIERRA', found: false },
    { word: 'AGUA', found: false },
    { word: 'RECICLA', found: false },
    { word: 'PLANETA', found: false },
    { word: 'CUIDAR', found: false },
    { word: 'REDUCE', found: false },
    { word: 'NATURALEZA', found: false },
    { word: 'AMBIENTE', found: false },
    { word: 'REUTILIZA', found: false }
  ];

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    setShowMenu(false);
    alert('Cerrando sesión...');
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    alert('Ir al perfil...');
  };

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row, col) => {
    if (isSelecting) {
      setSelectedCells(prev => {
        const exists = prev.find(cell => cell.row === row && cell.col === col);
        if (!exists) {
          return [...prev, { row, col }];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    checkWord();
  };

  const checkWord = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const foundWord = words.find(w => 
      (w.word === selectedWord || w.word === reversedWord) && !foundWords.includes(w.word)
    );

    if (foundWord) {
      const newFoundWords = [...foundWords, foundWord.word];
      setFoundWords(newFoundWords);
      alert(`¡Encontraste la palabra: ${foundWord.word}!`);
      
      // Verificar si se completó el juego
      if (newFoundWords.length === words.length) {
        setTimeout(() => {
          setJuegoTerminado(true);
        }, 500);
      }
    }
    
    setSelectedCells([]);
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isWordFound = (word) => {
    return foundWords.includes(word);
  };

  // Pantalla de juego completado
  if (juegoTerminado) {
    return (
      <PantallaFinal>
        <CardFinal>
          <LogoCarta src="././Knowly.png" alt="Knowly" />
          <TituloFinal>¡Juego Completado!</TituloFinal>
          <PuntuacionFinal>
            Has encontrado todas las palabras: <PuntuacionNumero>{foundWords.length}</PuntuacionNumero> de {words.length}
          </PuntuacionFinal>
          <BotonReiniciar onClick={() => window.location.reload()}>
            Reiniciar
          </BotonReiniciar>
        </CardFinal>
      </PantallaFinal>
    );
  }

  return (
    <PageContainer>
      {/* Header Principal - Actualizado */}
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
              🌍 Ecología y Medio Ambiente
            </Badge>
          </LeftSection>
          <BadgeContainer>
            <Badge>📝 {foundWords.length}/{words.length} palabras</Badge>
          </BadgeContainer>
        </SubHeaderContent>
      </SubHeader>

      <MainContent>
        <ActivityTitle>Sopa de Letras: Ecología</ActivityTitle>
        
        <GameContainer>
          <GridContainer onMouseLeave={() => setIsSelecting(false)}>
            {grid.map((row, rowIndex) => (
              <GridRow key={rowIndex}>
                {row.map((letter, colIndex) => (
                  <GridCell
                    key={`${rowIndex}-${colIndex}`}
                    selected={isCellSelected(rowIndex, colIndex)}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {letter}
                  </GridCell>
                ))}
              </GridRow>
            ))}
          </GridContainer>

          <WordsContainer>
            <WordsColumn>
              <Word found={isWordFound('TIERRA')}>Tierra</Word>
              <Word found={isWordFound('PLANETA')}>Planeta</Word>
              <Word found={isWordFound('NATURALEZA')}>Naturaleza</Word>
            </WordsColumn>
            <WordsColumn>
              <Word found={isWordFound('AGUA')}>Agua</Word>
              <Word found={isWordFound('CUIDAR')}>Cuidar</Word>
              <Word found={isWordFound('AMBIENTE')}>Ambiente</Word>
            </WordsColumn>
            <WordsColumn>
              <Word found={isWordFound('RECICLA')}>Recicla</Word>
              <Word found={isWordFound('REDUCE')}>Reduce</Word>
              <Word found={isWordFound('REUTILIZA')}>Reutiliza</Word>
            </WordsColumn>
          </WordsContainer>

          <ProgressBar>
            <ProgressText>Palabras encontradas: {foundWords.length} / {words.length}</ProgressText>
            <ProgressTrack>
              <ProgressFill width={(foundWords.length / words.length) * 100} />
            </ProgressTrack>
          </ProgressBar>
        </GameContainer>
      </MainContent>
    </PageContainer>
  );
}

export default SopaLetrasCiencias;

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


const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #fef3c7 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
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

const BadgeContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px;

  @media (max-width: 768px) {
    padding: 24px 12px;
  }
`;

const ActivityTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #471383ff;
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const GameContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 3rem;
  user-select: none;
  justify-content: center;
  align-items: center;
`;

const GridRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const GridCell = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    : '#f8fafc'
  };
  color: ${props => props.selected ? 'white' : '#1e293b'};
  border: 2px solid ${props => props.selected ? '#f59e0b' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.selected 
    ? '0 4px 12px rgba(251, 191, 36, 0.4)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)'
  };
  
  &:hover {
    transform: scale(1.05);
    border-color: #fbbf24;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const WordsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const WordsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Word = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.found ? '#10b981' : '#64748b'};
  text-decoration: ${props => props.found ? 'line-through' : 'none'};
  transition: all 0.3s;
  padding: 0.5rem 1rem;
  background: ${props => props.found 
    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    : '#f8fafc'
  };
  border-radius: 12px;
  text-align: center;
  border: 2px solid ${props => props.found ? '#10b981' : '#e2e8f0'};
`;

const ProgressBar = styled.div`
  margin-top: 2rem;
`;

const ProgressText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 16px;
  background: #e2e8f0;
  border-radius: 50px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%);
  transition: width 0.5s ease;
  border-radius: 50px;
`;

// Styled Components para pantalla final
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

const LogoCarta = styled.img`
  height: 60px;
  margin-bottom: 24px;
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
  color: #261e46ff;
  font-size: 28px;
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
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4e288eff;
  }
`;