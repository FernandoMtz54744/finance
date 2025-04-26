import { useEffect, useState } from 'react'
import Profile from '@/pages/profile/Profile'
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';
import { Efectivo } from '@/interfaces/Efectivo';
import { TotalHistorial } from '@/interfaces/TotalHistorial';
import * as Utils from '@/utils/utils'
import { Tarjeta } from '@/interfaces/Tarjeta';

export default function ProfileContainer() {
  const context = useAuth();
  const params = useParams();
  const [efectivo, setEfectivo] = useState<Efectivo>({
    idUsuario: params.idUsuario ?? "",
    cien: 0,
    cincuenta: 0,
    doscientos: 0,
    quinientos: 0,

  });
  const [totalHistorial, setTotalHistorial] = useState<TotalHistorial[]>([]);

  useEffect(()=>{
    // Consulta el efectivo actual
    const queryEfectivo = query(collection(db, "Efectivo"), where("idUsuario", "==", params.idUsuario), orderBy("fecha", "desc"), limit(1))
      getDocs(queryEfectivo).then((snapshot) =>{
        if(!snapshot.empty){
          const data = snapshot.docs[0].data();
          setEfectivo({
            id: snapshot.docs[0].id,
            idUsuario: data.idUsuario,
            fecha: data.fecha.toDate(),
            cincuenta: data.cincuenta,
            cien: data.cien,
            doscientos: data.doscientos,
            quinientos: data.quinientos,
          });
        }else{
          toast.error("No hay datos de efectivo")
        }
      }, (error) =>{
        toast.error("Error al consultar el efectivo");
        console.log(error)
      }
    );

    // Consulta el historial de totales
    const queryHistorial = query(collection(db, "TotalHistorial"), where("idUsuario", "==", params.idUsuario));
    const unsuscribe = onSnapshot(queryHistorial, snapshot => {
      setTotalHistorial(snapshot.docs.map(total =>{
        const data = total.data();
        return {
          idUsuario: data.idUsuario,
          total: data.total,
          fecha: data.fecha.toDate(),
          efectivo: data.efectivo,
          tarjetas: data.tarjetas
        }
      }));
    }, (error) =>{
      toast.error("Error al consultar el historial");
      console.log(error)
    });

    return ()=> unsuscribe();
  }, []);


  const obtieneTotal = (tarjetas: Tarjeta[], efectivo: Efectivo): number =>{
    let total = 0;
    tarjetas.map(tarjeta =>{
      if(tarjeta.tipo === "Débito"){
        total += Number(Utils.obtenerSaldoUltimoPeriodo(context.periodos, tarjeta.id!));
      }else{
        total+= Number(Utils.obtenerSaldoTotal(context.periodos, tarjeta.id!));
      }
    })
    total+= Number(Utils.sumaEfectivo(efectivo));
    return total;
  }

  const guardarHistorial = ()=>{
    Swal.fire({
      title: 'Guardar en historial',
      text: "¿Desea guardar el total actual en el historial?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        const data = saveFinancialSnapshot();
        if(!validaData(data)){
          toast.error("No se pudo guardar el historial, favor de validar los datos");
          console.log(data);
          return;
        }
        addDoc(collection(db, "TotalHistorial"), data).then(() => {
          toast.success("Se agregó el total en el historial con éxito");
        }).catch((error)=>{
          toast.error("Ocurrió un error al agregar el total")
          console.log(error)
        })
      }
    }); 
  };

  const validaData = (data: TotalHistorial): boolean =>{
    if(!data.idUsuario) return false;
    if(!data.fecha) return false;
    return true;
  }

  const saveFinancialSnapshot = (): TotalHistorial =>{
    const data: TotalHistorial = {
        idUsuario: params.idUsuario!,
        fecha: DateTime.local().toJSDate(),
        total: obtieneTotal(context.tarjetas, efectivo!),
        efectivo: Utils.sumaEfectivo(efectivo!),
        tarjetas: context.tarjetas.map(tarjeta =>{
                    return {
                      nombre: `${tarjeta.nombre} ${tarjeta.tipo}`,
                      total: tarjeta.tipo === "Débito"? Utils.obtenerSaldoUltimoPeriodo(context.periodos, tarjeta.id!) : Utils.obtenerSaldoTotal(context.periodos, tarjeta.id!)
                    }
                  })
      };
      return data;
    }

  return (
    <Profile 
      tarjetas={context.tarjetas} 
      periodos={context.periodos} 
      efectivo={efectivo} 
      totalHistorial={totalHistorial}
      obtieneTotal={obtieneTotal}
      guardarHistorial={guardarHistorial}
    />
  )
}
