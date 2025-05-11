import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '@/firebase/firebase.config';
import { Movimiento } from '@/interfaces/Movimiento';
import { Periodo } from '@/interfaces/Periodo';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { MovimientoViewModel } from '@/interfaces/MovimientoViewModel';
import { MovimientoForm } from '@/interfaces/forms/MovimientoForm';
import MovimientoFormComponent from '@/pages/tarjetas/movimientos/MovimientoFormComponent';
import MovimientosHeader from '@/pages/tarjetas/movimientos/MovimientosHeader';
import MovimientoList from '@/pages/tarjetas/movimientos/MovimientoList';

export default function MovimientosContainer() {
  const {periodo, tarjeta} = useLocation().state as {periodo: Periodo, tarjeta: Tarjeta};
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
            id: movimiento.id,
            cantidad: movimiento.cantidad,
            fecha: movimiento.fecha.toDate(),
            isEfectivo: movimiento.isEfectivo,
            motivo: movimiento.motivo,
            tipo: movimiento.tipo
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

  const onSubmit = (data: MovimientoForm)=>{
    const movimiento: Movimiento = {
      id: Date.now().toString(),
      fecha: data.fecha,
      cantidad: Number(Math.abs(data.cantidad)),
      motivo: data.motivo,
      isEfectivo: data.isEfectivo,
      tipo: data.cantidad < 0 ? "cargo" : "abono"
    }
    setMovimientoViewModel({...movimientoViewModel, movimientos: [...movimientoViewModel.movimientos, movimiento]});
  }

  const eliminaMovimiento = (id: string) =>{
    setMovimientoViewModel({...movimientoViewModel, movimientos: movimientoViewModel.movimientos.filter(movimiento => movimiento.id !== id)})
  }

  const actualizaMovimientos = async ()=>{
    try{
      const movimientos = { idPeriodo: periodo.id, movimientos: movimientoViewModel.movimientos}
      await setDoc(doc(db, "Movimientos", periodo.id), movimientos, {merge: true});
      const data = {
        saldoFinal: movimientoViewModel.total.saldoFinal,
        totalPeriodo: movimientoViewModel.total.totalPeriodo,
        ...(tarjeta.tipo === 'Crédito' && {
        liquidado: movimientoViewModel.total.totalAbono})
      }
      await setDoc(doc(db, "Periodos", periodo.id), data, {merge: true});
      toast.success("Movimientos actualizados");
    }catch(error){
      console.log(error);
      toast.error("Error al actualizar los movimientos")
    }
  }
  
  return (
    <div className='flex flex-col justify-center items-center'>
      <MovimientosHeader tarjeta={tarjeta} periodo={periodo} movimientoViewModel={movimientoViewModel} />
      <MovimientoFormComponent tarjeta={tarjeta} periodo={periodo} onSubmit={onSubmit}/>
      <MovimientoList tarjeta={tarjeta} periodo={periodo} movimientoViewModel={movimientoViewModel}
        eliminaMovimiento = {eliminaMovimiento}
        actualizaMovimientos = {actualizaMovimientos}
      />
    </div>
  )
}
