import { DateTime } from 'luxon'
import { useState } from 'react'
import { currencyFormat } from '../../utils/utils';
import { Efectivo } from '@/interfaces/Efectivo';

interface props {
    efectivos: Efectivo[],
    sumaEfectivo: (efectivo: Efectivo) => number
}

export default function MuestraEfectivo({efectivos, sumaEfectivo}: props) {

    const [visible, setVisible] = useState<{[key: string]: boolean }>({});

  return (
    <div className='w-full px-8'>
        {efectivos.sort((a, b) => b.fecha!.getTime() - a.fecha!.getTime()).map((efectivo, i) => {
            return(
                <div key={i}>
                    <div className='bg-teal-950 w-full py-2 px-6 my-6 rounded-md hover:cursor-pointer'
                        onClick={()=>setVisible({...visible, [efectivo.fecha!.toString()]: !visible[efectivo.fecha!.toString()]})}>
                        {DateTime.fromJSDate(efectivo.fecha!).setLocale("es").toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' })} 
                        &nbsp;-&nbsp;{currencyFormat(sumaEfectivo(efectivo))}
                    </div>
                    {
                    visible[efectivo.fecha!.toString()] && 
                        <div className='flex flex-row justify-center items-center'>
                            <table>
                                <thead className='bg-teal-950 text-center'>
                                    <tr>
                                        <td className='py-1 rounded-l-md px-8'>Billetes</td>
                                        <td className='px-8'>Cantidad</td>
                                        <td className='rounded-r-md px-8'>Total</td>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    <tr>
                                        <td className='py-1'>$50</td>
                                        <td>{efectivo.cincuenta}</td>
                                        <td className='text-left'>{currencyFormat(efectivo.cincuenta * 50)}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-1'>$100</td>
                                        <td>{efectivo.cien}</td>
                                        <td className='text-left'>{currencyFormat(efectivo.cien * 100)}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-1'>$200</td>
                                        <td>{efectivo.doscientos}</td>
                                        <td className='text-left'>{currencyFormat(efectivo.doscientos * 200)}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-1'>$500</td>
                                        <td>{efectivo.quinientos}</td>
                                        <td className='text-left'>{currencyFormat(efectivo.quinientos * 500)}</td>
                                    </tr>
                                    <tr  className='bg-teal-950'>
                                        <td colSpan={2} className='py-1 rounded-l-md'>Total Efectivo</td>
                                        <td className='text-left rounded-r-md'>{currencyFormat(sumaEfectivo(efectivo))}</td>
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
