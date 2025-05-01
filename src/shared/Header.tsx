import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, loginWIthGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const navlist = user ? [
    { label: 'Tarjetas', icon: 'pi pi-fw pi-credit-card' , command: ()=> navigate("/")},
    { label: 'Pagos recurrentes', icon: 'pi pi-fw pi-sync', command: ()=> navigate(`/pagosRecurrentes/${user.uid}`) },
    { label: 'Efectivo', icon: 'pi pi-fw pi-money-bill', command: ()=> navigate(`/efectivo/${user.uid}`) },
    { label: 'Perfil', icon: 'pi pi-fw pi-user', command: ()=> navigate(`/profile/${user.uid}`)}
  ] : []

  return (
    user ? 
      <Menubar model={navlist} end={
          <div className='flex'>
            <div className='flex flex-row items-center gap-2 mr-3'>
              {user.photoURL ? <Avatar shape="circle" image={user.photoURL}/> : <Avatar shape="circle" icon="pi pi-user"/>}
              <span>{user.displayName}</span>
            </div>
            <Button label='Logout' icon="pi pi-sign-out" size='small' text onClick={logout}/>
          </div>
      }/>
    :
      <Menubar start={"FINANCE"} end={<Button label='Login' icon="pi pi-sign-out" size='small' text onClick={loginWIthGoogle}/>
    }/>
  )
}
