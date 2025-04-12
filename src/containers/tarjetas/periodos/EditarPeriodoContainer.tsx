import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';
import { PeriodoForm } from '@/interfaces/forms/PeriodoForm';
import * as Utils from "@/utils/utils"
import PeriodoFormContainer from '@/pages/tarjetas/periodos/PeriodoFormContainer';
import { Periodo } from '@/interfaces/Periodo';
import { Tarjeta } from '@/interfaces/Tarjeta';

export default function EditarPeriodoContainer() {
  const {periodo, tarjeta} = useLocation().state as {periodo: Periodo, tarjeta: Tarjeta};
  const navigate = useNavigate();
  const [form, setForm] = useState<PeriodoForm>({
      idUsuario: periodo.idUsuario,
      nombre: periodo.nombre,
      idTarjeta: periodo.idTarjeta,
      fechaInicio: periodo.fechaInicio,
      fechaCorte: periodo.fechaCorte,
      saldoInicial: periodo.saldoInicial,
      saldoFinal: periodo.saldoFinal,
      totalPeriodo: periodo.totalPeriodo,
      pagado: periodo.pagado
  });
  const [ fechaLimitePago, setFechaLimitePago ] = useState<Date>(Utils.getFechaLimitePago(Utils.getNextFechaByDay(tarjeta.diaCorte)));    

  const handleChange = (e: any)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }

  useEffect(()=>{
    if(tarjeta.tipo === "Crédito"){
      setFechaLimitePago(Utils.getFechaLimitePago(form.fechaCorte));
    }
  }, [form.fechaCorte])

  //Actualiza el periodo
  const submitFunction = async ()=>{
    updateDoc(doc(db, "Periodos", periodo.id), form).then(() => {
        toast.success("Se modificó el periodo con éxito")
        navigate(-1);
      }
    ).catch((error)=>{
      toast.error("Error al agregar al modificar el periodo")
      console.log(error)
    })
  }  

  return (
    <PeriodoFormContainer
      tarjeta={tarjeta}
      form={form} 
      title='Editar Periodo'
      fechaLimitePago={fechaLimitePago}
      isEdit={true}
      handleChange={handleChange} 
      submitFunction={submitFunction}
    /> 
  )
}
