import './styles/App.css';
import "primereact/resources/themes/arya-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import HeaderContainer from './containers/HeaderContainer';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import HomeContainer from './containers/HomeContainer';
import { Toaster } from 'react-hot-toast';

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
import PagosRecurrentesContainer from './containers/PagosRecurrentes/PagosRecurrentesContainer';
import AgregarPagoContainer from './containers/PagosRecurrentes/AgregarPagoContainer';
import EditarPagoContainer from './containers/PagosRecurrentes/EditarPagoContainer';

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
          {/* Periodos */}
          <Route path="/periodos" element={<PeriodosContainer/>}/>
          <Route path="/periodos/agregar" element={<AgregarPeriodoContainer/>}/>
          <Route path="/editarPeriodo" element={<EditarPeriodoContainer/>}/>
          <Route path="/movimientos" element={<MovimientosContainer/>}/>
          {/* Tarjetas */}
          <Route path="/agregarTarjeta" element={<AgregarTarjetaContainer/>}/>
          <Route path="/editarTarjeta" element={<EditarTarjetaContainer/>}/>
          {/* Pagos Recurrentes */}
          <Route path="/pagosRecurrentes/:idUsuario" element={<PagosRecurrentesContainer/>}/>
          <Route path="/agregarPago" element={<AgregarPagoContainer/>}/>
          <Route path="/editarPago" element={<EditarPagoContainer/>}/>
          {/*  */}
          <Route path="/efectivo/:idUsuario" element={<EfectivoContainer/>}/>
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
