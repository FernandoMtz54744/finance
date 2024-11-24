import React from 'react'
import "../../styles/periodo.css"
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat } from '../../utils/utils'
import { DateTime } from 'luxon'

export default function Periodos({periodos, idTarjeta, tarjeta}) {
  
  const isPeriodoActual = (fechaInicio, fechaCorte)=>{
    //La fecha de hoy está entre la fecha de inicio y la fecha de corte
    const today = DateTime.local();
    const fechaInicioDate = DateTime.fromISO(fechaInicio);
    const fechaCorteDate = DateTime.fromISO(fechaCorte);
    return today >= fechaInicioDate && today <= fechaCorteDate;
  }

  const isBetweenCorteLimit = (fechaLimitePago, fechaDeCorte)=>{
    const today = DateTime.local();
    const fechaLimite = DateTime.fromISO(fechaLimitePago);
    const fechaCorte = DateTime.fromISO(fechaDeCorte);
    return today >= fechaCorte && today <= fechaLimite;
  }

  return (
    <div className='periodos-container'>
      <center className='tarjeta-name'>{tarjeta.alias}&nbsp;{tarjeta.tipo}</center>
        {periodos.filter(periodo => periodo.idTarjeta === idTarjeta).sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte))).map((periodo,i) =>{
            return(
                <Link className="periodo-card" 
                to={`/movimientos/${periodo.idPeriodo}?`} key={i}
                state={{periodo: periodo}} >
                  {isPeriodoActual(periodo.fechaInicio, periodo.fechaCorte) && (
                    <div className='periodo-actual green'>Periodo Actual</div>
                  )}
                  {isBetweenCorteLimit(periodo.fechaLimitePago, periodo.fechaCorte) && (
                    <div className={`pago-pendiente ${periodo.totalPeriodo<0?"red":"green"}`}>Pagar {currencyFormat(periodo.totalPeriodo)}</div>
                  )}
                  <div className='periodo-data'>
                    <div className='alias'>{periodo.alias}</div>
                    <div className='fecha'>Inicio: {convertDate(periodo.fechaInicio)}</div>
                    <div className='fecha'>Corte: {convertDate(periodo.fechaCorte)}</div>
                    {periodo.fechaLimitePago && (
                    <div className={`fecha ${isBetweenCorteLimit(periodo.fechaLimitePago, periodo.fechaCorte)?"red":""}`}>Límite de pago: {convertDate(periodo.fechaLimitePago)}</div>
                    )}
                  </div>
                    
                </Link>
            )
        })}
        <Link className='agregar-button' to={`agregar`} state={{tarjeta: tarjeta}}>+</Link>
    </div>
  )
}
