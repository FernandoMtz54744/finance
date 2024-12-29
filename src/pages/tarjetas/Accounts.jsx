import React, { useState } from 'react'
import "../../styles/accounts.css"
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat, getFechaLimitePago, getLastFechaByDay, getNextFechaByDay } from '../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit} from "@fortawesome/free-solid-svg-icons"

export default function Accounts({accounts, periodos}) {

  const [edit, setEdit] = useState(false);
  
  const obtenerSaldoUltimoPeriodo = (periodos, idTarjeta)=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    if(periodosTarjeta.length === 0){
      return 0;
    }else{
      return periodosTarjeta.sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte)))[0].saldoFinal;
    }
  }

  const obtenerSaldoTotal = (periodos, idTarjeta)=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    const saldoTotal = periodosTarjeta.reduce((total, periodo)=>{
      return total + periodo.saldoFinal;
    }, 0)
    return saldoTotal;
  }

  return (
    <div>
      <center className='account-title'>{edit?"Seleccione la tarjeta para editar": "Tus Tarjetas"}</center>
      <div className='accounts-container'>
          {accounts.sort((a, b) => a.alias.localeCompare(b.alias)).map((account, i) => (
            <Link className='account-card' to={edit?"/editarTarjeta":"/periodos"} key={i} state={{tarjeta: account}}
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
                  <div>{convertDate(getFechaLimitePago(getLastFechaByDay(account.fechaCorte)))}</div>
                </div>
                )}
                
              </div>
              <div className='saldo'>
                <div className='dato-title'>Saldo final</div>
                <div>{account.tipo === "Débito"?
                  currencyFormat(obtenerSaldoUltimoPeriodo(periodos, account.id)):
                  currencyFormat(obtenerSaldoTotal(periodos, account.id))
                  }</div>
              </div>
              
            </Link>
          ))}
      </div>
      <Link className='agregar-button' to="/agregarTarjeta">+</Link>
      <FontAwesomeIcon icon={faEdit}  className='edit-button' onClick={()=>setEdit(!edit)}/>
    </div>
  )
}
