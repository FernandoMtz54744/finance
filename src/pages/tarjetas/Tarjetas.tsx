import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';
import { useAuth } from '@/context/AuthContext';
import { Tarjeta } from '@/interfaces/Tarjeta';
import * as Utils from "@/utils/utils"
import { Button } from 'primereact/button';

export default function Tarjetas() {

  const { tarjetas, periodos } = useAuth();
  const navigate = useNavigate();
  const cm = useRef<ContextMenu | null>(null);
  const [contextItems, setContextItems] = useState<MenuItem[]>([]);

  const handleContextMenu = (e: React.MouseEvent, tarjeta: Tarjeta)=>{
    setContextItems([
      { label:"Editar tarjeta", icon: 'pi pi-pen-to-square', command: ()=> navigate("/editarTarjeta", {state: {tarjeta}})}
    ]);
    cm.current?.show(e);
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='account-title text-3xl my-6'>TARJETAS</div>
      <div className='grid grid-cols-1 gap-8 p-4 md:grid-cols-4 mb-16'>
          {tarjetas.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((tarjeta, i) => (
            <Link className={`rounded-md p-4 font-medium w-2xs flex flex-col gap-y-3`} 
              to={"/periodos"} key={i} state={{tarjeta: tarjeta}}
              style={{background: `linear-gradient(#${tarjeta.color}, #020024)`}}
              onContextMenu={(e) => handleContextMenu(e, tarjeta)}>

              <div className='flex flex-row justify-between'>
                <div>Tarjeta de {tarjeta.tipo}</div>
                <div>{tarjeta.nombre}</div>
              </div>
              <div className='flex flex-row justify-between'>
                <div>
                  <div className='text-xs'>Fecha de corte</div>
                  <div>{Utils.convertDate(Utils.getNextFechaByDay(tarjeta.diaCorte))}</div>
                </div>
                {tarjeta.tipo === "Crédito" && (
                <div>
                  <div className='text-xs'>F. Límite de pago</div>
                  <div>{Utils.convertDate(Utils.getFechaLimitePago(Utils.getLastFechaByDay(tarjeta.diaCorte)))}</div>
                </div>
                )}
              </div>

              <div className='flex flex-col items-end'>
                <div className='text-xs'>Saldo final</div>
                <div>{tarjeta.tipo === "Débito"?
                  Utils.currencyFormat(Utils.obtenerSaldoUltimoPeriodo(periodos, tarjeta.id)):
                  Utils.currencyFormat(Utils.obtenerSaldoTotal(periodos, tarjeta.id))
                  }</div>
              </div>
            </Link>
          ))}
      </div>

      <ContextMenu model={contextItems} ref={cm}/>
      <div className='fixed bottom-8 right-8'>
        <Button icon="pi pi-plus" outlined onClick={()=> navigate("/agregarTarjeta")}/>
      </div>
    </div>
  )
}
