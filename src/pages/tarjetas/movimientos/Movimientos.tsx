import {  useNavigate } from 'react-router-dom';
import { convertDate, currencyFormat, getFechaLimitePago } from '@/utils/utils';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { Periodo } from '@/interfaces/Periodo';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import TableMovimientos from './TableMovimientos';
import { Movimiento } from '@/interfaces/Movimiento';
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { MovimientoViewModel } from "@/interfaces/MovimientoViewModel";
import { MenuItem } from "primereact/menuitem";
import  * as documentoService from "@/services/documentoService";
import { useLoading } from "@/context/LoadingContext";
import toast from "react-hot-toast";

interface props {
  periodo: Periodo,
  tarjeta: Tarjeta
  formMovimiento: Movimiento,
  movimientoViewModel: MovimientoViewModel
  movimientosUtils: {
    agregaMovimiento: (e: any)=> void,
    eliminaMovimiento: (id: string)=> void,
    actualizaMovimientos: ()=> void,
  },
  handlers: {
    onChange: (e: any)=> void,
    keyDown: (e: any)=> void,
    changeFile: (e: any)=> void,

  }
}

export default function Movimientos({ periodo, tarjeta, formMovimiento, movimientoViewModel, movimientosUtils, handlers}: props) {

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { setLoading } = useLoading();

  const fileUploadHandler = async(fileEvent: FileUploadHandlerEvent)=>{
    try{
      setLoading(true);
      setVisible(false);
      const file = fileEvent.files[0];
      const fileName = `${tarjeta.nombre} ${tarjeta.tipo} - ${periodo.nombre}`;
      await documentoService.subirDocumento(file, fileName, periodo.id);
      toast.success("Se actualizó el documento");
    }catch(error){
      toast.error("Error al subir el documento");
    }finally{
      setLoading(false);
    }
  }

  const items = [
    movimientoViewModel.linkDocumento && { label:"Ver documento", icon: 'pi pi-eye', command: ()=> window.open(movimientoViewModel.linkDocumento, "_blank")},
    { label:"Agregar documento", icon: 'pi pi-file-plus', command: ()=> setVisible(true)},
    { label:"Regresar", icon: 'pi pi-arrow-left', command: ()=> navigate(-1)},
  ].filter(Boolean) as MenuItem[];

  return (
    <div className='flex flex-col justify-center items-center'>

      {/* DATOS DEL PERIODO */}
      <div className='flex md:flex-row flex-col w-full md:justify-between items-center my-4 px-8'>
          <div>{tarjeta.nombre}&nbsp;{tarjeta.tipo} - {periodo.nombre}</div>
          <div>Fecha inicio: {convertDate(periodo.fechaInicio)}</div>
          <div>Fecha de corte: {convertDate(periodo.fechaCorte)}</div>
          {tarjeta.tipo === "Crédito" && (
            <div>Fecha límite de pago: {convertDate(getFechaLimitePago(periodo.fechaCorte))}</div>
          )}
      </div>

      {/* CÁLCULOS DE LOS MOVIMIENTOS */}
      <div className='flex md:flex-row flex-col justify-around items-center w-full bg-teal-950 p-1'>
          <div>Saldo inicial: {currencyFormat(periodo.saldoInicial)}</div>
          <div className='flex flex-row'>Total Periodo:&nbsp;<div className={movimientoViewModel.total.totalPeriodo >= 0?"green":"red"}>{currencyFormat(movimientoViewModel.total.totalPeriodo)}</div></div>
          <div>Saldo Final: {currencyFormat(movimientoViewModel.total.saldoFinal)}</div>
      </div>

      {/* FORMULARIO DE MOVIMIENTOS */}
      <form className='w-full flex md:flex-row flex-col justify-around border-y-2 py-2 border-teal-950 my-4' autoComplete="off">
        <div>
          Fecha: <Calendar className='p-inputtext-sm' name='fecha' value={formMovimiento.fecha}
            onChange={handlers.onChange} minDate={periodo.fechaInicio} 
            maxDate={tarjeta.tipo==="Crédito"?getFechaLimitePago(periodo.fechaCorte):periodo.fechaCorte} 
            dateFormat="dd/M/yy" locale="es"/>
        </div>
        <div>
          Cantidad: <InputNumber className='p-inputtext-sm' mode="currency" currency="USD" name='cantidad' 
            value={formMovimiento.cantidad} onChange={(e) => handlers.onChange({target: {name: 'cantidad', value: e.value}})} onKeyDown={handlers.keyDown} />
        </div>
        <div>
          Motivo: <InputText className='p-inputtext-sm' type="text" name='motivo' value={formMovimiento.motivo} 
            onChange={handlers.onChange} onKeyDown={handlers.keyDown} />
        </div>
        <div className='flex flex-row justify-center w-16 center'>
          <ToggleButton className='p-inputtext-sm' onLabel="Efectivo" offLabel="Transferencia" name="isEfectivo"
            onChange={handlers.onChange} checked={formMovimiento.isEfectivo} onKeyDown={handlers.keyDown}/>
        </div>
        <Button onClick={movimientosUtils.agregaMovimiento} label='Agregar'/>
      </form>

      {/* CARGOS & ABONOS */}
      <div className='flex md:flex-row flex-col justify-between w-full gap-12 px-8 mb-32'>
        <div className='md:w-1/2'>
          <TableMovimientos 
            movimientos={movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "abono").sort((a, b) => a.fecha.getTime()-b.fecha.getTime())}
            eliminaMovimiento={movimientosUtils.eliminaMovimiento}
            header={"Abonos"}/>
        
          <div className='flex flex-row justify-center gap-2 bg-teal-950 py-3 w-full rounded-md mt-8 '>
              Total Abonos: <div className='total-abono'>{currencyFormat(movimientoViewModel.total.totalAbono)}</div>
          </div>
        </div>

        <div className='md:w-1/2'>
          <TableMovimientos 
              movimientos={movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "cargo").sort((a, b) => a.fecha.getTime()-b.fecha.getTime())}
              eliminaMovimiento={movimientosUtils.eliminaMovimiento}
              header={"Cargos"}/>
          
          <div className='flex flex-row justify-center gap-2 bg-teal-950 py-3 w-full rounded-md mt-8 '>
            Total Cargos <div className='total-cargo'>{currencyFormat(movimientoViewModel.total.totalCargo)}</div>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="fixed bottom-6">
        <Tooltip target=".p-speeddial-action" position="left" className='invisible md:visible'/>
        <SpeedDial model={items} direction="up" style={{position: "fixed", bottom: "1rem", right:"1rem"}}  
          buttonClassName="p-button-secondary"
          showIcon="pi pi-angle-double-up" hideIcon="pi pi-times"
          pt={{ actionIcon: { style: {pointerEvents: "none"}} }}/>

        <Button onClick={movimientosUtils.actualizaMovimientos} label="Guardar Movimientos" size="large"/>
      </div>

      <Dialog header="Subir estado de cuenta" visible={visible} draggable={false} position="center"
        className="w-1/2"
        onHide={() => {if (!visible) return; setVisible(false); }}>
            <div className="flex flex-row justify-center items-center">
              <FileUpload name='file' mode="basic" accept=".pdf" customUpload={true}
                uploadHandler={fileUploadHandler}/>
            </div>
      </Dialog>
    </div>
  )
}
