import React from 'react'
import "../../styles/periodo.css"
import { Link } from 'react-router-dom'

export default function Periodos({periodos, idTarjeta, user}) {
  return (
    <div className='periodos-container'>
        {periodos.filter(periodo => periodo.idTarjeta === idTarjeta).map((periodo,i) =>{
            return(
                <Link className='periodo-card' to={`/movimientos/${periodo.idPeriodo}`} key={i}>
                    <div className='alias'>{periodo.alias}</div>
                    <div className='fecha'>Fecha de inicio: {periodo.fechaInicio}</div>
                    <div className='fecha'>Fecha de corte: {periodo.fechaCorte}</div>
                </Link>
            )
        })}
        <Link className='agregar-button' to={`agregar`}>+</Link>
    </div>
  )
}
