import React, { useEffect, useState } from 'react'
import AgregarPago from '../../pages/pagosConcurrentes/AgregarPago'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/firebase.config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getLastFechaByPeriodicity, getNextFechaByPeriodicity } from '../../utils/utils'
import { DateTime } from 'luxon'

export default function AgregarPagoContainer() {

    const context = useAuth();  
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: "",
        cantidad: 0,
        fechaPago:"",
        periodicidad: "Mensual",
        hasFechaLimite: false,
        correo: "",
        diasLimitePago: 0
    })

    useEffect(()=>{
      setForm({...form, fechaPago: DateTime.local().toISODate()})
    }, [])

    const handleChange = (e)=>{
      if(e.target.type === "checkbox"){
        setForm({...form, [e.target.name]: e.target.checked});
      }else{
        setForm({...form, [e.target.name]: e.target.value});
      }
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      const fechaInicio = getLastFechaByPeriodicity(form.fechaPago, form.periodicidad);
      const proximoPago = getNextFechaByPeriodicity(form.fechaPago, form.periodicidad);
      const data = {
        idUsuario: context.user.uid,
        pagado: false,
        fechaInicio: fechaInicio,
        proximoPago: proximoPago,
        ...form
      }

      if(!validarForm(data)){
        toast.error("Complete los datos");
        return;
      }

      addDoc(collection(db, "PagosConcurrentes"), data).then(() => {
        toast.success("Se agregó el pago con éxito");
        navigate(-1);
      }).catch((error)=>{
        toast.error("Error al agregar el pago");
        console.log(error)
      })
    }

    const validarForm = (data)=>{
      if(!data.nombre) return false;
      if(!data.fechaPago) return false;
      if(!data.correo) return false;
      if(data.hasFechaLimite){
        if(data.diasLimitePago < 0) return false
      }      
      return true;
    }


  return (
    <AgregarPago form={form} handleChange={handleChange} handleSubmit={handleSubmit}/>
  )
}
