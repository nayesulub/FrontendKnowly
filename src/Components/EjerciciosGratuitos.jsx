import React, { useState } from 'react';
import styled from 'styled-components';
import { HelpCircle, Check, ChevronRight, Book, Layers, User, LogOut, RefreshCw, AlertCircle, UserCircle  } from 'lucide-react';


const EjerciciosGratuitos = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [validatedAnswers, setValidatedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState({
    // Paso 1
    step1_ex1: '',
    step1_ex2: '',
    step1_ex3: '',
    step1_ex4: '',
    // Paso 2
    step2_ex1: '',
    step2_ex2: '',
    step2_ex3: '',
    step2_ex4: '',
    // Paso 3
    step3_ex1: '',
    step3_ex2: '',
    step3_ex3: '',
    step3_ex4: '',
  });
  
  const totalSteps = 3;
  
  // Respuestas correctas para cada ejercicio
  const correctAnswers = {
    step1_ex1: 'camino',
    step1_ex2: 'estudiaron',
    step1_ex3: 'pudo',
    step1_ex4: 'vamos',
    step2_ex1: 'nadaste',
    step2_ex2: 'viajaron',
    step2_ex3: 'sabe',
    step2_ex4: 'trabajaron',
    step3_ex1: 'probe',
    step3_ex2: 'hagan',
    step3_ex3: 'pidio',
    step3_ex4: 'estuve'
  };
  
  // Conjuntos de ejercicios para cada paso
  const exerciseSets = {
    1: [
      { id: 'step1_ex1', prefix: 'Yo siempre', suffix: 'al parque los domingos por la mañana.', verb: 'caminar' },
      { id: 'step1_ex2', prefix: 'Ellos', suffix: 'para el examen toda la noche.', verb: 'estudiar' },
      { id: 'step1_ex3', prefix: 'Mi hermana no', suffix: 'venir a la fiesta ayer.', verb: 'poder' },
      { id: 'step1_ex4', prefix: 'Nosotros', suffix: 'al cine este fin de semana.', verb: 'ir' }
    ],
    2: [
      { id: 'step2_ex1', prefix: 'Tú', suffix: 'muy bien en la competencia de natación.', verb: 'nadar' },
      { id: 'step2_ex2', prefix: 'Mis padres', suffix: 'a Europa el verano pasado.', verb: 'viajar' },
      { id: 'step2_ex3', prefix: 'Ella', suffix: 'tocar el piano desde los cinco años.', verb: 'saber' },
      { id: 'step2_ex4', prefix: 'Los estudiantes', suffix: 'en silencio durante el examen.', verb: 'trabajar' }
    ],
    3: [
      { id: 'step3_ex1', prefix: 'Yo nunca', suffix: 'comida picante hasta que visité México.', verb: 'probar' },
      { id: 'step3_ex2', prefix: 'Ustedes', suffix: 'la tarea antes de salir a jugar.', verb: 'hacer' },
      { id: 'step3_ex3', prefix: 'El profesor', suffix: 'que todos entregaran el proyecto el viernes.', verb: 'pedir' },
      { id: 'step3_ex4', prefix: 'Yo', suffix: 'muy contento cuando me dieron la noticia.', verb: 'estar' }
    ]
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateCurrentAnswers = () => {
    const currentExercises = exerciseSets[currentStep];
    let isValid = true;
    let currentStepValidated = {};
    
    currentExercises.forEach(exercise => {
      const userAnswer = answers[exercise.id].trim().toLowerCase();
      const correctAnswer = correctAnswers[exercise.id].toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      
      if (!isCorrect) {
        isValid = false;
      }
      
      currentStepValidated[exercise.id] = {
        isCorrect,
        userAnswer,
        correctAnswer
      };
    });
    
    setValidatedAnswers(prev => ({
      ...prev,
      ...currentStepValidated
    }));
    
    return isValid;
  };
  
  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    Object.keys(validatedAnswers).forEach(key => {
      if (validatedAnswers[key].isCorrect) {
        correct++;
      }
      total++;
    });
    
    setScore(correct);
    setTotalQuestions(total);
    
    return correct === total;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isCurrentStepValid = validateCurrentAnswers();
    
    if (isCurrentStepValid) {
      setShowFeedback(true);
      setIsError(false);
      setFeedbackMessage('¡Excelente! Tus respuestas son correctas.');
      
      // Simular un pequeño retraso antes de avanzar
      setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep(prev => prev + 1);
          setShowFeedback(false);
        } else {
          // Verificar si todas las respuestas son correctas
          const perfectScore = calculateScore();
          setAllCorrect(perfectScore);
          setCompleted(true);
          setShowFeedback(false);
        }
      }, 1500);
    } else {
      setShowFeedback(true);
      setIsError(true);
      setFeedbackMessage('Revisa tus respuestas. Algunas no son correctas.');
      
      // Si es el último paso, avanzamos después de un tiempo para mostrar el resultado final
      if (currentStep === totalSteps) {
        setTimeout(() => {
          const perfectScore = calculateScore();
          setAllCorrect(perfectScore);
          setCompleted(true);
          setShowFeedback(false);
        }, 1500);
      }
    }
  };
  
  const toggleHelp = () => {
    setShowHelp(prev => !prev);
  };
  
  const handleExit = () => {
    // Aquí puedes añadir la lógica para redirigir a otra página o reiniciar
    window.location.href = '/SelecLog'; // O la ruta que necesites
  };
  
  const handleRetry = () => {
    // Reiniciar el ejercicio
    setCurrentStep(1);
    setCompleted(false);
    setAllCorrect(false);
    setShowFeedback(false);
    setValidatedAnswers({});
    setScore(0);
    setTotalQuestions(0);
    setAnswers({
      step1_ex1: '',
      step1_ex2: '',
      step1_ex3: '',
      step1_ex4: '',
      step2_ex1: '',
      step2_ex2: '',
      step2_ex3: '',
      step2_ex4: '',
      step3_ex1: '',
      step3_ex2: '',
      step3_ex3: '',
      step3_ex4: '',
    });
  };
  
  // Obtener el conjunto de ejercicios actual según el paso
  const currentExercises = exerciseSets[currentStep];
  
  return (
    <PageContainer>
      <NavbarContainer>
        <LogoContainer>
          <LogoImage src="././Knowly.png" alt="Knowly Logo" />
        </LogoContainer>
        <MenuContainer>
          <MenuItem href="HomeGratuito">
            
            ASIGNATURAS
          </MenuItem>
          <MenuItem href="Cursos">
          
            CURSOS
          </MenuItem>
          <MenuItem href="#">
            GRATUITO
          </MenuItem>
          <UserIconContainer>
            <UserCircle  size={20} color="white" />
          </UserIconContainer>
        </MenuContainer>
      </NavbarContainer>
      
      <Container>
        <HelpButton onClick={toggleHelp}>
          <HelpCircle size={18} />
          Ayuda
        </HelpButton>
        
        <Header>
          <Title>Ejercicio de Verbos</Title>
          <Subtitle>Complete las siguientes oraciones con la forma correcta del verbo entre paréntesis.</Subtitle>
        </Header>
        <LeftBanner>
          <BannerImage />
          <h6>Tenemos grandes promociones para ti!</h6>
          <p>¿HAMBRE?</p>
          <BannerButton>SABER MÁS</BannerButton>
        </LeftBanner>
  
        <RightBanner>
          <BannerImage />
          <h6>Tenemos grandes promociones para ti!</h6>
          <p>¿HAMBRE?</p>
          <BannerButton>SABER MÁS</BannerButton>
        </RightBanner>
        
        {!completed && (
          <ProgressContainer>
            <StepIndicator>Ejercicio {currentStep} de {totalSteps}</StepIndicator>
            <ProgressBar>
              {[...Array(totalSteps)].map((_, index) => (
                <ProgressStep key={index} active={index + 1 <= currentStep}>
                  {index + 1 <= currentStep ? <Check size={20} /> : index + 1}
                </ProgressStep>
              ))}
            </ProgressBar>
          </ProgressContainer>
        )}
        
        {showHelp && (
          <div style={{ 
            backgroundColor: '#EDE7F6', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            borderLeft: '4px solid #7B1FA2'
          }}>
            <p><strong>Ayuda:</strong> Recuerda conjugar el verbo según el sujeto de la oración y el tiempo verbal indicado.</p>
          </div>
        )}
        
        {showFeedback && (
          <FeedbackMessage isError={isError}>
            {feedbackMessage}
          </FeedbackMessage>
        )}
        
        {completed ? (
          <CompletionCard isSuccess={allCorrect}>
            {allCorrect ? (
              <>
                <Check size={60} color="#4CAF50" style={{ marginBottom: '1rem' }} />
                <CompletionTitle isSuccess={true}>¡Felicidades!</CompletionTitle>
                <CompletionMessage>
                  Has completado todos los ejercicios de verbos correctamente. 
                  Tu progreso ha sido guardado.
                </CompletionMessage>
              </>
            ) : (
              <>
                <AlertCircle size={60} color="#f44336" style={{ marginBottom: '1rem' }} />
                <CompletionTitle isSuccess={false}>No acertaste todas las respuestas</CompletionTitle>
                <CompletionMessage>
                  Has completado el ejercicio con {score} respuestas correctas de {totalQuestions}.
                  Revisa tus errores y vuelve a intentarlo.
                </CompletionMessage>
                
                <ResultsContainer>
                  <ResultTitle>Resumen de respuestas:</ResultTitle>
                  {Object.keys(validatedAnswers).map(key => {
                    const item = validatedAnswers[key];
                    if (!item.isCorrect) {
                      return (
                        <ResultItem key={key}>
                          <div>Respuesta: <strong>{item.userAnswer}</strong></div>
                          <div>Correcta: <strong style={{color: '#4CAF50'}}>{item.correctAnswer}</strong></div>
                        </ResultItem>
                      );
                    }
                    return null;
                  })}
                </ResultsContainer>
              </>
            )}
            
            <ButtonContainer>
              {!allCorrect && (
                <RetryButton onClick={handleRetry}>
                  <RefreshCw size={20} />
                  Volver a intentar
                </RetryButton>
              )}
              <ExitButton onClick={handleExit}>
                <LogOut size={20} />
                Salir
              </ExitButton>
            </ButtonContainer>
          </CompletionCard>
        ) : (
          <Form onSubmit={handleSubmit}>
            {currentExercises.map((exercise) => (
              <ExerciseItem key={exercise.id}>
                <ExerciseText>
                  {exercise.prefix} 
                  <InputWrapper>
                    <Input 
                      type="text" 
                      name={exercise.id} 
                      value={answers[exercise.id]} 
                      onChange={handleInputChange} 
                      required 
                      isCorrect={validatedAnswers[exercise.id]?.isCorrect}
                    />
                    <Verb>({exercise.verb})</Verb>
                  </InputWrapper>
                  {exercise.suffix}
                </ExerciseText>
              </ExerciseItem>
            ))}
            
            <ButtonContainer>
              <Button type="submit">
                {currentStep < totalSteps ? 'Siguiente' : 'Finalizar'}
                <ChevronRight size={20} />
              </Button>
            </ButtonContainer>
          </Form>
        )}
      </Container>
    </PageContainer>
  );
};

