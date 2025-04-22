import { useEffect, useState } from 'react'
import AgregaEfectivo from '../../pages/efectivo/AgregaEfectivo'
import MuestraEfectivo from '../../pages/efectivo/MuestraEfectivo'
import { DateTime } from 'luxon'
import { useParams } from 'react-router-dom'
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { Efectivo } from '@/interfaces/Efectivo'

export default function EfectivoContainer() {
  const params = useParams();
  const [form, setForm] = useState<Efectivo>({idUsuario: "" ,cincuenta: 0, cien: 0, doscientos: 0, quinientos: 0});
  const [efectivos, setEfectivos] = useState<Efectivo[]>([]);

  useEffect(()=>{
    const queryBD = query(collection(db, "Efectivo"), where("idUsuario", "==", params.idUsuario));
    const unsuscribe = onSnapshot(queryBD, (snapshot) =>{
      setEfectivos(snapshot.docs.map(efectivo => (
        {...efectivo.data(), 
          id: efectivo.id,
          fecha: efectivo.data().fecha.toDate()
        } as Efectivo)));
    },(error) => {
      toast.error("Error al consultar el efectivo");
      console.log(error)
    });
    return () => unsuscribe();
  }, []);

  const handleChange = (e: any)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }

  const agregarEfectivo = (e: any): void =>{
    Swal.fire({
      title: 'Agregar efectivo',
      text: "¿Desea agregar el registro de efectivo?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        const data: Efectivo = {
          idUsuario: params.idUsuario!,
          cincuenta: form.cincuenta ?? 0,
          cien: form.cien ?? 0,
          doscientos: form.doscientos ?? 0,
          quinientos: form.quinientos ?? 0,
          fecha: DateTime.local().toJSDate()
        }

        if(!validaForm(data)){
          toast.error("Ingrese los datos")
        }
      
        addDoc(collection(db, "Efectivo"), data).then(() => {
          toast.success("Se agregó el efectivo con éxito");
        }
        ).catch((error)=>{
          toast.error("Ocurrió un error al agregar el efectivo")
          console.log(error)
        })
        setForm({...form, cincuenta: 0, cien: 0, doscientos: 0, quinientos: 0});
      }
    }); 
  }

  const sumaEfectivo = (efectivo: Efectivo): number =>{
    return (efectivo.cincuenta * 50) + (efectivo.cien * 100) + (efectivo.doscientos * 200) + (efectivo.quinientos * 500);
  }

  const validaForm = (efectivo: Efectivo): boolean => {
    if(!efectivo.fecha) return false;
    if(!efectivo.idUsuario) return false;
    return true;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='text-3xl my-6'>EFECTIVO</div>
      <AgregaEfectivo form={form} handleChange={handleChange} agregarEfectivo={agregarEfectivo} sumaEfectivo={sumaEfectivo}/>
      <div className='text-3xl my-8'>HISTORIAL DE EFECTIVO</div>
      <MuestraEfectivo efectivos={efectivos} sumaEfectivo={sumaEfectivo}/>
    </div>
  )
}
