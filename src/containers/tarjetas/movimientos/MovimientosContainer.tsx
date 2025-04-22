import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Movimientos from '@/pages/tarjetas/movimientos/Movimientos';
import { db } from '@/firebase/firebase.config';
import { Movimiento } from '@/interfaces/Movimiento';
import { Periodo } from '@/interfaces/Periodo';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { MovimientoViewModel } from '@/interfaces/MovimientoViewModel';

export default function MovimientosContainer() {
  const {periodo, tarjeta} = useLocation().state as {periodo: Periodo, tarjeta: Tarjeta};
  const [formMovimiento, setFormMovimiento] = useState<Movimiento>({fecha: periodo.fechaInicio, cantidad: 0, motivo: "", isEfectivo: false, tipo: ""});
  const [movimientoViewModel, setMovimientoViewModel] = useState<MovimientoViewModel>({
    movimientos: [],
    linkDocumento: "",
    total:{totalAbono:0, totalCargo:0, totalPeriodo:0,saldoFinal:0}
  })

  //Consulta los movimientos
  useEffect(()=>{
    const unsuscribe =  onSnapshot(doc(db, "Movimientos", periodo.id), (snapshot) =>{
      if(snapshot.exists()){
        setMovimientoViewModel({
          ...movimientoViewModel,
          movimientos: (snapshot.data().movimientos ?? []).map((movimiento: any) => ({
            cantidad: movimiento.cantidad,
            fecha: movimiento.fecha.toDate(),
            isEfectivo: movimiento.isEfectivo,
            motivo: movimiento.motivo,
            tipo: movimiento.tipo,
            id: movimiento.id
          })),
          linkDocumento: snapshot.data().documento
        })
      } 
    },(error) =>{
      toast.error("Error al consultar los movimientos");
      console.log(error)
    });
    return ()=> unsuscribe();
  }, [periodo]);

  //Actualiza los totales
  useEffect(()=>{
    if(movimientoViewModel.movimientos){
      const totalAbono = movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "abono").reduce((suma, actual) => suma + actual.cantidad, 0);
      const totalCargo = movimientoViewModel.movimientos.filter(movimiento => movimiento.tipo === "cargo").reduce((suma, actual) => suma + actual.cantidad, 0);
      const totalPeriodo = Math.round((Number(totalAbono)-Number(totalCargo)) * 100 ) / 100;
      const saldoFinal = Math.round((Number(periodo.saldoInicial) + Number(totalPeriodo)) * 100) / 100;
      const total: MovimientoViewModel["total"] = {
        totalAbono: totalAbono,
        totalCargo: totalCargo,
        totalPeriodo: totalPeriodo,              
        saldoFinal: saldoFinal
      }
      setMovimientoViewModel({...movimientoViewModel, total: total})
    }
  }, [movimientoViewModel.movimientos]);

  const movimientosUtils = {
    //Agrega el movimiento al arreglo de movimientos
    agregaMovimiento: (e: any)=>{
      e.preventDefault();
      const movimiento: Movimiento = {
        id: Date.now().toString(),
        fecha: formMovimiento.fecha,
        cantidad: Number(Math.abs(formMovimiento.cantidad)),
        motivo: formMovimiento.motivo,
        isEfectivo: formMovimiento.isEfectivo,
        tipo: formMovimiento.cantidad < 0 ? "cargo" : "abono"
      }
      if(!movimientosUtils.validaMovimiento(movimiento)) return;
      setMovimientoViewModel({...movimientoViewModel, movimientos: [...movimientoViewModel.movimientos, movimiento]});
      setFormMovimiento({fecha: formMovimiento.fecha, cantidad: 0, motivo: "", isEfectivo: false, tipo: ""});
    },
    //Elimina el movimiento del arreglo de movimientos
    eliminaMovimiento: (id: string) =>{
      setMovimientoViewModel({...movimientoViewModel, movimientos: movimientoViewModel.movimientos.filter(movimiento => movimiento.id !== id)})
    },
    //Actualiza los movimientos en la BD
    actualizaMovimientos: async ()=>{
      try{
        const movimientos = { idPeriodo: periodo.id, movimientos: movimientoViewModel.movimientos}
        await setDoc(doc(db, "Movimientos", periodo.id), movimientos, {merge: true});
        const data = {
          saldoFinal: movimientoViewModel.total.saldoFinal,
          totalPeriodo: movimientoViewModel.total.totalPeriodo,
          pagado: movimientoViewModel.total.totalAbono
        }
        await setDoc(doc(db, "Periodos", periodo.id), data, {merge: true});
        toast.success("Movimientos actualizados");
      }catch(error){
        console.log(error);
        toast.error("Error al actualizar los movimientos")
      }
    },
    //Valida movimiento
    validaMovimiento: (movimiento: Movimiento)=>{
      if(movimiento.cantidad === 0){
        toast.error("Agregue una cantidad");
        return false;
      }
      if(!movimiento.motivo){
        toast.error("Agregue un motivo");
        return false;
      } 
      return true;
    }
  }

  /*  MANEJADORES DE EVENTOS */
  const handlers = {
    onChange: (e: any)=>{
      if(e.target.type === "checkbox"){
        setFormMovimiento({...formMovimiento, [e.target.name]:e.target.checked})
      }else{
        setFormMovimiento({...formMovimiento, [e.target.name]:e.target.value})
      }
    },

    keyDown: (e: any) =>{    
      if(e.key === 'Enter'){
        if(e.target.type === "checkbox"){
          e.preventDefault()
          setFormMovimiento({...formMovimiento, isEfectivo: !formMovimiento.isEfectivo})
        }else{
          movimientosUtils.agregaMovimiento(e);
        }
      }
    }
  }
  
  return (
    <Movimientos 
      periodo = {periodo}
      tarjeta={tarjeta}
      formMovimiento={formMovimiento} 
      movimientoViewModel = {movimientoViewModel}
      movimientosUtils = {movimientosUtils}
      handlers = {handlers}
    />
  )
}
