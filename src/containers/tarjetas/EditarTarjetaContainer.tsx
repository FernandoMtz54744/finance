import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/firebase/firebase.config';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { TarjetaForm } from '@/interfaces/forms/TarjetaForm';
import TarjetaFormComponent from '@/pages/tarjetas/TarjetaFormComponent';

export default function EditarTarjetaContainer() {
  const navigate = useNavigate();
  const { tarjeta } = useLocation().state as {tarjeta: Tarjeta};

  const onSubmit = (data: TarjetaForm)=>{
    updateDoc(doc(db, "Tarjetas", tarjeta.id), data).then(() => {
        toast.success("Se modificó la tarjeta con éxito")
        navigate(-1);
      }).catch((error)=>{
      toast.error("Error al editar la tarjeta")
      console.log(error)
    })
  }

  return (
    <TarjetaFormComponent 
      tarjeta={tarjeta} 
      title={"Editar Tarjeta"} 
      isEdit={true} 
      onSubmit={onSubmit}
    />
  )
}
