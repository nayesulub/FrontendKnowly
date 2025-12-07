import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Exercises = () => {
  const { subject } = useParams(); // Obtiene la materia desde la URL

  return (
    <Container>
      <Title>Ejercicios de {subject.charAt(0).toUpperCase() + subject.slice(1)}</Title>
      <p>Aquí se mostrarán los ejercicios de {subject}.</p>
      {/* Aquí puedes agregar contenido dinámico según la materia */}
    </Container>
  );
};

export default Exercises;

// Estilos
const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #22437c;
  font-size: 2rem;
  font-weight: bold;
`;
