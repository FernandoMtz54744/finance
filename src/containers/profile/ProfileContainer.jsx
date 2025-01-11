import React, { useEffect, useState } from 'react'
import Profile from '../../pages/profile/Profile'
import { useAuth } from '../../context/AuthContext';
import "../../styles/profile.css"
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function ProfileContainer() {
    const context = useAuth();
    const [efectivo, setEfectivo] = useState({});
    const params = useParams();

    useEffect(()=>{
        const queryBD = query(collection(db, "Efectivo"), where("idUsuario", "==", params.idUsuario), orderBy("fecha", "desc"), limit(1))
        getDocs(queryBD).then((snapshot) =>{
            if(!snapshot.empty){
                setEfectivo(snapshot.docs[0].data());
            }else{
                toast.error("No hay datos de efectivo")
            }
        }, (error) =>{
          toast.error("Error al consultar el efectivo");
          console.log(error)
        });
    }, [])

  return (
    <Profile accounts={context.tarjetas} periodos={context.periodos} efectivo={efectivo}/>
  )
}
