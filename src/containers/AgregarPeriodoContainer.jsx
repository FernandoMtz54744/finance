import React, { useState } from 'react'
import AgregarPeriodo from '../pages/tarjetas/AgregarPeriodo'
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useParams } from 'react-router-dom';

export default function AgregarPeriodoContainer() {
  const context = useAuth();  
  const { idTarjeta } = useParams();

  const [form, setForm] = useState({
      alias:"",
      fechaInicio: "",
      fechaCorte:"",
      saldoInicial: 0
  });

  const handleChange = (e)=>{
      setForm({...form, [e.target.name]: e.target.value});
  }

  const agregaPeriodo = ()=>{
    const data = {
      idUsuario: context.user.uid,
      idTarjeta: idTarjeta,
      saldoFinal: form.saldoInicial,
      ...form
    }
    addDoc(collection(db, "Periodos"), data).then((response) => {
        alert("Se agregó con exito");
      }
    ).catch((error)=>{
      alert("Ocurrió un error al agregar la tarjeta")
      console.log(error)
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    agregaPeriodo();
  }

  return (
    <AgregarPeriodo form={form} handleChange={handleChange} handleSubmit={handleSubmit}/>
  )
}
