import React, { useEffect, useState } from 'react'
import EditarPeriodo from '../pages/tarjetas/EditarPeriodo'
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { DateTime } from 'luxon';

export default function EditarPeriodoContainer() {
    const {periodo} = useLocation().state;
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
        setForm({
            alias:periodo.alias,
            fechaInicio: periodo.fechaInicio,
            fechaCorte: periodo.fechaCorte,
            fechaLimitePago: periodo.fechaLimitePago,
            saldoInicial: periodo.saldoInicial
        })
    }, [periodo])

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const editaPeriodo = ()=>{
        const data = {
            ...form
        }

        if(!validaPeriodo(data)){
            toast.error("Complete los campos")
            return;
          }
      
        if(!validaFechas(data)){
        return;
        }

        updateDoc(doc(db, "Periodos", periodo.idPeriodo), data).then(() => {
            toast.success("Se modificó el periodo con éxito")
            navigate(-1);
          }
        ).catch((error)=>{
          toast.error("Error al agregar al modificar el periodo")
          console.log(error)
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        editaPeriodo();
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
        <EditarPeriodo form={form} handleChange={handleChange} handleSubmit={handleSubmit} tarjeta={tarjeta}/>
    )
}
