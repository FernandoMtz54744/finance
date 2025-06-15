import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Utils from '@/utils/utils';
import { DateTime } from 'luxon';
import { Pago } from '@/interfaces/Pago';
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { BitacoraPago } from '@/interfaces/BitacoraPago';
import { Calendar } from 'primereact/calendar';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';
import { Controller, useForm } from 'react-hook-form';
import { BitacoraPagoForm } from '@/interfaces/forms/BitacoraPagoForm';

interface props {
    pagos: Pago[],
    actualizaPago: (pago: Pago) => void
    visible: boolean,
    onSubmitBitacora: (e: BitacoraPagoForm)=>void
} 

export default function PagosRecurrentes({pagos, actualizaPago, visible, onSubmitBitacora }: props) {
    const navigate = useNavigate();
    const cm = useRef<ContextMenu | null>(null);
    const [contextItems, setContextItems] = useState<MenuItem[]>([]);

    const handleContextMenu = (e: React.MouseEvent, pago: Pago)=>{
        setContextItems([
          { label:"Editar pago", icon: 'pi pi-pen-to-square', command: ()=> navigate("/editarPago",{state:{pago: pago}})},
          { label:"Consultar bitácora", icon: 'pi pi-search', command: ()=> muestraBitacora(pago)}
        ]);
        cm.current?.show(e);
    }

    // Bitácora de pagos
    const [bitacoraVisible, setBitacoraVisible] = useState<boolean>(false);
    const [bitacoraPago, setBitacoraPago] = useState<BitacoraPago[]>([]);
    const { control, handleSubmit, formState: {errors} } = useForm<BitacoraPagoForm>({defaultValues:{
        comentario: "",
        fecha: DateTime.local().toJSDate()
      }})

    const muestraBitacora = async (pago: Pago)=>{
        setBitacoraVisible(true);
        const snapshot = await getDocs((query(collection(db, "BitacoraPagos"),where("idPago", "==", pago.id!))));
        setBitacoraPago(snapshot.docs.map(bitacora => {
            const data = bitacora.data();
            return {
                id: bitacora.id,
                idPago: data.idPago,
                comentario: data.comentario, 
                fecha: data.fecha.toDate(),
            } as BitacoraPago
        }).sort((a, b) => b.fecha.getTime() - a.fecha.getTime()));
    }
    
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-3xl mt-6'>PAGOS RECURRENTES</div>
            <div className='w-full px-16 mb-16'>
                {pagos.sort((a,b) => {
                    if (!a.isPagado && b.isPagado) { // Priorizar pagos no pagados
                        return -1; // a va antes que b
                    }else if (a.isPagado && !b.isPagado) {
                        return 1; //b va antes que a
                    }
                    //Ordena por fecha más cercana a hoy
                    const hoy = DateTime.now();
                    const diferenciaA = DateTime.fromJSDate(a.proximoPago).diff(hoy, 'days').days;
                    const diferenciaB = DateTime.fromJSDate(b.proximoPago).diff(hoy, 'days').days;
                    return diferenciaA - diferenciaB;
                }).map((pago, i) =>(
                    <div className='flex flex-col my-6' key={i} onContextMenu={(e) => handleContextMenu(e, pago)}>

                        <div className="bg-teal-950 rounded-t-lg w-3xs self-center md:self-end text-center md:mr-8">
                            {pago.diasLimitePago > 0 && !pago.isPagado? 
                                `Límite de pago: ${Utils.convertDate(Utils.getFechaLimitePagoByDays(pago.ultimoPago, pago.diasLimitePago))}`
                                :`Próximo Pago: ${Utils.convertDate(pago.proximoPago)}`}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full py-4 px-4 md:px-12 rounded-md bg-teal-950 md:text-center">
                            <div className='md:w-1/6 md:text-left text-center'>{pago.nombre}
                                {pago.auditar && <span className='red'>*</span>}
                            </div>
                            <div className='md:w-1/6 md:text-left text-center'>{Utils.convertDate(pago.ultimoPago)}</div>
                            <div className='md:w-1/6 text-center'>{Utils.currencyFormat(pago.cantidad)}</div>
                            <div className='md:w-1/6 text-center'>{pago.periodicidad}</div>
                            <div className="md:w-1/6 flex flex-row justify-center items-center">
                                <InputSwitch checked={pago.isPagado} onChange={()=> actualizaPago(pago)} />
                            </div>
                            <div className={`md:w-1/6 text-center ${pago.isPagado?"green":"red"}`}>{pago.isPagado?"PAGADO":"SIN PAGAR"}</div>
                        </div>
                    </div>
                ))}
            </div>
        <div className='fixed bottom-8 right-8'>
            <Button icon="pi pi-plus" outlined onClick={()=> navigate("/agregarPago")}/>
        </div>
        <ContextMenu model={contextItems} ref={cm}/>
        
        {/* Modal de formulario para bitácora */}
        <Dialog header="Bitácora" visible={visible} draggable={false} position="center" className="w-100 mx-4 md:w-1/2" onHide={()=>{}}>
            <form onSubmit={handleSubmit(onSubmitBitacora)} className="grid grid-cols-12 gap-x-6 p-fluid gap-y-6" autoComplete='off'>
                <FloatLabel  className='col-span-12 md:col-span-3'>
                    <Controller name="fecha" control={control} rules={{required: "La fecha es requerida"}} render={({field}) => (
                        <Calendar showIcon locale='es' dateFormat="dd/M/yy" {...field}/>
                    )}/>
                    <label>Fecha</label>
                </FloatLabel>

                <div className='col-span-12 md:col-span-9'>
                    <FloatLabel >
                        <Controller name="comentario" control={control} rules={{required: "El comentario es requerido"}} render={({field}) => (
                            <InputText {...field}/>
                        )}/>
                        <label>Comentario</label>
                    </FloatLabel>
                    {errors.comentario && <span className='text-xs text-red-500 ml-2 col-start-4 col-span-9'>{errors.comentario.message}</span>}
                </div>


                <Button className='col-span-12 mt-4' label="Registrar"></Button>
            </form>
        </Dialog>

        {/* Bitácora de Pagos */}
        <Dialog header="Registros en bitácora" visible={bitacoraVisible} draggable={true} className="md:w-1/2" 
            onHide={() => {if (!bitacoraVisible) return; setBitacoraVisible(false); }}>
            {bitacoraPago.length > 0 && bitacoraPago.map(bitacora => 
                <div className='flex flex-row mb-2'>
                    <div>{Utils.convertDate(bitacora.fecha)}</div>&nbsp;-&nbsp;<div>{bitacora.comentario}</div>
                </div>
            ) || 
            <div>No hay registros en bitácora</div>
            }
        </Dialog>
    </div>
  )
}
