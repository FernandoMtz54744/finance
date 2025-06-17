import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebase.config";
import { Movimiento } from "@/interfaces/Movimiento";
import { Periodo } from "@/interfaces/Periodo";
import { Rendimiento } from "@/interfaces/Rendimiento";
import { Tarjeta } from "@/interfaces/Tarjeta";
import Rendimientos from "@/pages/rendimientos/Rendimientos";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";

export default function RendimientosContainer() {
    const params = useParams();
    const location = useLocation();
    const [rendimientos, setRendimientos] = useState<Rendimiento[]>([]);

    useEffect(()=>{
        const obtenerRendimientos = async () => {
            const periodos: Periodo[] = location.state.periodos;
            const tarjetas: Tarjeta[] = location.state.tarjetas;
            //Se buscan los rendimientos
            const rendimientos: Rendimiento[] = [];
            const movimientosDocs = (await getDocs(query(collection(db, "Movimientos"), where("idUsuario", "==", params.idUsuario)))).docs;
            movimientosDocs.forEach(movimientoDocument => {
                const movimientoDoc = movimientoDocument.data();
                const movimientos = movimientoDoc.movimientos as Movimiento[];
                if(Array.isArray(movimientos)){
                    rendimientos.push(...(movimientos.filter(movimiento => movimiento.isRendimiento).map(rendimiento => {
                        const periodo: Periodo | undefined = periodos.find(periodo => periodo.id === movimientoDoc.idPeriodo);
                        if(!periodo) throw new Error("No se encontró el periodo");
                        const tarjeta: Tarjeta | undefined = tarjetas.find(tarjeta => tarjeta.id === periodo.idTarjeta);
                        if(!tarjeta) throw new Error("No se encontró la tarjeta");
                        return {
                            id: rendimiento.id,
                            cantidad: rendimiento.cantidad,
                            fecha: (rendimiento.fecha as unknown as Timestamp).toDate(), //Fecha de firebase a Date de JS
                            motivo: rendimiento.motivo,
                            idPeriodo: periodo.id,
                            nombrePeriodo: periodo.nombre,
                            idTarjeta: tarjeta.id,
                            nombreTarjeta: tarjeta.nombre
                        }
                    })));   
                }
            });
            console.log(rendimientos);
            
            setRendimientos(rendimientos);
        }

        try{
            obtenerRendimientos();
        }catch(error){
            console.log(error);
            toast.error("Error al obtener los rendimientos")
        }


    }, []);


  return (
    <Rendimientos rendimientos={rendimientos}/>
  )
}
