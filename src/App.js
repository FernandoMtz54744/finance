import './styles/App.css';
import AccountsContainer from './containers/AccountsContainer';
import HeaderContainer from './containers/HeaderContainer';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PeriodosContainer from './containers/PeriodosContainer';
import MovimientosContainer from './containers/MovimientosContainer';
import { AuthProvider } from './context/AuthContext';
import HomeContainer from './containers/HomeContainer';
import AgregarTarjetaContainer from './containers/AgregarTarjetaContainer';
import AgregarPeriodoContainer from './containers/AgregarPeriodoContainer';
import { Toaster } from 'react-hot-toast';
import EditarTarjetaContainer from './containers/EditarTarjetaContainer';
import EditarPeriodoContainer from './containers/EditarPeriodoContainer';
import PagosConcurrentesContainer from './containers/PagosConcurrentes/PagosConcurrentesContainer';
import AgregarPagoContainer from './containers/PagosConcurrentes/AgregarPagoContainer';

function App() {
  return (
    <AuthProvider>
      <Toaster/>
      <BrowserRouter>
        <HeaderContainer/>
        <Routes>
          <Route path="/" element={<HomeContainer/>}/>
          <Route path="/Home" element={<AccountsContainer/>}/>
          <Route path="/periodos" element={<PeriodosContainer/>}/>
          <Route path="/movimientos/:idPeriodo" element={<MovimientosContainer/>}/>
          <Route path="/agregarTarjeta" element={<AgregarTarjetaContainer/>}/>
          <Route path="/periodos/agregar" element={<AgregarPeriodoContainer/>}/>
          <Route path="/editarTarjeta" element={<EditarTarjetaContainer/>}/>
          <Route path="/editarPeriodo" element={<EditarPeriodoContainer/>}/>
          <Route path="/pagosRecurrentes/:idUsuario" element={<PagosConcurrentesContainer/>}/>
          <Route path="/agregarPago" element={<AgregarPagoContainer/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
