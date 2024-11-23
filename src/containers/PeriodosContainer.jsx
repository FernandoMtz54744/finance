import Periodos from '../pages/tarjetas/Periodos';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PeriodosContainer() {
    const context = useAuth();
    const { tarjeta } = useLocation().state;
    
  return (
        <Periodos periodos={context.periodos} idTarjeta={tarjeta.id} tarjeta={tarjeta}/>
  )
}
