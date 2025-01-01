import React, { useEffect, useState } from 'react'
import PagosConcurrentes from '../../pages/pagosConcurrentes/PagosConcurrentes'
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useParams } from 'react-router-dom';

export default function PagosConcurrentesContainer() {
  const params= useParams();
  const [pagos, setPagos] = useState([]);
  
  useEffect(()=>{
    const queryBD = query(collection(db, "PagosConcurrentes"), where("idUsuario", "==", params.idUsuario))
    const unsuscribe =  onSnapshot(queryBD, (snapshot) =>{
        const pagosTemp = [];
        snapshot.docs.forEach(pago =>{
          pagosTemp.push({...pago.data(), idPago: pago.id});
        });
        setPagos(pagosTemp);
    }, (error) =>{
      alert("Error al consultar los movimientos");
      console.log(error)
    });
    return ()=> unsuscribe();
  }, []);

  const actualizaPago = (idPago, isPagado)=>{
    if(isPagado){
      Swal.fire({
        icon: 'error',
        title: 'No se puede actualizar el pago',
        text: 'Ya realizó previamente el pago y no se puede deshacer, espere al siguiente periodo y se habilitará automáticamente',
        confirmButtonText: 'Entendido',
      })
    }else{
      Swal.fire({
        title: 'Cambiar pago',
        text: "Esta acción cambiará el estado del pago.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isConfirmed) {
          actualizaPagoBD(idPago)
        }
      }); 
    }
  }

  const actualizaPagoBD = (idPago)=>{
    updateDoc(doc(db, "PagosConcurrentes", idPago), {pagado: true}).then(() => {
      toast.success("Se modificó el pago con éxito")
    }
  ).catch((error)=>{
    toast.error("Error al modificar el pago")
    console.log(error)
  })
  }


  return (
    <PagosConcurrentes pagos={pagos} actualizaPago={actualizaPago}/>
  )
}
