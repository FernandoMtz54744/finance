import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PagoFormComponent from '@/pages/pagosRecurrentes/PagoFormComponent'
import { PagoRecurrenteAdd, PagoRecurrenteForm } from '@/interfaces/forms/PagoRecurrenteForm'

export default function AgregarPagoContainer() {
  const { user } = useAuth();  
  const navigate = useNavigate();

  const onSubmit = (data: PagoRecurrenteForm) =>{
    if(!(user && user.uid)){
      toast.error("No se pudo obtener el id del usuario");
      return;
    }
    const pago: PagoRecurrenteAdd = {
      idUsuario: user.uid,
      nombre: data.nombre,
      cantidad: data.cantidad,
      periodicidad: data.periodicidad,
      diasPersonalizada: data.diasPersonalizada, 
      correo: data.correo,
      isPagado: false,
      ultimoPago: data.ultimoPago, 
      proximoPago: data.proximoPago,
      diasLimitePago: data.diasLimitePago, 
      diasAntesNotificacion: data.diasAntesNotificacion,
      auditar: data.auditar
    }

    addDoc(collection(db, "PagosRecurrentes"), pago).then(() => {
      toast.success("Se agregó el pago con éxito");
      navigate(-1);
    }).catch((error)=>{
      toast.error("Error al agregar el pago");
      console.log(error);
    })
  }

  return (
    <PagoFormComponent 
      title='Agregar Pago' 
      onSubmit={onSubmit}/>
  )
}
