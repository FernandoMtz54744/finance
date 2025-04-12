import { useAuth } from '../context/AuthContext';
import Header from '../pages/layouts/Header';

export default function HeaderContainer() {
  const context = useAuth();

  return (
    <Header usuario={context.user} loginGoogle={context.loginWIthGoogle} logout={context.logout}/>
  )
}
