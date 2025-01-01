import React, { useEffect, useState } from 'react'
import AgregaEfectivo from '../../pages/efectivo/AgregaEfectivo'
import MuestraEfectivo from '../../pages/efectivo/MuestraEfectivo'
import "../../styles/efectivo.css"
import { DateTime } from 'luxon'
import { useParams } from 'react-router-dom'
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase.config'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function EfectivoContainer() {

    const params = useParams();
    const [form, setForm] = useState({cincuenta:"", cien: "", doscientos:"", quinientos:""});
    const [efectivos, setEfectivos] = useState([]);

    useEffect(()=>{
        const queryBD = query(collection(db, "Efectivo"), where("idUsuario", "==", params.idUsuario))
            const unsuscribe =  onSnapshot(queryBD, (snapshot) =>{
                const efectivosTemp = [];
                snapshot.docs.forEach(efectivo =>{
                    efectivosTemp.push({...efectivo.data(), idEfectivo: efectivo.id});
                });
                setEfectivos(efectivosTemp);
            }, (error) =>{
              toast.error("Error al consultar el efectivo");
              console.log(error)
            });
            return ()=> unsuscribe();
    }, [])

    const handleChange = (e)=>{
      setForm({...form, [e.target.name]: e.target.value});
    }

    const agregarEfectivo = (e)=>{
      Swal.fire({
        title: 'Agregar efectivo',
        text: "¿Desea agregar el registro de efectivo?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isConfirmed) {
          const data = Object.keys(form).reduce((nuevoJson, clave)=>{
            nuevoJson[clave] = Number(form[clave]);
            return nuevoJson;
          }, {});  
        
          data.fecha = DateTime.local().toMillis();
          data.idUsuario = params.idUsuario;
           
          addDoc(collection(db, "Efectivo"), data).then(() => {
              toast.success("Se agregó el efectivo con éxito");
            }
          ).catch((error)=>{
            toast.error("Ocurrió un error al agregar el efectivo")
            console.log(error)
          })
          setForm({cincuenta:0, cien: 0, doscientos:0, quinientos:0});
        }
      }); 
    }

    const sumaEfectivo = (cincuenta, cien, doscientos, quinientos)=>{
        return (cincuenta*50)+(cien*100)+(doscientos*200) + (quinientos*500);
    }

  return (
    <div>
      <center className='title'>Agrega efectivo</center>
        <AgregaEfectivo handleChange={handleChange} form={form} agregarEfectivo={agregarEfectivo} sumaEfectivo={sumaEfectivo}/>
        <center className='title muestra-efectivo-title'>Historial de efectivo</center>
        <MuestraEfectivo efectivos={efectivos} sumaEfectivo={sumaEfectivo}/>
    </div>
  )
}
