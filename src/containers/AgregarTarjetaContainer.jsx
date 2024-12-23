import React, { useState } from 'react'
import AgregarTarjeta from '../pages/tarjetas/AgregarTarjeta'
import { db } from "../firebase/firebase.config"
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AgregarTarjetaContainer() {

    const context = useAuth();  
    const navigate = useNavigate();
    const [form, setForm] = useState({
        alias:"",
        fechaCorte:"",
        color:"",
        tipo:"Débito",
        fechaLimitePago:"",
        correo:""
    })

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const agregaTarjeta = ()=>{
      const data = {
        idUsuario: context.user.uid,
        ...form
      }

      if(!validarForm(data)){
        toast.error("Complete los datos");
        return;
      }


      addDoc(collection(db, "Tarjetas"), data).then(() => {
          toast.success("Se agregó la tarjeta con éxito")
          navigate(-1);
        }
      ).catch((error)=>{
        toast.error("Error al agregar la tarjeta")
        console.log(error)
      })
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      agregaTarjeta();
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
    <AgregarTarjeta form={form} handleChange={handleChange} handleSubmit={handleSubmit}/>
  )
}
