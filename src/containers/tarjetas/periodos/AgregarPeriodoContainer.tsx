import { addDoc, collection } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebase.config';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { AddPeriodo, PeriodoForm } from '@/interfaces/forms/PeriodoForm';
import PeriodoFormComponent from '@/pages/tarjetas/periodos/PeriodoFormComponent';

export default function AgregarPeriodoContainer() {
  const navigate = useNavigate();
  const { user } = useAuth();  
  const { tarjeta } = useLocation().state as {tarjeta: Tarjeta};

  //Registra el periodo
  const onSubmit = (data: PeriodoForm)=>{
    if(!(user && user.uid)){
      toast.error("No se pudo obtener el identificador del usuario");
      return
    }
    const periodo: AddPeriodo ={
      idUsuario: user.uid,
      idTarjeta: tarjeta.id,
      nombre: data.nombre,
      fechaInicio: data.fechaInicio,
      fechaCorte: data.fechaCorte,
      saldoInicial: data.saldoInicial,
      saldoFinal: data.saldoInicial,
      pagado: null,
      totalPeriodo: 0 
    }

    addDoc(collection(db, "Periodos"), periodo).then(() => {
      toast.success("Se agregó el periodo con éxito");
      navigate(-1);
    }).catch((error)=>{
      toast.error("Ocurrió un error al agregar el periodo")
      console.log(error)
    })
  }

  return (
    <PeriodoFormComponent 
      tarjeta={tarjeta} 
      title={"Agregar Periodo"}
      onSubmit={onSubmit} 
    />
  )
}
