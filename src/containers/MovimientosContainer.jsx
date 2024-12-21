import React, { useEffect, useState } from 'react'
import Movimientos from '../pages/tarjetas/Movimientos'
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useLocation, useParams } from 'react-router-dom';
import AgregarDocumento from '../pages/tarjetas/AgregarDocumento';
import toast from 'react-hot-toast';

export default function MovimientosContainer() {
  const { idPeriodo } = useParams();
  const {periodo} = useLocation().state;
  const [movimientos, setMovimientos] = useState([]);
  const [formMovimiento, setFormMovimiento] = useState({fecha:"",cantidad: "",motivo: "", isEfectivo: false});
  const [modalDocumento, setModalDocument] = useState(false);
  const [linkDocumento, setLinkDocumento] = useState("");
  const [total, setTotal] = useState({totalAbono: 0, totalCargo: 0, totalPeriodo: 0, saldoFinal: 0});

  useEffect(()=>{
      const unsuscribe =  onSnapshot(doc(db, "Movimientos", idPeriodo), (snapshot) =>{
        if(snapshot.exists()){
          const movimientos = snapshot.data().movimientos;
          if(movimientos){
            setMovimientos(movimientos);
          }
          setLinkDocumento(snapshot.data().documento)
        } 
      }, (error) =>{
        alert("Error al consultar los movimientos");
        console.log(error)
      });
      setFormMovimiento({fecha:periodo.fechaInicio,cantidad: "",motivo: "", isEfectivo:false})
      
      return ()=> unsuscribe();
  }, [idPeriodo, periodo])

  useEffect(()=>{
    if(movimientos){
      const totalAbono = movimientos.filter(movimiento => movimiento.tipo === "abono").reduce((suma, actual) => suma + actual.cantidad, 0);
      const totalCargo = movimientos.filter(movimiento => movimiento.tipo === "cargo").reduce((suma, actual) => suma + actual.cantidad, 0);
      const totalPeriodo = Math.round((Number(totalAbono)-Number(totalCargo)) * 100 ) / 100;
      const saldoFinal = Math.round((Number(periodo.saldoInicial) + Number(totalPeriodo)) * 100) / 100;
      const total = {
        totalAbono: totalAbono,
        totalCargo: totalCargo,
        totalPeriodo: totalPeriodo,
        saldoFinal: saldoFinal
      }
      setTotal(total);
    }
  }, [movimientos])

  const agregaMovimiento = ()=>{
    let tipo;
    if(formMovimiento.cantidad < 0){
      tipo = "cargo";
    }else{
      tipo = "abono";
    }
    const data = {
      ...formMovimiento,
      cantidad: Number(Math.abs(formMovimiento.cantidad)),
      tipo: tipo,
      id: Date.now()
    }
    setMovimientos([...movimientos, data]);
    setFormMovimiento({...formMovimiento, cantidad: "",motivo: "", isEfectivo: false})
    
  }


  const handleChangeForm = (e)=>{
    if(e.target.type === "checkbox"){
      setFormMovimiento({...formMovimiento, [e.target.name]:e.target.checked})
    }else{
      setFormMovimiento({...formMovimiento, [e.target.name]:e.target.value})
    }
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
      toast.success("Movimientos guardados");
      actualizaSaldoPeriodo();
    }).catch((error)=>{
      toast.error("Error al guardar los movimientos");
      console.log(error);
    })

    
  }

  const actualizaSaldoPeriodo = ()=>{
    const documentoRef = doc(db, "Periodos", idPeriodo);
    const data = {
      saldoFinal: total.saldoFinal,
      totalPeriodo: total.totalPeriodo
    }
    setDoc(documentoRef, data, {merge: true}).then((responde)=>{
      toast.success("Saldo final actualizado");
    }).catch((error)=>{
      toast.error("Error al actualizar el saldo final");
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
      toast.success("Documento guardado");
      toggleModal();
    }).catch((error)=>{
      toast.error("Error al agregar el documento");
    })
  }

  const agregaDocumento = ()=>{
    actualizaLinkDocumentoBD(linkDocumento);
    setModalDocument(false);
  }

  const subirDocumento = ()=>{

  }

  const handleKeyDownForm = (e) =>{
    if(e.key === 'Enter') {
      e.preventDefault();
      if(e.target.type === "checkbox"){
        setFormMovimiento({...formMovimiento, [e.target.name]:!formMovimiento.isEfectivo})
      }else{
        agregaMovimiento();
      }
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
      linkDocumento={linkDocumento}
      />
      {modalDocumento?(
        <>
          <AgregarDocumento  handleLinkDocumento={handleLinkDocumento} agregaDocumento={agregaDocumento} linkDocumento={linkDocumento}/>
          <div className="overlay" onClick={()=>setModalDocument(false)}></div>
        </>
        ):
        ("")
      }
    </>
  )
}
