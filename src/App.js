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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HeaderContainer/>
        <Routes>
          <Route path="/" element={<HomeContainer/>}/>
          <Route path="/Home" element={<AccountsContainer/>}/>
          <Route path="/periodos/:idTarjeta" element={<PeriodosContainer/>}/>
          <Route path="/movimientos/:idPeriodo" element={<MovimientosContainer/>}/>
          <Route path="/agregarTarjeta" element={<AgregarTarjetaContainer/>}/>
          <Route path="/periodos/:idTarjeta/agregar" element={<AgregarPeriodoContainer/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
