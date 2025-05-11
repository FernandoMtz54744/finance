import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';
import { EditPeriodo, PeriodoForm } from '@/interfaces/forms/PeriodoForm';
import PeriodoFormContainer from '@/pages/tarjetas/periodos/PeriodoFormComponent';
import { Periodo } from '@/interfaces/Periodo';
import { Tarjeta } from '@/interfaces/Tarjeta';

export default function EditarPeriodoContainer() {
  const {periodo, tarjeta} = useLocation().state as {periodo: Periodo, tarjeta: Tarjeta};
  const navigate = useNavigate();

  //Actualiza el periodo
  const onSubmit = (data: PeriodoForm)=>{
    const editPeriodo: EditPeriodo = {
      nombre: data.nombre,
      fechaInicio: data.fechaInicio,
      fechaCorte: data.fechaCorte,
      saldoInicial: data.saldoInicial,
      saldoFinal: data.saldoInicial + periodo.totalPeriodo
    }
    updateDoc(doc(db, "Periodos", periodo.id), editPeriodo).then(() => {
      toast.success("Se modificó el periodo con éxito")
      navigate(-1);
    }).catch((error)=>{
      toast.error("Error al agregar al modificar el periodo")
      console.log(error)
    });
  }  

  return (
    <PeriodoFormContainer
      tarjeta={tarjeta}
      title='Editar Periodo'
      periodo={periodo}
      onSubmit={onSubmit}
    /> 
  )
}
 