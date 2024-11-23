import React from 'react'
import "../../styles/accounts.css"
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat, getNextFechaByDay } from '../../utils/utils';

export default function Accounts({accounts, periodos}) {

  const obtenerSaldoUltimoPeriodo = (periodos, idTarjeta)=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta == idTarjeta);
    console.log(periodosTarjeta.length)
    if(periodosTarjeta.length === 0){
      return 0;
    }else{
      return periodosTarjeta.sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte)))[0].saldoFinal;
    }
  }

  return (
    <div>
      <div className='accounts-container'>
          {accounts.map((account, i) => (
            <Link className='account-card' to={`/periodos/${account.id}`} key={i}
            style={{background: `linear-gradient(${account.color}, #020024)`}}>
              <div className='tarjeta-title'>
                <div>Tarjeta de {account.tipo}</div>
                <div>{account.alias}</div>
              </div>
              <div className='fechas-container'>
                <div>
                  <div className='dato-title'>Fecha de corte</div>
                  <div>{convertDate(getNextFechaByDay(account.fechaCorte))}</div>
                </div>
                {account.fechaLimitePago && (
                <div className='fecha-limite-pago-container'>
                  <div className='dato-title'>F. Límite de pago</div>
                  <div>{convertDate(account.fechaLimitePago)}</div>
                </div>
                )}
                
              </div>
              <div className='saldo'>
                <div className='dato-title'>Saldo final</div>
                <div>{currencyFormat(obtenerSaldoUltimoPeriodo(periodos, account.id))}</div>
              </div>
              
            </Link>
          ))}
      </div>
      <Link className='agregar-button' to="/agregarTarjeta">+</Link>
    </div>
  )
}
