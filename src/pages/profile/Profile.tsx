import { useState } from 'react'
import { DateTime } from 'luxon';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { Periodo } from '@/interfaces/Periodo';
import { Efectivo } from '@/interfaces/Efectivo';
import { TotalHistorial } from '@/interfaces/TotalHistorial';
import * as Utils from '@/utils/utils'
import { Button } from 'primereact/button';

interface props {
    tarjetas: Tarjeta[],
    periodos: Periodo[],
    efectivo: Efectivo,
    totalHistorial: TotalHistorial[],
    obtieneTotal: (tarjetas: Tarjeta[], efectivo: Efectivo) => number,
    guardarHistorial: () => void,
}

export default function Profile({tarjetas, periodos, efectivo, totalHistorial, obtieneTotal, guardarHistorial }: props) {

    const [visible, setVisible] = useState({});

    return (
        <div className='flex flex-col justify-center items-center px-4 md:px-0 mb-16'>
            <center className='text-2xl my-6'>PERFIL</center>
            <div className='w-full px-16'>
            {tarjetas.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tarjeta, i) => (
                <div key={i} className='flex flex-row justify-between bg-teal-950 rounded-md my-6 p-4'>
                    <div>{tarjeta.nombre} {tarjeta.tipo}</div>
                    <div className={tarjeta.tipo === "Débito"?"green":"red"}>{tarjeta.tipo === "Débito"?
                        Utils.currencyFormat(Utils.obtenerSaldoUltimoPeriodo(periodos, tarjeta.id)):
                        Utils.currencyFormat(Utils.obtenerSaldoTotal(periodos, tarjeta.id))}
                    </div>
                </div>
            ))}
            {Utils.sumaEfectivo(efectivo) > 0 && (
                <div className='flex flex-row justify-between bg-teal-950 rounded-md my-6 p-4'>
                    <div>Efectivo {DateTime.fromJSDate(efectivo.fecha).setLocale("es").toFormat('dd/LLL/yyyy')} </div>
                    <div className='green'>{Utils.currencyFormat(Utils.sumaEfectivo(efectivo))}</div>
                </div>
            )}
            </div>
            <div className='flex flex-row justify-between bg-teal-950 rounded-md my-6 p-4 w-1/2'>
                <div>Total</div>
                <div className='green'>{Utils.currencyFormat(obtieneTotal(tarjetas, efectivo))}</div>
            </div>

            {/* HISTORIAL */}
            <center className='text-2xl my-6'>HISTORIAL</center>
            <div className='w-full px-16 flex flex-row justify-center items-center'>
                {totalHistorial.sort((a, b)=> b.fecha.getTime() - a.fecha.getTime()).map((total, i) => (
                <div key={i} className='w-1/2'>

                    <div className='bg-teal-950 rounded-md flex flex-row justify-between p-4' onClick={()=>setVisible({...visible, [total.fecha]: !visible[total.fecha]})}>
                        <div>{DateTime.fromJSDate(total.fecha).setLocale("es").toFormat('dd/LLL/yyyy')}</div>
                        <div className='flex flex-row'>Total:&nbsp;<div className='green'>{Utils.currencyFormat(total.total)}</div></div>
                    </div>

                    {visible[total.fecha] && 
                    <div className='flex flex-col items-center'>

                        {total.tarjetas.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tarjeta, i) =>(
                        <div className='flex flex-row justify-between my-2 px-4 w-1/2' key={i}>
                                <div>{tarjeta.nombre}</div>
                                <div className={tarjeta.total >= 0? "green": "red"}>{Utils.currencyFormat(tarjeta.total)}</div>    
                        </div>
                        ))}

                        <div className='flex flex-row justify-between my-2 px-4 w-1/2'>
                            <div>Efectivo</div>
                            <div className='green'>{Utils.currencyFormat(total.efectivo)}</div>    
                        </div>

                    </div>}

                </div>
                ))}
            </div>

        <div className='fixed bottom-8 right-8'>
            <Button icon="pi pi-camera" outlined onClick={guardarHistorial}/>
        </div>
    </div>
  )
}
