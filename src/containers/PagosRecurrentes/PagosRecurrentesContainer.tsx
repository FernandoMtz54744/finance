import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useParams } from 'react-router-dom';
import PagosRecurrentes from '@/pages/pagosRecurrentes/PagosRecurrentes';
import { Pago } from '@/interfaces/Pago';
import { DateTime } from 'luxon';
import * as Utils from "@/utils/utils"
import { BitacoraPagoAdd, BitacoraPagoForm } from '@/interfaces/forms/BitacoraPagoForm';

export default function PagosRecurrentesContainer() {
  const params= useParams();
  const [pagos, setPagos] = useState<Pago[]>([]);
  // Bitácora
  const [visible, setVisible] = useState<boolean>(false);

  const pagoSeleccionado = useRef<Pago | null>(null);
  
  useEffect(()=>{
    const queryBD = query(collection(db, "PagosRecurrentes"), where("idUsuario", "==", params.idUsuario))
    const unsuscribe =  onSnapshot(queryBD, (snapshot) =>{
      setPagos(snapshot.docs.map(pago =>{
          const data = pago.data();
          return {
            ...data,
            id: pago.id,
            ultimoPago: data.ultimoPago.toDate(),
            proximoPago: data.proximoPago.toDate()
          } as Pago
        }))
    }, (error) =>{
      toast.error("Error al consultar los movimientos");
      console.log(error)
    });
    return ()=> unsuscribe();
  }, []);

  const actualizaPago = async (pago: Pago)=>{
    if(pago.isPagado){
      Swal.fire({
        icon: 'error',
        title: 'No se puede actualizar el pago',
        text: 'Ya realizó previamente el pago y no se puede deshacer, espere al siguiente periodo y se habilitará automáticamente',
        confirmButtonText: 'Entendido',
      })
    }else{
      const result = await updateIsPagado(pago.id!)
      if(!result) return; //Si se canceló entonces cancela todo

      if(pago.periodicidad === "Personalizada"){ //Solo para personalizada puede actualizar fecha de pago
        const hoy = DateTime.local().startOf("day");
        const ultimoPago = DateTime.fromJSDate(pago.ultimoPago);
        const proximoPago = DateTime.fromJSDate(pago.proximoPago);
        //Si el día de pago no coincide pregunta por la actulización de la fecha de pago
        if(!(ultimoPago.equals(hoy) || proximoPago.equals(hoy))){
          await updateFecha(pago);
        }
      }

      if(pago.auditar){
        pagoSeleccionado.current = pago;
        setVisible(true);
      }
    } 
  }

  const onSubmitBitacora = async (data: BitacoraPagoForm)=>{
    try{
      console.log(data);
      if(!pagoSeleccionado.current?.id){
        toast.error("No se pudo obtener el id del pago seleccionado");
        return
      }
      const bitacoraPagoAdd: BitacoraPagoAdd = {
        idPago: pagoSeleccionado.current?.id,
        comentario: data.comentario,
        fecha: data.fecha
      }
      await addDoc(collection(db, "BitacoraPagos"), bitacoraPagoAdd);
      toast.success("Se agregó el registro en bitácora");
    }catch(error){
      toast.error("Error al agregar en bitácora el pago");
      console.log(error)
    }
    setVisible(false);
  }  

  const updateFecha = async (pago: Pago)=>{
    const result = await Swal.fire({
      title: 'Actualizar fecha',
      text: "Se detetó que la fecha de pago no coincide con la establecida\n¿Desea actualizar la fecha de hoy como nueva fecha de pago?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No cambiar',
      confirmButtonText: 'Sí, cambiar'
    });

    if(result.isConfirmed){
      try{
        const hoy = DateTime.local().startOf("day");
        const data = {
          ultimoPago: hoy.toJSDate(),
          proximoPago: Utils.obtenerProximoPago(pago)
        }
        await updateDoc(doc(db, "PagosRecurrentes", pago.id!), data);
        toast.success("Se modificó la fecha de pago con éxito")
      }catch(error){
        toast.error("Error al modificar el pago")
        console.log(error)
      }
    }
  }

  const updateIsPagado = async (idPago: string): Promise<boolean> =>{
    const result = await Swal.fire({
        title: 'Cambiar pago',
        text: "Esta acción cambiará el estado del pago",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, cambiar'
      });

    if(result.isConfirmed){
      try{
        await updateDoc(doc(db, "PagosRecurrentes", idPago), {isPagado: true});
        toast.success("Se actualizó el estado del pago con éxito");
        return true;
      }catch(error){
        toast.error("Error al modificar el pago");
        console.log(error)
      }
    }
    return false;
  }

  return (
    <PagosRecurrentes 
      pagos={pagos} 
      actualizaPago={actualizaPago}
      visible={visible}
      onSubmitBitacora={onSubmitBitacora}
      />
  )
}
