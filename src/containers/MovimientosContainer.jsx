import React, { useEffect, useState } from 'react'
import Movimientos from '../pages/tarjetas/Movimientos'
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import AgregarDocumento from '../pages/tarjetas/AgregarDocumento';

export default function MovimientosContainer() {
  const { idPeriodo } = useParams();
  const {periodo} = useLocation().state;
  const [movimientos, setMovimientos] = useState([]);
  const [formMovimiento, setFormMovimiento] = useState({abono:{fecha:"",cantidad: "",motivo: "", metodo:"Transferencia"}, cargo:{fecha:"",cantidad: "",motivo: "", metodo:"Transferencia"}})
  const [modalDocumento, setModalDocument] = useState(false);
  const [linkDocumento, setLinkDocumento] = useState("");
  const [total, setTotal] = useState({totalAbono: 0, totalCargo: 0, totalPeriodo: 0, saldoFinal: 0});

  useEffect(()=>{
      const unsuscribe =  onSnapshot(doc(db, "Movimientos", idPeriodo), (snapshot) =>{
        if(snapshot.exists()){
          setMovimientos(snapshot.data().movimientos);
          setLinkDocumento(snapshot.data().documento)
        } 
      }, (error) =>{
        alert("Error al consultar los movimientos");
        console.log(error)
      });
      setFormMovimiento({abono:{fecha:periodo.fechaInicio,cantidad: "",motivo: "", metodo:"Transferencia"}, cargo:{fecha:periodo.fechaInicio,cantidad: "",motivo: "", metodo:"Transferencia"}})
      
      return ()=> unsuscribe();
  }, [idPeriodo, periodo])

  useEffect(()=>{
    const totalAbono = movimientos.filter(movimiento => movimiento.tipo === "abono").reduce((suma, actual) => suma + actual.cantidad, 0);
    const totalCargo = movimientos.filter(movimiento => movimiento.tipo === "cargo").reduce((suma, actual) => suma + actual.cantidad, 0);
    const totalPeriodo = Number(totalAbono)-Number(totalCargo);
    const saldoFinal = Number(periodo.saldoInicial) + Number(totalPeriodo);
    const total = {
      totalAbono: totalAbono,
      totalCargo: totalCargo,
      totalPeriodo: totalPeriodo,
      saldoFinal: saldoFinal
    }
    setTotal(total);
  }, [movimientos])

  const agregaMovimiento = (tipo)=>{
    const data = {
      ...formMovimiento[tipo],
      cantidad: Number(formMovimiento[tipo].cantidad),
      tipo: tipo,
      id: Date.now()
    }
    setMovimientos([...movimientos, data]);
    setFormMovimiento({...formMovimiento, [tipo]:{fecha:periodo.fechaInicio,cantidad: "",motivo: "", tipo:"", metodo:formMovimiento[tipo].metodo}})
    
  }


  const handleChangeForm = (e, tipo)=>{
    setFormMovimiento({...formMovimiento, [tipo]:{...formMovimiento[tipo], [e.target.name]:e.target.value}})
  } 

  const eliminaMovimiento = (id) =>{
    const data = movimientos.filter(movimiento => movimiento.id !== id);
    setMovimientos(data);
  }

  const actualizaMovimientos = ()=>{
    const documentoRef = doc(db, "Movimientos", idPeriodo);
    const data = {
      idPeriodo: idPeriodo,
      movimientos: movimientos,
    }
    setDoc(documentoRef, data, {merge: true}).then((responde)=>{
      alert("Movimientos guardados");
      actualizaSaldoPeriodo();
    }).catch((error)=>{
      alert("Error");
      console.log(error);
    })

    
  }

  const actualizaSaldoPeriodo = ()=>{
    const documentoRef = doc(db, "Periodos", idPeriodo);
    const data = {
      saldoFinal: total.saldoFinal
    }
    setDoc(documentoRef, data, {merge: true}).then((responde)=>{
      alert("Saldo final actualizado");
    }).catch((error)=>{
      alert("Error");
      console.log(error);
    })
  }

  const handleLinkDocumento = (e)=>{
    setLinkDocumento(e.target.value);
  }

  const toggleModal = ()=>{
    setModalDocument(!modalDocumento);
  }

  const actualizaLinkDocumentoBD = (link)=>{
    const documentoRef = doc(db, "Movimientos", idPeriodo);
    const data = {
      documento: link
    }
    setDoc(documentoRef, data, {merge: true}).then((responde)=>{
      alert("Movimientos guardados");
    }).catch((error)=>{
      alert("Error al agregar el documento");
      console.log(error);
    })
  }

  const agregaDocumento = ()=>{
    actualizaLinkDocumentoBD(linkDocumento);
    setModalDocument(false);
  }

  const subirDocumento = ()=>{

  }

  const handleKeyDownForm = (e, tipo) =>{
    if(e.key === 'Enter') {
      e.preventDefault();
      agregaMovimiento(tipo);
    }
  }

  return (
    <>
      <Movimientos movimientos={movimientos}
      formMovimiento={formMovimiento} 
      agregaMovimiento = {agregaMovimiento}
      handleChangeForm = {handleChangeForm}
      handleKeyDownForm = {handleKeyDownForm}
      actualizaMovimientos={actualizaMovimientos}
      eliminaMovimiento = {eliminaMovimiento}
      toggleModal={toggleModal}
      periodo = {periodo}
      total = {total}
      />
      {modalDocumento?(
        <>
          <AgregarDocumento linkDocumento={linkDocumento} handleLinkDocumento={handleLinkDocumento} agregaDocumento={agregaDocumento}/>
          <div className="overlay" onClick={()=>setModalDocument(false)}></div>
        </>
        ):
        ("")
      }
    </>
  )
}
