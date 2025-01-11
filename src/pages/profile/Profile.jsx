import React from 'react'
import { currencyFormat } from '../../utils/utils'
import { DateTime } from 'luxon';

export default function Profile({accounts, periodos, efectivo}) {

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


    const sumaEfectivo = (cincuenta, cien, doscientos, quinientos)=>{
        return (cincuenta*50)+(cien*100)+(doscientos*200) + (quinientos*500);
    }

    const obtieneTotal = (accounts, efectivo)=>{
        let total = 0;
        accounts.map((account) =>{
            if(account.tipo === "Débito"){
                total+= Number(obtenerSaldoUltimoPeriodo(periodos, account.id));
            }else{
                total+= Number(obtenerSaldoTotal(periodos, account.id));
            }
        })
        total+= Number(sumaEfectivo(efectivo.cincuenta,efectivo.cien,efectivo.doscientos,efectivo.quinientos));
        return total;
    }

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
    </div>
  )
}
