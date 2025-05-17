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
import Swal from 'sweetalert2';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';
import { Controller, useForm } from 'react-hook-form';
import { MovimientoForm } from '@/interfaces/forms/MovimientoForm';

interface props {
  periodo: Periodo,
  tarjeta: Tarjeta,
  movimientoViewModel: MovimientoViewModel,
  eliminaMovimiento: (id: string)=> void,
  actualizaMovimientos: ()=> void,
}

export default function MovimientoList({ periodo, tarjeta, movimientoViewModel, eliminaMovimiento, actualizaMovimientos }: props) {

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { setLoading } = useLoading();

  const items = [
    movimientoViewModel.linkDocumento? 
      { label:"Ver documento", icon: 'pi pi-eye', command: ()=> window.open(movimientoViewModel.linkDocumento, "_blank")} 
      :{ label:"Agregar documento", icon: 'pi pi-file-plus', command: ()=> setVisible(true)},
    !periodo.isValidado && { label:"Validar periodo", icon:'pi pi-verified', command: ()=> validarPeriodo() },
    { label:"Regresar", icon: 'pi pi-arrow-left', command: ()=> navigate(-1)}
  ].filter(Boolean) as MenuItem[];

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

  const validarPeriodo = async ()=>{
    const result = await Swal.fire({
          title: 'Validar periodo',
          text: "¿Desea marcar este periodo como validado?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'Cancelar'
        });

    if(result.isConfirmed){
      updateDoc(doc(db, "Periodos", periodo.id), {isValidado: true}).then(() => {
        toast.success("Periodo marcado correctamente");
        navigate(-1);
      }).catch((error)=>{
        toast.error("Ocurrió un error al validar el periodo");
        console.log(error);
      })
    }
  }

  return (
    <>
      {/* CARGOS & ABONOS */}
      <div className='flex md:flex-row flex-col justify-between w-full gap-12 px-8 mb-32'>
        <div className='md:w-1/2'>
          <TableMovimientos 
            movimientos={movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "abono").sort((a, b) => a.fecha.getTime()-b.fecha.getTime())}
            eliminaMovimiento={eliminaMovimiento}
            header={"Abonos"}/>
        
          <div className='flex flex-row justify-center gap-2 bg-teal-950 py-3 w-full rounded-md mt-8 '>
              Total Abonos: <div className='total-abono green'>{currencyFormat(movimientoViewModel.total.totalAbono)}</div>
          </div>
        </div>

        <div className='md:w-1/2'>
          <TableMovimientos 
              movimientos={movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "cargo").sort((a, b) => a.fecha.getTime()-b.fecha.getTime())}
              eliminaMovimiento={eliminaMovimiento}
              header={"Cargos"}/>
          
          <div className='flex flex-row justify-center gap-2 bg-teal-950 py-3 w-full rounded-md mt-8 '>
            Total Cargos <div className='total-cargo red'>{currencyFormat(movimientoViewModel.total.totalCargo)}</div>
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

        <Button onClick={actualizaMovimientos} label="Guardar Movimientos" size="large" disabled={periodo.isValidado}/>
      </div>

      <Dialog header="Subir estado de cuenta" visible={visible} draggable={false} position="center"
        className="w-1/2"
        onHide={() => {if (!visible) return; setVisible(false); }}>
            <div className="flex flex-row justify-center items-center">
              <FileUpload name='file' mode="basic" accept=".pdf" customUpload={true}
                uploadHandler={fileUploadHandler}/>
            </div>
      </Dialog>
    </>
  )
}
