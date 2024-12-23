import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Menu() {
    const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div>
        <div onClick={()=>setToggleMenu(!toggleMenu)} className='menu-header'>Menú</div>
        {toggleMenu && (
        <>
            <div className='sidebar'>
                <center>Menú</center>
                <Link className='menu-link' to="/" onClick={()=>setToggleMenu(false)}>Tarjetas</Link>
                <br />
                <Link className='menu-link' to="/pagosConcurrentes" onClick={()=>setToggleMenu(false)}>Pagos concurrentes</Link>
            </div>
            <div className='menu-overlay' onClick={()=>setToggleMenu(!toggleMenu)}></div>
        </>
        )}
    </div>
  )
}
