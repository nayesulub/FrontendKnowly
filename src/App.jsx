import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Prueba from './Components/Prueba';
import Registro from './Components/Registro';
import Home from './Components/Home';
import Selec from './Components/Selec';
import Cursos from './Components/Cursos';
import Exercises from './Components/Exercises';
import Precios from './Components/Precios';
import Pago from './Components/Pago';
import HomeGratuito from './Components/HomeGratuito';
import SelecNivel from './Components/SelecNivel'
import LoginGratuito from './Components/LoginGratuito';
import EjerciciosGratuitos from './Components/EjerciciosGratuitos';
import HomeLog from './Components/Log/HomeLog';
import CursosLog from './Components/Log/CursosLog';
import Ejercicios from './Components/Log/Ejercicios';
import SelecLog from './Components/Log/SelecLog';
import Dashboard from './Components/Dash/Dashboard';
import Gestion from './Components/Dash/Gestion';
import Nivel from './Components/Dash/Nivel';
import Grados from './Components/Dash/Grados';
import Historial from './Components/Dash/Historial';
import Asignaturas from './Components/Asignaturas';
import Perfil from './Components/Perfil';
import SopaLetrasCiencias from './Components/SopaLetrasCiencias';
import CrucigramaNubesCiencias from './Components/CrucigramaNubesCiencias.jsx';
import EjerciciosPreguntas from './Components/Ejercicios/EjerciciosPreguntas.jsx';
import GoogleLogin from './Components/google.jsx';
import MemoramaCiencias from './Components/Ejercicios/MemoramaCiencias.jsx';
import Asignaturasp from './Components/Asignaturasp.jsx';
import Pagos from './Components/Pagos.jsx';
import Juegos from './Components/juegos.jsx';
import TriviasValores from './Components/TriviasValores.jsx';
import QuizQuimico from './Components/Ejercicios/QuizQuimico.jsx';
import CrucigramaBiologico from './Components/Ejercicios/CrucigramaBiologico.jsx';
import LineaTiempo from './Components/Ejercicios/LineaTiempo.jsx';
import Categorias from './Components/Dash/Categorias.jsx';
import Actividades from './Components/Actividades.jsx';

function App() {
  return (
    <div className= "bg-light" style={{ 
      display: 'flex', 
      justifyContent: 'center',  
      alignItems: 'center', 
      minHeight: '100vh'
    }}>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Prueba" element={<Prueba />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Cursos" element={<Cursos />} />
        <Route path="/Precios" element={<Precios />} />
        <Route path="/HomeLog" element={<HomeLog />} />
        <Route path="/Pago" element={<Pago/>} />
        <Route path="/Ejercicios" element={<Ejercicios/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/Gestion" element={<Gestion/>} />
        <Route path="/Nivel" element={<Nivel/>} />
        <Route path="/Selec/:subjectName" element={<Selec/>} />
        <Route path="/CursosLog" element={<CursosLog/>} />
        <Route path="/SelecLog" element={<SelecLog/>} />
        <Route path="/Exercises" element={<Exercises/>} />
        <Route path="/Grados" element={<Grados/>} />
        <Route path="/Historial" element={<Historial/>} />
        <Route path="/HomeGratuito" element={<HomeGratuito/>} />
        <Route path="/SelecNivel" element={<SelecNivel />} />
        <Route path="/LoginGratuito" element={<LoginGratuito />} />
        <Route path="/EjerciciosGratuitos" element={<EjerciciosGratuitos />} />
        <Route path="/asignaturas" element={<Asignaturas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/SopaLetrasCiencias" element={<SopaLetrasCiencias />} />
        <Route path="/CrucigramaNubesCiencias" element={<CrucigramaNubesCiencias />} />
        <Route path="/EjerciciosPreguntas" element={<EjerciciosPreguntas />} />
        <Route path="/google" element={<GoogleLogin />} />
        <Route path="/MemoramaCiencias" element={<MemoramaCiencias />} />
        <Route path="/Asignaturasp" element={<Asignaturasp />} />
        <Route path="/Pagos" element={<Pagos />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/TriviasValores" element={<TriviasValores />} />
        <Route path="/QuizQuimico" element={<QuizQuimico />} />
        <Route path="/CrucigramaBiologico" element={<CrucigramaBiologico />} />
        <Route path="/LineaTiempo" element={<LineaTiempo />} />
       
 
        <Route path="/Categorias" element={<Categorias />} />
        <Route path="/Actividades/:asignaturaId" element={<Actividades />} />
        <Route path="/actividades/:actividadId/preguntas" element={<EjerciciosPreguntas />} />



      </Routes>
    </div>
  );
}

export default App
