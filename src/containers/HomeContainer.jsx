import { useAuth } from '../context/AuthContext';
import Home from '../pages/login/Home';
import Tarjetas from '../pages/tarjetas/Tarjetas';


export default function HomeContainer() {
    const context = useAuth();

  return (
    <>
    {context.user?
      <Tarjetas/>
    :
      <Home/>
    }
    </>
  )
}
