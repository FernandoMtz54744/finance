import React from 'react'
import { currencyFormat } from '../../utils/utils'
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCamera} from "@fortawesome/free-solid-svg-icons"

export default function Profile({accounts, periodos, efectivo, totalHistorial, 
    obtenerSaldoUltimoPeriodo, obtenerSaldoTotal, sumaEfectivo, obtieneTotal, tomarSnapshotTotal}) {

  return (
    <div>
        <center className='title'>Perfil</center>
        <div >
              {accounts.sort((a, b) => a.alias.localeCompare(b.alias)).map((account, i) => (
                <div key={i} className='profile-account-data'>
                    <div>{account.alias} {account.tipo}</div>
                    <div className={account.tipo === "Débito"?"green":"red"}>{account.tipo === "Débito"?
                        currencyFormat(obtenerSaldoUltimoPeriodo(periodos, account.id)):
                        currencyFormat(obtenerSaldoTotal(periodos, account.id))
                        }</div>
                </div>
              ))}
              {(Object.keys(efectivo).length > 0) && (
                <div className='profile-account-data'>
                    <div>Efectivo {DateTime.fromMillis(efectivo.fecha).setLocale("es").toFormat('dd/LLL/yyyy')} </div>
                    <div className='green'>{currencyFormat(sumaEfectivo(efectivo.cincuenta,efectivo.cien,efectivo.doscientos,efectivo.quinientos))}</div>
                </div>
              )}
        </div>
        <div className='profile-total-container' >
            <div className='profile-total'>
                <div>Total</div>
                <div className='green'>{currencyFormat(obtieneTotal(accounts, efectivo))}</div>
            </div>
        </div>
        <br></br>
        <div className='total-historial-container'>
            <center className='title'>Historial de Totales</center>
            {totalHistorial.sort((a, b)=> b.fecha - a.fecha).map((total, i) => (
                <div className='historial-data' key={i}>
                    <div>Fecha:  {DateTime.fromMillis(total.fecha).setLocale("es").toFormat('dd/LLL/yyyy')}</div>
                    <div className='row'>Total:&nbsp;<div className='green'>{currencyFormat(total.total)}</div></div>
                </div>
            ))}
        </div>

        <FontAwesomeIcon icon={faCamera} className='doc-button snapshot-button' onClick={tomarSnapshotTotal}/>
    </div>
  )
}
