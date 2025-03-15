import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

export default function Header({usuario, loginGoogle, logout}) {
  const navigate = useNavigate();

  const navlist = [
    { label: 'Tarjetas', icon: 'pi pi-fw pi-credit-card' , command: ()=> navigate("/")},
    { label: 'Pagos recurrentes', icon: 'pi pi-fw pi-sync', command: ()=> navigate(`/pagosRecurrentes/${usuario.uid}`) },
    { label: 'Efectivo', icon: 'pi pi-fw pi-money-bill', command: ()=> navigate(`/efectivo/${usuario.uid}`) },
    { label: 'Buscar', icon: 'pi pi-fw pi-search', command: ()=> navigate(`/buscar/${usuario.uid}`)},
    { label: 'Perfil', icon: 'pi pi-fw pi-user', command: ()=> navigate(`/profile/${usuario.uid}`)}
  ];

  return (
    <Menubar model={navlist} end={
      usuario ? 
        <div className='flex'>
          <div className='flex flex-row justify-content-center align-items-center gap-2 mr-3'>
            <Avatar shape="circle" image={usuario.photoURL}/>
            <span>{usuario.displayName}</span>
          </div>
          <Button label='Logout' icon="pi pi-sign-out" size='small' text onClick={logout}/>
        </div>
      :
        <Button label='Login' icon="pi pi-sign-out" size='small' text onClick={loginGoogle}/>
    }/>
  )
}
