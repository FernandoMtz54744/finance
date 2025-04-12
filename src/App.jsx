import './styles/App.css';
import "primereact/resources/themes/arya-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import HeaderContainer from './containers/HeaderContainer';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import HomeContainer from './containers/HomeContainer';
import { Toaster } from 'react-hot-toast';
import PagosConcurrentesContainer from './containers/PagosConcurrentes/PagosConcurrentesContainer';
import AgregarPagoContainer from './containers/PagosConcurrentes/AgregarPagoContainer';
import EfectivoContainer from './containers/efectivo/EfectivoContainer';
import BuscarContainer from './containers/buscar/BuscarContainer';
import ProfileContainer from './containers/profile/ProfileContainer';
import { PrimeReactProvider } from 'primereact/api';
import { addLocale} from 'primereact/api';
import PeriodosContainer from './containers/tarjetas/periodos/PeriodosContainer';
import AgregarPeriodoContainer from './containers/tarjetas/periodos/AgregarPeriodoContainer';
import EditarPeriodoContainer from './containers/tarjetas/periodos/EditarPeriodoContainer';
import MovimientosContainer from './containers/tarjetas/movimientos/MovimientosContainer';
import Tarjetas from './pages/tarjetas/Tarjetas';
import AgregarTarjetaContainer from './containers/tarjetas/AgregarTarjetaContainer';
import EditarTarjetaContainer from './containers/tarjetas/EditarTarjetaContainer';
import LoadingComponent from './shared/LoadingComponent';
import { LoadingProvider } from './context/LoadingContext';

/* AGREGA LOCALE DE PRIMEREACT*/
addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar'
});  

function App() {
  return (
    <AuthProvider>
    <PrimeReactProvider>
    <LoadingProvider>
      <LoadingComponent />
      <Toaster/>
      <BrowserRouter>
        <HeaderContainer/>
        <Routes>
          <Route path="/" element={<HomeContainer/>}/>
          <Route path="/Home" element={<Tarjetas/>}/>
          <Route path="/periodos" element={<PeriodosContainer/>}/>
          <Route path="/movimientos" element={<MovimientosContainer/>}/>
          <Route path="/agregarTarjeta" element={<AgregarTarjetaContainer/>}/>
          <Route path="/periodos/agregar" element={<AgregarPeriodoContainer/>}/>
          <Route path="/editarTarjeta" element={<EditarTarjetaContainer/>}/>
          <Route path="/editarPeriodo" element={<EditarPeriodoContainer/>}/>
          <Route path="/pagosRecurrentes/:idUsuario" element={<PagosConcurrentesContainer/>}/>
          <Route path="/efectivo/:idUsuario" element={<EfectivoContainer/>}/>
          <Route path="/agregarPago" element={<AgregarPagoContainer/>}/>
          <Route path="/buscar/:idUsuario" element={<BuscarContainer/>}/>
          <Route path="/profile/:idUsuario" element={<ProfileContainer/>}/>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
    </PrimeReactProvider>
    </AuthProvider>
  );
}

export default App;
