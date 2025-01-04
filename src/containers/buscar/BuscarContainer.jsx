import React, { useEffect, useRef, useState } from 'react'
import Buscar from '../../pages/buscar/Buscar'
import "../../styles/buscar.css"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DateTime } from 'luxon';

export default function BuscarContainer() {
    
    const params = useParams();
    const [formFiltros, setFormFiltros] = useState({fechaInicio:"", fechaFin:"", efectivo: false, palabra:"", tarjeta: ""});
    const movimientos = useRef([]);
    const [movimientosFiltered, setMovientosFiltered] = useState([]); //Movimientos con los filtros
    const [tarjetas, setTarjetas] = useState([]);
    const [total, setTotal] = useState({totalAbono: 0, totalCargo: 0, totalPeriodo: 0});

    useEffect(()=>{
        const cargaMovimientos = async ()=>{
            try{
                const tarjetasTemp = [];
                const idPeriodos = [];
                const periodosTemp = [];
                //Se consultan sus tarjetas
                const snapshotTarjetas = await getDocs(query(collection(db, "Tarjetas"), where("idUsuario", "==", params.idUsuario)));
                snapshotTarjetas.docs.forEach(tarjeta =>{
                    tarjetasTemp.push({...tarjeta.data(), idTarjeta: tarjeta.id})
                })
                setTarjetas(tarjetasTemp);
                 //Se consultan los id de los periodos del usuario
                 const snapshotPeriodos = await getDocs(query(collection(db, "Periodos"), where("idUsuario", "==", params.idUsuario)));
                 snapshotPeriodos.docs.forEach(periodo =>{
                    periodosTemp.push({...periodo.data(), idPeriodo: periodo.id})
                    idPeriodos.push(periodo.id);
                 })
                //Se consultan los movimientos
                const snapshotMovimientos = await getDocs(query(collection(db, "Movimientos"), where("idPeriodo", "in", idPeriodos)));
                snapshotMovimientos.docs.forEach(movimientoJSON =>{
                    movimientoJSON.data().movimientos.forEach(movimiento =>{
                        const data = {
                            ...movimiento,
                            idPeriodo: movimientoJSON.data().idPeriodo,
                            idTarjeta: periodosTemp.find(periodo => periodo.idPeriodo === movimientoJSON.data().idPeriodo).idTarjeta
                        }
                        movimientos.current.push(data);
                    })
                    
                })
            }catch(error){
                toast.error("Error al consultar los datos");
                console.log(error);
            }
        }
        cargaMovimientos();
    }, [])

    useEffect(()=>{
        let movimientosFiltrados = movimientos.current;
        if(formFiltros.fechaInicio){
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => 
                DateTime.fromISO(movimiento.fecha) >= DateTime.fromISO(formFiltros.fechaInicio)
            )
        }
        if(formFiltros.fechaFin){
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => 
                DateTime.fromISO(movimiento.fecha) <= DateTime.fromISO(formFiltros.fechaFin)
            )
        }
        if(formFiltros.efectivo){
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.isEfectivo)
        }
        if(formFiltros.palabra){
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.motivo.toUpperCase().includes(formFiltros.palabra.toUpperCase()))
        }
        if(formFiltros.tarjeta){
            movimientosFiltrados = movimientosFiltrados.filter(movimiento => movimiento.idTarjeta === formFiltros.tarjeta)
        }

        setMovientosFiltered(movimientosFiltrados)
        setTotal(calculaTotal(movimientosFiltrados))
    }, [formFiltros])

    const handleChange = (e)=>{
        if(e.target.type === "checkbox"){
            setFormFiltros({...formFiltros, [e.target.name]:e.target.checked})
        }else{
            setFormFiltros({...formFiltros, [e.target.name]:e.target.value})
        }
    }

    const borrarFiltros = ()=>{
        setMovientosFiltered([]);
        setFormFiltros({fechaInicio:"", fechaFin:"", efectivo: false, palabra:"", tarjeta: "All"});
    }

    const calculaTotal = (movimientos)=>{
        let total = {};
        if(movimientos){
            const totalAbono = movimientos.filter(movimiento => movimiento.tipo === "abono").reduce((suma, actual) => suma + actual.cantidad, 0);
            const totalCargo = movimientos.filter(movimiento => movimiento.tipo === "cargo").reduce((suma, actual) => suma + actual.cantidad, 0);
            const totalPeriodo = Math.round((Number(totalAbono)-Number(totalCargo)) * 100 ) / 100;
            total = {
              totalAbono: totalAbono,
              totalCargo: totalCargo,
              totalPeriodo: totalPeriodo,
            }
        }else{
            total = {
                totalAbono: 0,
                totalCargo: 0,
                totalPeriodo: 0,
            }
        }
        return total;
    }


  return (
    <Buscar tarjetas={tarjetas} 
    movimientosFiltered={movimientosFiltered} 
    handleChange={handleChange}
    formFiltros={formFiltros}
    borrarFiltros={borrarFiltros}
    total={total}/>
  )
}
