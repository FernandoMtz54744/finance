import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { currencyFormat } from '../../utils/utils';

export default function MuestraEfectivo({efectivos, sumaEfectivo}) {

    const [visible, setVisible] = useState({});

  return (
    <div className='muestra-efectivo-container'>
        {efectivos.sort((a, b) => b.fecha - a.fecha).map(efectivo => {
            return(
                <div className='efectivo-container'>
                    <div onClick={()=>setVisible({...visible, [efectivo.fecha]: !visible[efectivo.fecha]})} className='efectivo-row'>
                        {DateTime.fromMillis(efectivo.fecha).setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' })} 
                        &nbsp;-&nbsp;{currencyFormat(sumaEfectivo(efectivo.cincuenta,efectivo.cien,efectivo.doscientos,efectivo.quinientos))}
                    </div>
                    {
                    visible[efectivo.fecha] && 
                        <div className='table-efectivo-container'>
                            <table className='table-efectivo muestra-phone'>
                                <thead>
                                    <tr><td>Billetes</td><td>Cantidad</td><td>Total</td></tr>
                                </thead>
                                <tbody>
                                    <tr><td>$50</td><td>{efectivo.cincuenta}</td><td>{currencyFormat(efectivo.cincuenta * 50)}</td></tr>
                                    <tr><td>$100</td><td>{efectivo.cien}</td><td>{currencyFormat(efectivo.cien * 100)}</td></tr>
                                    <tr><td>$200</td><td>{efectivo.doscientos}</td><td>{currencyFormat(efectivo.doscientos * 200)}</td></tr>
                                    <tr><td>$500</td><td>{efectivo.quinientos}</td><td>{currencyFormat(efectivo.quinientos * 500)}</td></tr>
                                    <tr className='muestra-total-efectivo'>
                                        <td colSpan={2}>Total Efectivo</td>
                                        <td>{currencyFormat(sumaEfectivo(efectivo.cincuenta,efectivo.cien,efectivo.doscientos,efectivo.quinientos))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            )
        })}
    </div>
  )
}
