import React, { useState } from 'react'
import { currencyFormat } from '../../utils/utils'
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCamera} from "@fortawesome/free-solid-svg-icons"

export default function Profile({accounts, periodos, efectivo, totalHistorial, 
    obtenerSaldoUltimoPeriodo, obtenerSaldoTotal, sumaEfectivo, obtieneTotal, tomarSnapshotTotal}) {

    const [visible, setVisible] = useState({});

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
            <div key={i} className='data-history-container'>
                <div className='historial-data'  onClick={()=>setVisible({...visible, [total.fecha]: !visible[total.fecha]})}>
                    <div>{DateTime.fromMillis(total.fecha).setLocale("es").toFormat('dd/LLL/yyyy')}</div>
                    <div className='row'>Total:&nbsp;<div className='green'>{currencyFormat(total.total)}</div></div>
                </div>
                {visible[total.fecha] && <div className='history-data-despliegue-container'>
                    {
                        total.accounts.sort((a, b) => a.alias.localeCompare(b.alias)).map((account, i) =>(
                            <div className='history-account-container' key={i}>
                                <div>{account.alias}</div>
                                <div className={account.total >= 0? "green": "red"}>{currencyFormat(account.total)}</div>    
                            </div>
                        ))
                    }
                    <div className='history-account-container' k>
                        <div>Efectivo</div>
                        <div className='green'>{currencyFormat(total.efectivo)}</div>    
                    </div>
                </div>
                }
            </div>
            ))}
        </div>

        <FontAwesomeIcon icon={faCamera} className='doc-button snapshot-button' onClick={tomarSnapshotTotal}/>
    </div>
  )
}
