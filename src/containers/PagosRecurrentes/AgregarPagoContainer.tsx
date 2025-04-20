import { useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { DateTime } from 'luxon'
import { Pago } from '@/interfaces/Pago'
import PagoFormComponent from '@/pages/pagosRecurrentes/PagoFormComponent'

export default function AgregarPagoContainer() {
  const { user } = useAuth();  
  const navigate = useNavigate();
  const [form, setForm] = useState<Pago>({
    idUsuario: user?.uid || "",
    nombre: "",
    cantidad: 0,
    periodicidad: "Mensual",
    correo: "",
    isPagado: false,
    ultimoPago: DateTime.local().toJSDate(), 
    proximoPago: DateTime.local().plus({months: 1}).toJSDate(),
    diasLimitePago: 0,
    diasAntesNotificacion: 0,
    auditar: false
  });

  useEffect(()=>{
    if(user)
      setForm({...form, idUsuario: user.uid});
  }, [user]);

  useEffect(() =>{
    let proximoPago = form.proximoPago;
    if(form.periodicidad === "Anual"){
      proximoPago = DateTime.fromJSDate(form.ultimoPago).plus({years: 1}).toJSDate();
    }else if(form.periodicidad === "Mensual"){
      proximoPago = DateTime.fromJSDate(form.ultimoPago).plus({months: 1}).toJSDate();
    }else{
      proximoPago = DateTime.fromJSDate(form.ultimoPago).plus({days: form.diasPersonalizada}).toJSDate();
    }
    setForm({...form, proximoPago: proximoPago});
  }, [form.ultimoPago, form.periodicidad, form.diasPersonalizada])

  const handleChange = (e: any)=>{
    if(e.target.type === "checkbox"){
      setForm({...form, [e.target.name]: e.target.checked});
    }else{
      setForm({...form, [e.target.name]: e.target.value});
    }
  }

  const handleSubmit = (e: any) =>{
    e.preventDefault();

    if(!validarForm(form)){
      toast.error("Complete los datos");
      return;
    }

    addDoc(collection(db, "PagosRecurrentes"), form).then(() => {
      toast.success("Se agregó el pago con éxito");
      navigate(-1);
    }).catch((error)=>{
      toast.error("Error al agregar el pago");
      console.log(error);
    })
  }

  const validarForm = (form: Pago): boolean =>{
    if(!form.nombre) return false;
    if(!form.idUsuario) return false;
    if(!form.cantidad || form.cantidad <= 0) return false;
    if(form.periodicidad === "Personalizada"){
      if(!form.diasPersonalizada || form.diasPersonalizada <= 0 ) return false;
    }
    if(!form.correo) return false;
    if(!form.ultimoPago) return false;
    if(form.diasLimitePago < 0) return false;
    if(form.diasAntesNotificacion < 0 ) return false;
    return true;
  }


  return (
    <PagoFormComponent 
      form={form}
      title='Agregar Pago' 
      handleChange={handleChange} 
      handleSubmit={handleSubmit}/>
  )
}
