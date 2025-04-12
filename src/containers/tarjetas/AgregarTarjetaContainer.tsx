import { useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebase.config';
import { TarjetaForm } from '@/interfaces/forms/TarjetaForm';
import TarjetaFormComponent from '@/pages/tarjetas/TarjetaFormComponent';

export default function AgregarTarjetaContainer() {

    const { user } = useAuth();  
    const navigate = useNavigate();
    const [form, setForm] = useState<TarjetaForm>({
      idUsuario: user?.uid || "", 
      nombre:"", 
      diaCorte: 1,
      color:"FFFFFF", 
      tipo:"Débito", 
      correo:""
    });

    useEffect(()=>{
      if(user)
        setForm({...form, idUsuario: user.uid})
    }, [user])

    const handleChange = (e: any)=>{
      setForm({...form, [e.target.name]: e.target.value});
    }

    const agregaTarjeta = ()=>{
      if(!validarForm(form)){
        toast.error("Complete los datos");
        return;
      }
        
      addDoc(collection(db, "Tarjetas"), form).then(() => {
          toast.success("Se agregó la tarjeta con éxito")
          navigate(-1);
        }
      ).catch((error)=>{
        toast.error("Error al agregar la tarjeta")
        console.log(error)
      })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      agregaTarjeta();
    }

    const validarForm = (form: TarjetaForm)=>{
      if(!form.nombre) return false;
      if(!form.diaCorte) return false;
      if(!form.correo) return false;
      if(!form.color || form.color === "FFFFFF") return false;
      if(!form.idUsuario) return false;
      return true;
    }

  return (
    <TarjetaFormComponent 
      form={form} 
      title={"Agregar Tarjeta"}
      isEdit={false}  
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
