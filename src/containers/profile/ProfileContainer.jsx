import React, { useEffect, useState } from 'react'
import Profile from '../../pages/profile/Profile'
import { useAuth } from '../../context/AuthContext';
import "../../styles/profile.css"
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

export default function ProfileContainer() {
    const context = useAuth();
    const [efectivo, setEfectivo] = useState({});
    const [totalHistorial, setTotalHistorial] = useState([]);
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

        const queryBDTotal = query(collection(db, "TotalHistorial"), where("idUsuario", "==", params.idUsuario))
        const unsuscribe = onSnapshot(queryBDTotal, (snapshot) =>{
            const totalHistorialTemp = [];
            snapshot.docs.forEach(total =>{
              totalHistorialTemp.push({...total.data(), idTotal: total.id});
            });
            setTotalHistorial(totalHistorialTemp);
          },(error) =>{
          toast.error("Error al consultar el total");
          console.log(error)
          });

        return ()=> unsuscribe();
    }, [])

    const obtenerSaldoUltimoPeriodo = (periodos, idTarjeta)=>{
      const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
      if(periodosTarjeta.length === 0){
        return 0;
      }else{
        return periodosTarjeta.sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte)))[0].saldoFinal;
      }
    }

    const obtenerSaldoTotal = (periodos, idTarjeta)=>{
      const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
      const saldoTotal = periodosTarjeta.reduce((total, periodo)=>{
          return total + periodo.saldoFinal;
      }, 0)
      return saldoTotal;
    }

    const sumaEfectivo = (cincuenta, cien, doscientos, quinientos)=>{
      return (cincuenta*50)+(cien*100)+(doscientos*200) + (quinientos*500);
    }

    const obtieneTotal = (accounts, efectivo)=>{
      let total = 0;
      accounts.map((account) =>{
          if(account.tipo === "Débito"){
              total+= Number(obtenerSaldoUltimoPeriodo(context.periodos, account.id));
          }else{
              total+= Number(obtenerSaldoTotal(context.periodos, account.id));
          }
      })
      total+= Number(sumaEfectivo(efectivo.cincuenta,efectivo.cien,efectivo.doscientos,efectivo.quinientos));
      return total;
    }

    const tomarSnapshotTotal = ()=>{
      Swal.fire({
              title: 'Guardar en historial',
              text: "¿Desea guardar este total en el historial?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, guardar',
              cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isConfirmed) {
          const total = obtieneTotal(context.tarjetas, efectivo);
          const data = {
            idUsuario: params.idUsuario,
            total: total,
            fecha: DateTime.local().toMillis()
          }
          addDoc(collection(db, "TotalHistorial"), data).then(() => {
            toast.success("Se agregó el total en el historial con éxito");
          }
        ).catch((error)=>{
          toast.error("Ocurrió un error al agregar el total")
          console.log(error)
        })
        }
      }); 
    }

  return (
    <Profile accounts={context.tarjetas} periodos={context.periodos} efectivo={efectivo} totalHistorial={totalHistorial}
      obtenerSaldoUltimoPeriodo={obtenerSaldoUltimoPeriodo}
      obtenerSaldoTotal={obtenerSaldoTotal}
      sumaEfectivo={sumaEfectivo}
      obtieneTotal={obtieneTotal}
      tomarSnapshotTotal={tomarSnapshotTotal}
    />
  )
}
