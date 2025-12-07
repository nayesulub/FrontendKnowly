import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle } from 'lucide-react';

export function Crucigrama() {
  const crosswordData = {
    across: {
      3: { answer: 'CUMULONIMBUS', clue: 'Nubes muy altas', startRow: 0, startCol: 2, length: 12 },
      5: { answer: 'ESTRATOS', clue: 'Nubes grises bajas e hinchadas', startRow: 4, startCol: 3, length: 8 },
      6: { answer: 'CIRROS', clue: 'Nubes finas y tenues', startRow: 6, startCol: 2, length: 6 },
      7: { answer: 'NIMBOSTRATOS', clue: 'Nubes planas y grises que cubren gran parte del cielo', startRow: 7, startCol: 6, length: 12 }
    },
    down: {
      1: { answer: 'CUMULOS', clue: 'Nubes grandes, blancas, hinchadas y hermosas', startRow: 0, startCol: 0, length: 7 },
      2: { answer: 'NIMBOS', clue: 'Nubes que forman una cubierta gris oscura', startRow: 1, startCol: 6, length: 6 },
      3: { answer: 'CIRROCUMULOS', clue: 'Nubes que parecen pequeñas bolitas de algodón', startRow: 0, startCol: 2, length: 12 },
      4: { answer: 'CUMULONIMBOS', clue: 'Nubes espesas y de color gris oscuro', startRow: 1, startCol: 11, length: 12 }
    }
  };

  const [userAnswers, setUserAnswers] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const createGrid = () => {
    const grid = Array(13).fill(null).map(() => Array(18).fill(null));
    
    Object.entries(crosswordData.across).forEach(([num, data]) => {
      for (let i = 0; i < data.length; i++) {
        grid[data.startRow][data.startCol + i] = {
          type: 'across',
          number: i === 0 ? num : null,
          index: i,
          word: data.answer,
          clueNum: num
        };
      }
    });

    Object.entries(crosswordData.down).forEach(([num, data]) => {
      for (let i = 0; i < data.length; i++) {
        const row = data.startRow + i;
        const col = data.startCol;
        if (grid[row][col]) {
          grid[row][col] = {
            ...grid[row][col],
            type: 'both',
            downNumber: i === 0 ? num : null,
            downIndex: i,
            downWord: data.answer,
            downClueNum: num
          };
        } else {
          grid[row][col] = {
            type: 'down',
            number: i === 0 ? num : null,
            index: i,
            word: data.answer,
            clueNum: num
          };
        }
      }
    });

    return grid;
  };

  const grid = createGrid();

  const handleCellClick = (row, col, cell) => {
    if (cell) {
      setSelectedCell({ row, col, cell });
    }
  };

  const handleInputChange = (row, col, value) => {
    if (value.length > 1) return;
    
    const key = `${row}-${col}`;
    setUserAnswers(prev => ({
      ...prev,
      [key]: value.toUpperCase()
    }));
  };

  const checkCompletion = () => {
    let allCorrect = true;
    let allFilled = true;

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const key = `${rowIndex}-${colIndex}`;
          const userValue = userAnswers[key];
          
          if (!userValue) {
            allFilled = false;
          }
          
          if (cell.type === 'across' || cell.type === 'both') {
            const correctLetter = cell.word[cell.index];
            if (userValue !== correctLetter) {
              allCorrect = false;
            }
          } else if (cell.type === 'down') {
            const correctLetter = cell.word[cell.index];
            if (userValue !== correctLetter) {
              allCorrect = false;
            }
          }
        }
      });
    });

    return allCorrect && allFilled;
  };

  useEffect(() => {
    setIsComplete(checkCompletion());
  }, [userAnswers]);

  const handleFinish = () => {
    if (isComplete) {
      alert('¡Felicidades! Has completado el crucigrama correctamente.');
    }
  };

  return (
    <Container>
      <Header>
        <img src="./Knowly.png" alt="Knowly Logo" style={{ height: '50px', filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))' }} />
        <Nav>
          <NavItem>ASIGNATURAS</NavItem>
          <NavItem>CURSOS</NavItem>
          <NavItem>PRECIOS</NavItem>
          <NavItem>ACCEDE</NavItem>
          <RegButton>REGÍSTRATE</RegButton>
        </Nav>
      </Header>

      <Main>
        <Title>Actividad: Tipos de nubes</Title>

        <Content>
          <GridSection>
            <GridWrapper>
              {grid.map((row, rowIndex) => (
                <Row key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    if (!cell) {
                      return <EmptyCell key={colIndex} />;
                    }

                    const key = `${rowIndex}-${colIndex}`;
                    const userValue = userAnswers[key] || '';
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                    return (
                      <Cell
                        key={colIndex}
                        isSelected={isSelected}
                        onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                      >
                        {(cell.number || cell.downNumber) && (
                          <Number>{cell.number || cell.downNumber}</Number>
                        )}
                        <Input
                          value={userValue}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          maxLength={1}
                        />
                      </Cell>
                    );
                  })}
                </Row>
              ))}
            </GridWrapper>
          </GridSection>

          <CluesSection>
            <CluesBox>
              <ClueGroup>
                <ClueTitle>Horizontal</ClueTitle>
                {Object.entries(crosswordData.across).map(([num, data]) => (
                  <Clue key={num}>
                    <ClueNum>{num}.</ClueNum>
                    <ClueText>{data.clue}</ClueText>
                  </Clue>
                ))}
              </ClueGroup>

              <ClueGroup>
                <ClueTitle>Vertical</ClueTitle>
                {Object.entries(crosswordData.down).map(([num, data]) => (
                  <Clue key={num}>
                    <ClueNum>{num}.</ClueNum>
                    <ClueText>{data.clue}</ClueText>
                  </Clue>
                ))}
              </ClueGroup>
            </CluesBox>

            {isComplete && (
              <FinishButton onClick={handleFinish}>
                <CheckCircle size={20} />
                Finalizar Actividad
              </FinishButton>
            )}
          </CluesSection>
        </Content>
      </Main>
    </Container>
  );
}

export default Crucigrama;

const Container = styled.div`
  min-height: 100vh;
  width:100%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #fce7f3 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`;

const NavItem = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RegButton = styled.button`
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(20, 184, 166, 0.4);
  }
`;

const Main = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #1e40af;
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GridSection = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    overflow-x: auto;
  }
`;

const GridWrapper = styled.div`
  display: inline-block;
`;

const Row = styled.div`
  display: flex;
`;

const EmptyCell = styled.div`
  width: 40px;
  height: 40px;
  background: transparent;
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const Cell = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.isSelected ? '#7c3aed' : '#cbd5e1'};
  background: ${props => props.isSelected ? '#f3e8ff' : 'white'};
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #7c3aed;
    background: #faf5ff;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const Number = styled.span`
  position: absolute;
  top: 2px;
  left: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #7c3aed;
  
  @media (max-width: 768px) {
    font-size: 0.5rem;
    top: 1px;
    left: 2px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  outline: none;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CluesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CluesBox = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ClueGroup = styled.div``;

const ClueTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: #7c3aed;
  margin-bottom: 1rem;
  border-bottom: 3px solid #e9d5ff;
  padding-bottom: 0.5rem;
`;

const Clue = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ClueNum = styled.span`
  font-weight: 700;
  color: #7c3aed;
  min-width: 25px;
`;

const ClueText = styled.span`
  color: #475569;
  line-height: 1.5;
`;

const FinishButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;