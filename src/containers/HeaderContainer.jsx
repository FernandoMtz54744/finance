import Header from '@/shared/Header';
import { useAuth } from '../context/AuthContext';

export default function HeaderContainer() {
  const context = useAuth();

  return (
    <Header usuario={context.user} loginGoogle={context.loginWIthGoogle} logout={context.logout}/>
  )
}
