import React, { useState } from "react";
import styled from "styled-components";
import { Book, Star } from "lucide-react";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 250px;
  background:rgb(118, 70, 230);
  color: white;
  padding: 20px;
`;

const Main = styled.div`
  flex: 1;
  padding: 20px;
  background: #ecf0f1;
`;

const Title = styled.h2`
  margin-bottom: 15px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CourseCard = styled.div`
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.img`
width: 200px;
margin-bottom: 1rem;
`;

const subjects = ["Graficas", "Gestion", "Historia", "Ciencias"];

const courses = {
  Matemáticas: ["Álgebra", "Geometría", "Cálculo"],
  Español: ["Ortografía", "Redacción", "Literatura"],
  Historia: ["Historia Universal", "Historia de América"],
  Ciencias: ["Física", "Química", "Biología"],
};

const Prueba = () => {
  const [selectedSubject, setSelectedSubject] = useState("Matemáticas");

  return (
    <Container>
      <Sidebar>
      <Logo src="././Knowly.png" alt="Knowly Logo" />
        <List>
          {subjects.map((subject) => (
            <ListItem key={subject} onClick={() => setSelectedSubject(subject)}>
              <Book size={18} /> {subject}
            </ListItem>
          ))}
        </List>
      </Sidebar>
      <Main>
        <Title>Cursos de {selectedSubject}</Title>
        {courses[selectedSubject].map((course) => (
          <CourseCard key={course}>
            <Star size={20} color="#f39c12" /> {course}
          </CourseCard>
        ))}
      </Main>
    </Container>
  );
};

export default Prueba;