export default EjerciciosGratuitos;


// Navbar Styled Components
const NavbarContainer = styled.nav`
  background-color:rgb(118, 70, 230);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 45px;
`;

const LogoImage = styled.img`
  height: 60px;
  margin-right: 8px;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #FF9A9E, #FAD0C4, #FDD819);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MenuContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const MenuItem = styled.a`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  text-decoration: none;
  color: white;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: white;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #FFD54F;
    
    &:after {
      width: 100%;
    }
  }
`;

const UserIconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

// Existing Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e0e0e0;
    z-index: -1;
  }
`;

const ProgressStep = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  z-index: 1;
`;

const Form = styled.form`
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ExerciseItem = styled.div`
  margin-bottom: 1.5rem;
`;

const ExerciseText = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 1.1rem;
  line-height: 1.8;
`;

const InputWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 150px;
  transition: border 0.3s;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  ${props => props.isCorrect !== undefined && `
    border-color: ${props.isCorrect ? '#4CAF50' : '#f44336'};
    background-color: ${props.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  `}
`;

const Verb = styled.span`
  color: #2196F3;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #388E3C;
  }
`;

const ExitButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const RetryButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1976D2;
  }
`;

const HelpButton = styled.button`
  position: fixed;
  top: 80px;
  right: 20px;
  background-color: #7B1FA2;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #6A1B9A;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
