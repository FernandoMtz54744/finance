import { useLocation } from 'react-router-dom';
import Periodos from '../../../pages/tarjetas/periodos/Periodos';
import { useAuth } from '../../../context/AuthContext';

export default function PeriodosContainer() {
    const context = useAuth();
    const { tarjeta } = useLocation().state;
    
  return (
        <Periodos periodos={context.periodos} idTarjeta={tarjeta.id} tarjeta={tarjeta}/>
  )
}
