import React, { useState } from 'react'
import AgregarPeriodo from '../pages/tarjetas/AgregarPeriodo'
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AgregarPeriodoContainer() {
  const context = useAuth();  
  const {tarjeta} = useLocation().state;
  const navigate = useNavigate();
  const [form, setForm] = useState({
      alias:"",
      fechaInicio: "",
      fechaCorte:"",
      fechaLimitePago: "",
      saldoInicial: 0
  });

  const handleChange = (e)=>{
      setForm({...form, [e.target.name]: e.target.value});
  }

  const agregaPeriodo = ()=>{
    const data = {
      idUsuario: context.user.uid,
      idTarjeta: tarjeta.id,
      saldoFinal: form.saldoInicial,
      totalPeriodo: 0,
      ...form
    }
    addDoc(collection(db, "Periodos"), data).then(() => {
        alert("Se agregó con exito");
        navigate(-1);
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
    <AgregarPeriodo form={form} handleChange={handleChange} handleSubmit={handleSubmit} tarjeta={tarjeta}/>
  )
}
