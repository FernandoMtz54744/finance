import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Utils from "@/utils/utils"
import { DateTime } from 'luxon'
import { Tarjeta } from '@/interfaces/Tarjeta'
import { Periodo } from '@/interfaces/Periodo'
import { ContextMenu } from 'primereact/contextmenu'
import { MenuItem } from 'primereact/menuitem'
import { Button } from 'primereact/button'
import TitleComponent from '@/shared/components/TitleComponent'

interface props {
  periodos: Periodo[],
  tarjeta: Tarjeta
}

export default function Periodos({periodos, tarjeta}: props) {

  const navigate = useNavigate();
  const cm = useRef<ContextMenu | null>(null);
  const [contextItems, setContextItems] = useState<MenuItem[]>([]);

  const handleContextMenu = (e: React.MouseEvent, periodo: Periodo)=>{
    setContextItems([
      { label:"Editar periodo", icon: 'pi pi-pen-to-square', command: ()=> navigate("/editarPeriodo",{state:{periodo: periodo, tarjeta: tarjeta}})}
    ]);
    cm.current?.show(e);
  }

  //La fecha de hoy está entre la fecha de inicio y la fecha de corte
  const isPeriodoActual = (fechaInicio: Date, fechaCorte: Date): boolean =>{
    const today = DateTime.local();
    const fechaInicioDate = DateTime.fromJSDate(fechaInicio);
    const fechaCorteDate = DateTime.fromJSDate(fechaCorte);
    return today >= fechaInicioDate && today <= fechaCorteDate;
  }

  //La fecha de hoy está entre la fecha de corte y la fecha límite de pago
  const isBetweenCorteLimit = (fechaLimitePago: Date, fechaDeCorte: Date)=>{
    const today = DateTime.local();
    const fechaLimite = DateTime.fromJSDate(fechaLimitePago);
    const fechaCorte = DateTime.fromJSDate(fechaDeCorte);
    return today >= fechaCorte && today <= fechaLimite;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <TitleComponent title={tarjeta.nombre+" "+tarjeta.tipo}/>
      <div className='flex flex-col items-center w-full mb-16'>
        {periodos.filter(periodo => periodo.idTarjeta === tarjeta.id).sort((a, b) => (b.fechaCorte.getTime() - a.fechaCorte.getTime())).map((periodo,i) => 
          
        <Link className="flex flex-col w-full m-4 md:px-12 px-4" 
            to={`/movimientos`} key={i} state={{periodo: periodo, tarjeta: tarjeta}}
            onContextMenu={(e) => handleContextMenu(e, periodo)}
        >

        {isPeriodoActual(periodo.fechaInicio, periodo.fechaCorte) && 
          <div className='bg-teal-950 rounded-t-lg w-3xs self-center md:self-end text-center md:mr-8 green'>Periodo Actual</div>
        }

        {tarjeta.tipo === "Crédito" && isBetweenCorteLimit(Utils.getFechaLimitePago(periodo.fechaCorte), periodo.fechaCorte) && 
          <div className={`bg-teal-950 rounded-t-lg w-3xs self-center md:self-end text-center md:mr-8 ${periodo.totalPeriodo<0?"red":"green"}`}>
            Pagar {Utils.currencyFormat(periodo.totalPeriodo)}
          </div>
        }

        <div className='flex flex-col md:flex-row md:items-center justify-between w-full py-4 px-4 md:px-12 rounded-md bg-teal-950 md:text-center'>
          <div className='md:w-1/5 md:text-left text-center'>{periodo.nombre}</div>
          <div className='md:w-1/5'>Inicio: {Utils.convertDate(periodo.fechaInicio)}</div>
          <div className='md:w-1/5'>Corte: {Utils.convertDate(periodo.fechaCorte)}</div>
          {(periodo.saldoFinal === 0 && periodo.pagado)?
            <div className='md:w-1/5 text-blue-500'>Liquidado: {Utils.currencyFormat(periodo.pagado)}</div>
          :
            <div className={`md:w-1/5 ${periodo.saldoFinal < 0 ? "red":"green"}`}>Saldo Final: {Utils.currencyFormat(periodo.saldoFinal)}</div>
          }

          {tarjeta.tipo === "Crédito" && Utils.getFechaLimitePago(periodo.fechaCorte) && 
            <div className={`fecha md:w-1/5 ${isBetweenCorteLimit(Utils.getFechaLimitePago(periodo.fechaCorte), periodo.fechaCorte)?"red":""}`}>
              Límite de pago: {Utils.convertDate(Utils.getFechaLimitePago(periodo.fechaCorte))}
            </div>
          }
        </div>
              
        </Link>
          
          )}
      </div>

      <ContextMenu model={contextItems} ref={cm}/>
      <div className='fixed bottom-8 right-8'>
        <Button icon="pi pi-plus" outlined onClick={()=> navigate("/periodos/agregar", {state:{ tarjeta: tarjeta}})}/>
      </div>

    </div>
  )
}