`;

const FeedbackMessage = styled.div`
  background-color: ${props => props.isError ? '#FFEBEE' : '#E8F5E9'};
  border-left: 4px solid ${props => props.isError ? '#f44336' : '#4CAF50'};
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  color: ${props => props.isError ? '#B71C1C' : '#1B5E20'};
`;

const CompletionCard = styled.div`
  background-color: ${props => props.isSuccess ? '#E8F5E9' : '#FFEBEE'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 2rem 0;
  border: 2px solid ${props => props.isSuccess ? '#4CAF50' : '#f44336'};
`;

const CompletionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.isSuccess ? '#2E7D32' : '#B71C1C'};
  margin-bottom: 1rem;
`;

const CompletionMessage = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const ResultsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const ResultTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SideBanner = styled.div`
position: fixed;
top: 55%;
transform: translateY(-50%);
width: 100px;
background-color: white;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
border-radius: 15px;
padding: 6px;
text-align: center;
z-index: 10;
`;

const LeftBanner = styled(SideBanner)`
left: 2px;
`;

const RightBanner = styled(SideBanner)`
right: 2px;
`;

const BannerImage = styled.div`
width: 100%;
height: 280px;
background-image: url('././Banner.jpeg');
background-size: cover;
background-position: center;
border-radius: 10px;
margin-bottom: 10px;
`;

const BannerButton = styled.button`
background-color: #3498db;
color: white;
border: none;
padding: 2px 7px;
border-radius: 8px;
margin-top: 15px;
cursor: pointer;
transition: background-color 0.3s ease;

&:hover {
  background-color: #2980b9;
}
`;
