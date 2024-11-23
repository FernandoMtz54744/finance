import React from 'react'
import "../../styles/periodo.css"
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat } from '../../utils/utils'

export default function Periodos({periodos, idTarjeta, tarjeta}) {
  
  const isPeriodoActual = (fechaInicio, fechaCorte)=>{
    const today = Date.now();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaCorteDate = new Date(fechaCorte);
    return today >= fechaInicioDate && today <= fechaCorteDate;
  }

  const isFechaLimitePorVencer = (fechaLimitePago)=>{
    const today = Date.now();
    const fechaLimite = new Date(fechaLimitePago).getTime();
    const diferencia = Math.floor((fechaLimite - today) / (1000 * 60 * 60 * 24));
    return today < fechaLimite && diferencia <= 20;
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
                  {isFechaLimitePorVencer(periodo.fechaLimitePago) && (
                    <div className={`pago-pendiente ${periodo.totalPeriodo<0?"red":"green"}`}>Pagar {currencyFormat(periodo.totalPeriodo)}</div>
                  )}
                  <div className='periodo-data'>
                    <div className='alias'>{periodo.alias}</div>
                    <div className='fecha'>Inicio: {convertDate(periodo.fechaInicio)}</div>
                    <div className='fecha'>Corte: {convertDate(periodo.fechaCorte)}</div>
                    {periodo.fechaLimitePago && (
                    <div className={`fecha ${isFechaLimitePorVencer(periodo.fechaLimitePago)?"red":""}`}>Límite de pago: {convertDate(periodo.fechaLimitePago)}</div>
                    )}
                  </div>
                    
                </Link>
            )
        })}
        <Link className='agregar-button' to={`agregar`} state={{tarjeta: tarjeta}}>+</Link>
    </div>
  )
}
