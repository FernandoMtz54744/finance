import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/firebase/firebase.config';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { TarjetaForm } from '@/interfaces/forms/TarjetaForm';
import TarjetaFormComponent from '@/pages/tarjetas/TarjetaFormComponent';

export default function EditarTarjetaContainer() {
  const navigate = useNavigate();
  const { tarjeta } = useLocation().state as {tarjeta: Tarjeta};
  const [form, setForm] = useState<TarjetaForm>({...tarjeta})

  const handleChange = (e: any)=>{
      setForm({...form, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e: any) =>{
    e.preventDefault();
    editarTarjeta();
  }

  const editarTarjeta = ()=>{
    if(!validarForm(form)){
      toast.error("Complete los datos");
      return;
    }

    updateDoc(doc(db, "Tarjetas", tarjeta.id), {...form}).then(() => {
        toast.success("Se modificó la tarjeta con éxito")
        navigate(-1);
      }
    ).catch((error)=>{
      toast.error("Error al editar la tarjeta")
      console.log(error)
    })
  }

  const validarForm = (form: TarjetaForm)=>{
    if(!form.nombre) return false;
    if(!form.diaCorte) return false;
    if(!form.correo) return false;
    if(!form.color || form.color === "FFFFFF") return false;
    if(!form.idUsuario) return false;
    return true;
  }

  return (
    <TarjetaFormComponent 
      form={form} 
      title={"Editar Tarjeta"} 
      isEdit={true}
      handleChange={handleChange} 
      handleSubmit={handleSubmit}/>
  )
}
