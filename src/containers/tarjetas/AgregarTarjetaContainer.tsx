import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebase.config';
import TarjetaFormComponent from '@/pages/tarjetas/TarjetaFormComponent';
import { AddTarjeta, TarjetaForm } from '@/interfaces/forms/TarjetaForm';

export default function AgregarTarjetaContainer() {
  const { user } = useAuth();  
  const navigate = useNavigate();

  const onSubmit = (data: TarjetaForm) =>{
    if(!(user && user.uid)){
      toast.error("No se pudo obtener el identificador del usuario");
      return 
    }
    const tarjeta: AddTarjeta = {
      idUsuario: user.uid,
      nombre: data.nombre,
      tipo: data.tipo,
      diaCorte: data.diaCorte,
      color: data.color,
      correo: data.correo
    }
    
    addDoc(collection(db, "Tarjetas"), tarjeta).then(() => {
      toast.success("Se agregó la tarjeta con éxito")
      navigate(-1);
    }).catch((error)=>{
      toast.error("Error al agregar la tarjeta")
      console.log(error)
    })
  }

  return (
    <TarjetaFormComponent
      title={"Agregar Tarjeta"}
      isEdit={false}  
      onSubmit={onSubmit}
    />
  )
}
