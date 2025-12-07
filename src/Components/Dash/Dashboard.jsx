import React, { useState } from 'react';
import styled from 'styled-components';
import Gestion from './Gestion';
import Nivel from './Nivel';
import Grados from './Grados';
import Historial from './Historial';
import { useNavigate } from 'react-router-dom';
import { PieChart, BarChart, LineChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, Book as BookIcon, BarChart as BarChartIcon, Layers as LayersIcon, GraduationCap as GraduationCapIcon, Receipt as ReceiptIcon, LogOut } from 'lucide-react';
import Categorias from './Categorias';
// Datos estáticos
const subjectColors = {
  'Inglés': '#4a7dff',
  'Español': '#4cd963',
  'Matemáticas': '#9179ff',
  'Historia': '#ff6b6b',
  'Química': '#ff85a2',
  'Física': '#c278ff',
  'Geografía': '#56c7ff',
  'Informática': '#52c0c9'
};

const subjectData = [
  { name: 'Matemáticas', value: 300},
  { name: 'Historia', value: 250 },
  { name: 'Física', value: 200 },
  { name: 'Química', value: 150 },
  { name: 'Español', value: 100 }
];

const userMonthData = [
  { month: 'Enero', usuarios: 400 },
  { month: 'Febrero', usuarios: 300 },
  { month: 'Marzo', usuarios: 500 },
  { month: 'Abril', usuarios: 450 },
  { month: 'Mayo', usuarios: 600 }
];

const salesMonthData = [
  { month: 'Enero', ventas: 4000 },
  { month: 'Febrero', ventas: 3000 },
  { month: 'Marzo', ventas: 5000 },
  { month: 'Abril', ventas: 4500 },
  { month: 'Mayo', ventas: 6000 }
];

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a29bfe'];

const Sidebar = ({ activeView, setActiveView, navigate }) => (
  <SidebarContainer>
    <Logo onClick={() => navigate('/HomeLog')} src="././Knowly.png" alt="Knowly Logo" />
    <Button onClick={() => setActiveView('graficas')} active={activeView === 'graficas'}>
      <LayoutDashboard style={{ marginRight: '10px' }} /> Gráficas
    </Button>
    <Button onClick={() => setActiveView('categorias')} active={activeView === 'categorias'}>
      <LayersIcon style={{ marginRight: '10px' }} /> Categorías
    </Button>
    <Button onClick={() => setActiveView('gestion')} active={activeView === 'gestion'}>
      <BookIcon style={{ marginRight: '10px' }} /> Asignaturas
    </Button>
    <Button onClick={() => setActiveView('nivel')} active={activeView === 'nivel'}>
      <LayersIcon style={{ marginRight: '10px' }} /> Usuarios
    </Button>
    <Button onClick={() => setActiveView('grados')} active={activeView === 'grados'}>
      <GraduationCapIcon style={{ marginRight: '10px' }} /> Actividades
    </Button>
    <Button onClick={() => setActiveView('historial')} active={activeView === 'historial'}>
      <ReceiptIcon style={{ marginRight: '10px' }} /> Historial
    </Button>
    <Button onClick={() => navigate('/Login')}>
      <LogOut style={{ marginRight: '10px' }} /> Cerrar Sesión
    </Button>
  </SidebarContainer>
);

const PieChartComponent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Materias más Consultadas</CardTitle>
    </CardHeader>
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={subjectData} dataKey="value" nameKey="name" label>
            {subjectData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={subjectColors[entry.name] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  </Card>
);

const LineChartComponent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Usuarios por Mes</CardTitle>
    </CardHeader>
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userMonthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="usuarios" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </Card>
);

const BarChartComponent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ventas por Mes</CardTitle>
    </CardHeader>
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesMonthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ventas">
            {salesMonthData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </Card>
);

const Dashboard = () => {
  const [activeView, setActiveView] = useState('graficas');
  const navigate = useNavigate();

  return (
    <Container>
      <Sidebar activeView={activeView} setActiveView={setActiveView} navigate={navigate} />
      <MainContent>
        <Header>
          <HeaderTitle>PANEL ADMINISTRATIVO</HeaderTitle>
        </Header>
        {activeView === 'graficas' && (
          <Content>
            <PieChartComponent />
            <LineChartComponent />
            <BarChartComponent />
          </Content>
        )}
        {activeView === 'gestion' && (
          <Content>
            <Gestion />
          </Content>
        )}
        {activeView === 'nivel' && (
          <Content>
            <Nivel />
          </Content>
        )}
        {activeView === 'grados' && (
          <Content>
            <Grados />
          </Content>
        )}
        {activeView === 'historial' && (
          <Content>
            <Historial />
          </Content>
        )}
        {activeView === 'categorias' && (
          <Content>
            <Categorias />
          </Content>
        )}
      </MainContent>
    </Container>
  );
};

export default Dashboard;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%; 
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(124, 58, 237, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 70px;
    padding: 15px 10px;
  }
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: brightness(1.1);

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  @media (max-width: 768px) {
    width: 50px;
    margin-bottom: 1rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 10px;
  background: ${(props) => (props.active ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid ${(props) => (props.active ? '#f97316' : 'transparent')};
  color: white;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  box-shadow: ${(props) => (props.active ? '0 4px 15px rgba(249, 115, 22, 0.4)' : 'none')};

  &:hover {
    background: ${(props) => (props.active ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' : 'rgba(255, 255, 255, 0.2)')};
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 10px;
    
    span {
      display: none;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const Header = styled.header`
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 3px solid #7c3aed;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const HeaderTitle = styled.h1`
  background: linear-gradient(135deg, #7c3aed, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 2px solid transparent;
  

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  padding: 1.5rem;

  border-bottom: 3px solid #6d28d9;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
 

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ChartContainer = styled.div`
  padding: 1.5rem;

  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;