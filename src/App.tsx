import './styles/App.css';
import "primereact/resources/themes/arya-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';  
import { PrimeReactProvider } from 'primereact/api';
import { addLocale} from 'primereact/api';
import { LoadingProvider } from './context/LoadingContext';
import EfectivoContainer from './containers/efectivo/EfectivoContainer';
import ProfileContainer from './containers/profile/ProfileContainer';
import PeriodosContainer from './containers/tarjetas/periodos/PeriodosContainer';
import AgregarPeriodoContainer from './containers/tarjetas/periodos/AgregarPeriodoContainer';
import EditarPeriodoContainer from './containers/tarjetas/periodos/EditarPeriodoContainer';
import MovimientosContainer from './containers/tarjetas/movimientos/MovimientosContainer';
import AgregarTarjetaContainer from './containers/tarjetas/AgregarTarjetaContainer';
import EditarTarjetaContainer from './containers/tarjetas/EditarTarjetaContainer';
import LoadingComponent from './shared/LoadingComponent';
import PagosRecurrentesContainer from './containers/PagosRecurrentes/PagosRecurrentesContainer';
import AgregarPagoContainer from './containers/PagosRecurrentes/AgregarPagoContainer';
import EditarPagoContainer from './containers/PagosRecurrentes/EditarPagoContainer';
import Header from './shared/Header';
import Home from './pages/login/Home';
import PageNotFound from './shared/PageNotFound';
import TarjetaList from './pages/tarjetas/TarjetaList';

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
      <Header/>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/Home" element={<Home/>}/>

        {/* RUTAS PROTEGIDAS */}
        {/* <Route element={<ProtectedRoute/>}> */}
          <Route path="/" element={<TarjetaList/>}/>
          <Route path="/periodos" element={<PeriodosContainer/>}/>
          <Route path="/periodos/agregar" element={<AgregarPeriodoContainer/>}/>
          <Route path="/editarPeriodo" element={<EditarPeriodoContainer/>}/>
          <Route path="/movimientos" element={<MovimientosContainer/>}/>
          <Route path="/agregarTarjeta" element={<AgregarTarjetaContainer/>}/>
          <Route path="/editarTarjeta" element={<EditarTarjetaContainer/>}/>
          <Route path="/pagosRecurrentes/:idUsuario" element={<PagosRecurrentesContainer/>}/>
          <Route path="/agregarPago" element={<AgregarPagoContainer/>}/>
          <Route path="/editarPago" element={<EditarPagoContainer/>}/>
          <Route path="/efectivo/:idUsuario" element={<EfectivoContainer/>}/>
          <Route path="/profile/:idUsuario" element={<ProfileContainer/>}/>
        {/* </Route> */}

        {/* RUTA DEFAULT */}
        <Route path="*" element={<PageNotFound/>} />

      </Routes>
    </BrowserRouter>
    </LoadingProvider>
    </PrimeReactProvider>
    </AuthProvider>
  );
}

export default App;
