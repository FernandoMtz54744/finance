import Periodos from '../pages/tarjetas/Periodos';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PeriodosContainer() {
    const { idTarjeta } = useParams();
    const context = useAuth();
    
  return (
        <Periodos periodos={context.periodos} idTarjeta={idTarjeta} user={context.user}/>
  )
}
