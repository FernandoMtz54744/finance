import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export default function Menu() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const context = useAuth(); 

  return (
    <div>
        <div onClick={()=>setToggleMenu(!toggleMenu)} className='menu-header'>Menú</div>
        {toggleMenu && (
        <>
            <div className='sidebar'>
                <center>Menú</center>
                <Link className='menu-link' to="/" onClick={()=>setToggleMenu(false)}>Tarjetas</Link>
                <br />
                <Link className='menu-link' to={`/pagosRecurrentes/${context.user.uid}`} onClick={()=>setToggleMenu(false)}>Pagos recurrentes</Link>
                <br />
                <Link className='menu-link' to={`/efectivo/${context.user.uid}`} onClick={()=>setToggleMenu(false)}>Efectivo</Link>
                <br />
                <Link className='menu-link' to={`/buscar/${context.user.uid}`} onClick={()=>setToggleMenu(false)}>Buscar Movimientos</Link>
                <br />
                <Link className='menu-link' to={`/profile/${context.user.uid}`} onClick={()=>setToggleMenu(false)}>Perfil</Link>
            </div>
            <div className='menu-overlay' onClick={()=>setToggleMenu(!toggleMenu)}></div>
        </>
        )}
    </div>
  )
}
