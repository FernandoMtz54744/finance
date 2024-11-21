import React, { useState } from 'react'
import AgregarTarjeta from '../pages/tarjetas/AgregarTarjeta'
import { db } from "../firebase/firebase.config"
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';

export default function AgregarTarjetaContainer() {

    const context = useAuth();  
    const [form, setForm] = useState({
        alias:"",
        fechaCorte:"",
        color:"",
        tipo:""
    })

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const agregaTarjeta = ()=>{
      const data = {
        idUsuario: context.user.uid,
        ...form
      }
      addDoc(collection(db, "Tarjetas"), data).then((response) => {
          alert("Se agregó con exito");
        }
      ).catch((error)=>{
        alert("Ocurrió un error al agregar la tarjeta")
        console.log(error)
      })
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      agregaTarjeta();
    }

  return (
    <AgregarTarjeta form={form} handleChange={handleChange} handleSubmit={handleSubmit}/>
  )
}
