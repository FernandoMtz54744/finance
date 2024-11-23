import React from 'react'
import "../../styles/periodo.css"
import { Link } from 'react-router-dom'
import { convertDate } from '../../utils/utils'

export default function Periodos({periodos, idTarjeta, user}) {
  return (
    <div className='periodos-container'>
        {periodos.filter(periodo => periodo.idTarjeta === idTarjeta).sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte))).map((periodo,i) =>{
            return(
                <Link className='periodo-card' to={`/movimientos/${periodo.idPeriodo}?`} key={i}
                state={{periodo: periodo}} >
                    <div className='alias'>{periodo.alias}</div>
                    <div className='fecha'>Fecha de inicio: {convertDate(periodo.fechaInicio)}</div>
                    <div className='fecha'>Fecha de corte: {convertDate(periodo.fechaCorte)}</div>
                </Link>
            )
        })}
        <Link className='agregar-button' to={`agregar`}>+</Link>
    </div>
  )
}
