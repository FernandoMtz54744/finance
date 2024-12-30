import React, { useEffect, useState } from 'react'
import AgregarPeriodo from '../pages/tarjetas/AgregarPeriodo'
import { useAuth } from '../context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DateTime } from 'luxon';
import { getFechaLimitePago, getLastFechaByDay, getNextFechaByDay } from '../utils/utils';

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

  useEffect(()=>{
    setForm({...form, 
      fechaInicio: getLastFechaByDay(DateTime.fromISO(tarjeta.fechaCorte).plus({days: 1}).toISODate()),
      fechaCorte: getNextFechaByDay(tarjeta.fechaCorte)
    })
  }, [])

  useEffect(()=>{
    if(tarjeta.tipo === "Crédito"){
      setForm({...form,
        fechaLimitePago: getFechaLimitePago(form.fechaCorte)
      })
    }
  }, [form.fechaCorte]) 

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
    if(!validaPeriodo(data)){
      toast.error("Complete los campos")
      return;
    }

    if(!validaFechas(data)){
      return;
    }

    addDoc(collection(db, "Periodos"), data).then(() => {
        toast.success("Se agregó con exito");
        navigate(-1);
      }
    ).catch((error)=>{
      toast.error("Ocurrió un error al agregar la tarjeta")
      console.log(error)
    })
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    agregaPeriodo();
  }

  const validaPeriodo = (data)=>{
    if(!data.alias) return false;
    if(!data.fechaInicio) return false;
    if(!data.fechaCorte) return false;
    if(data.saldoInicial < 0) return false;
    if(tarjeta.tipo === "Crédito"){
      if(!data.fechaLimitePago) return false;
    }

    return true;
  }

  const validaFechas = (data)=>{
    const diaInicio = DateTime.fromISO(data.fechaInicio).day;
    const diaInicioValido = DateTime.fromISO(tarjeta.fechaCorte).day + 1;
    if(diaInicio !== diaInicioValido){
      toast.error("El día de inicio debe ser un " + diaInicioValido);
      return false;
    }

    const diaCorte = DateTime.fromISO(data.fechaCorte).day;
    const diaCorteValido = DateTime.fromISO(tarjeta.fechaCorte).day;
    if(diaCorte !== diaCorteValido){
      toast.error("El día de corte debe ser un " + diaCorteValido);
      return false;
    }

    const fechaInicio = DateTime.fromISO(data.fechaInicio);
    const fechaCorte = DateTime.fromISO(data.fechaCorte);
    const diferencia = fechaInicio.diff(fechaCorte, "months").months;
    if(Math.abs(diferencia) > 1) {
      toast.error("No puede haber diferencia de más de un mes entre las fechas de inicio y corte");
      return false;
    }

    if(fechaCorte <= fechaInicio){
      toast.error("La fecha de corte debe ser posterior a la de inicio");
      return false;
    }

    return true;
  }

  return (
    <AgregarPeriodo form={form} handleChange={handleChange} handleSubmit={handleSubmit} tarjeta={tarjeta}/>
  )
}
