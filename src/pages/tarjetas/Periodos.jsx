import React from 'react'
import "../../styles/periodo.css"
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat } from '../../utils/utils'
import { isWithinInterval, parseISO } from 'date-fns'

export default function Periodos({periodos, idTarjeta, tarjeta}) {
  
  const isPeriodoActual = (fechaInicio, fechaCorte)=>{
    const today = Date.now();
    const fechaInicioDate = parseISO(fechaInicio);
    const fechaCorteDate = parseISO(fechaCorte);
    return isWithinInterval(today, {start: fechaInicioDate, end: fechaCorteDate});
  }

  const isBetweenCorteLimit = (fechaLimitePago, fechaDeCorte)=>{
    const today = new Date();
    const fechaLimite = parseISO(fechaLimitePago);
    const fechaCorte = parseISO(fechaDeCorte);
    return isWithinInterval(today, {start: fechaCorte, end: fechaLimite});
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
