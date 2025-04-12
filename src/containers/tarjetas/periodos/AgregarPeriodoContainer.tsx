import { useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Utils from "@/utils/utils"
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebase.config';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { PeriodoForm } from '@/interfaces/forms/PeriodoForm';
import PeriodoFormContainer from '@/pages/tarjetas/periodos/PeriodoFormContainer';

export default function AgregarPeriodoContainer() {
  const navigate = useNavigate();
  const { user } = useAuth();  
  const { tarjeta } = useLocation().state as {tarjeta: Tarjeta};
  const [ fechaLimitePago, setFechaLimitePago ] = useState<Date>(Utils.getFechaLimitePago(Utils.getNextFechaByDay(tarjeta.diaCorte)));

  const [form, setForm] = useState<PeriodoForm>({
      idUsuario: user?.uid || "",
      nombre:"",
      idTarjeta: tarjeta.id,
      fechaInicio: Utils.getLastFechaByDay(tarjeta.diaCorte + 1),
      fechaCorte: Utils.getNextFechaByDay(tarjeta.diaCorte),
      saldoInicial: 0,
      saldoFinal: 0,
      totalPeriodo: 0,
      pagado: null
  });

  useEffect(()=>{
    if(user)
      setForm({...form, idUsuario: user.uid});
  }, [user])

  useEffect(()=>{
    if(tarjeta.tipo === "Crédito"){
      setFechaLimitePago(Utils.getFechaLimitePago(form.fechaCorte));
    }
  }, [form.fechaCorte])

  useEffect(()=>{
    setForm({...form, saldoFinal: form.saldoInicial});
  }, [form.saldoInicial])

  const handleChange = (e: any)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }

  //Registra el periodo
  const submitFunction = ()=>{
    addDoc(collection(db, "Periodos"), form).then(() => {
      toast.success("Se agregó con exito");
      navigate(-1);
    }).catch((error)=>{
      toast.error("Ocurrió un error al agregar el periodo")
      console.log(error)
    })
  }

  return (
    <PeriodoFormContainer 
      form={form} 
      tarjeta={tarjeta} 
      title={"Agregar Periodo"}
      fechaLimitePago= {fechaLimitePago}
      isEdit={false}
      handleChange={handleChange} 
      submitFunction={submitFunction} 
      />
  )
}
