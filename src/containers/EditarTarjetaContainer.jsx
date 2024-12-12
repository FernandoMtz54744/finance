import React, { useEffect, useState } from 'react'
import EditarTarjeta from '../pages/tarjetas/EditarTarjeta'
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '../firebase/firebase.config';

export default function EditarTarjetaContainer() {
    const navigate = useNavigate();
    const { tarjeta } = useLocation().state;
    const [form, setForm] = useState({
        alias:"",
        fechaCorte:"",
        color:"",
        tipo:"Débito",
        fechaLimitePago:"",
        correo:""
    })

    useEffect(()=>{
      setForm({
        alias:tarjeta.alias,
        fechaCorte: tarjeta.fechaCorte,
        color: tarjeta.color,
        tipo: tarjeta.tipo,
        fechaLimitePago: tarjeta.fechaLimitePago,
        correo: tarjeta.correo
    })
    }, [tarjeta])

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const editarTarjeta = ()=>{
      const data = {
        ...form,
      }

      if(!validarForm(data)){
        toast.error("Complete los datos");
        return;
      }

      updateDoc(doc(db, "Tarjetas", tarjeta.id), data).then(() => {
          toast.success("Se modificó la tarjeta con éxito")
          navigate(-1);
        }
      ).catch((error)=>{
        toast.error("Error al agregar la tarjeta")
        console.log(error)
      })
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      editarTarjeta();
    }

    const validarForm = (data)=>{
      if(!data.alias) return false;
      if(!data.fechaCorte) return false;
      if(!data.correo) return false;
      if(data.tipo === "Crédito"){
        if(!data.fechaLimitePago) return false
      }
      if(!data.color) return false;
      
      return true;
    }

  return (
    <div>
        <EditarTarjeta form={form} handleChange={handleChange} handleSubmit={handleSubmit}/>
    </div>
  )
}
