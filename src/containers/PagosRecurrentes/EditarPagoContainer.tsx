import { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'
import { Pago } from '@/interfaces/Pago'
import PagoFormComponent from '@/pages/pagosRecurrentes/PagoFormComponent'
import { PagoRecurrenteForm } from '@/interfaces/forms/PagoRecurrenteForm'

export default function EditarPagoContainer() {
  const navigate = useNavigate();
  const { pago } = useLocation().state as {pago: Pago};

  const onSubmit = (data: PagoRecurrenteForm) =>{
    updateDoc(doc(db, "PagosRecurrentes", pago.id!),  data).then(() => {
      toast.success("Se actualizó el pago con éxito");
      navigate(-1);
    }).catch((error)=>{
      toast.error("Error al agregar el pago");
      console.log(error);
    })
  }

  return (
    <PagoFormComponent 
      pago={pago}
      title='Editar Pago' 
      onSubmit={onSubmit}/>
  )
}
