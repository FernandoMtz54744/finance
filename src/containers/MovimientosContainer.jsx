import React, { useEffect, useState } from 'react'
import Movimientos from '../pages/tarjetas/Movimientos'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { useParams } from 'react-router-dom';
import AgregarDocumento from '../pages/tarjetas/AgregarDocumento';

export default function MovimientosContainer() {
  const { idPeriodo } = useParams();
  const [movimientos, setMovimientos] = useState([]);
  const formInicial = {fecha:"",cantidad: "",motivo: ""}
  const [formAbono, setFormAbono] = useState(formInicial)
  const [formCargo, setFormCargo] = useState(formInicial)
  const [modalDocumento, setModalDocument] = useState(false);
  const [linkDocumento, setLinkDocumento] = useState("");

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
    return ()=> unsuscribe();
  }, [idPeriodo])

  const handleChangeAbono = (e) =>{
    setFormAbono({...formAbono, [e.target.name]: e.target.value})
  }

  const handleChangeCargo = (e) =>{
    setFormCargo({...formCargo, [e.target.name]: e.target.value})
  }

  const agregaAbono = ()=>{
    const data = {
      ...formAbono,
      id: Date.now(),
      cantidad: Number(formAbono.cantidad),
      tipo: "abono"
    }
    setMovimientos([...movimientos, data]);
    setFormAbono(formInicial)
  }

  const agregaCargo = ()=>{
    const data = {
      ...formCargo,
      id: Date.now(),
      cantidad: Number(formCargo.cantidad),
      tipo: "cargo"
    }
    setMovimientos([...movimientos, data]);
    setFormCargo(formInicial);
  }

  const eliminaMovimiento = (id) =>{
    const data = movimientos.filter(movimiento => movimiento.id != id);
    setMovimientos(data);
  }

  const actualizaMovimientos = ()=>{
    const documentoRef = doc(db, "Movimientos", idPeriodo);
    const data = {
      idPeriodo: idPeriodo,
      movimientos: movimientos
    }
    setDoc(documentoRef, data, {merge: true}).then((responde)=>{
      alert("Movimientos guardados");
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

  return (
    <>
      <Movimientos movimientos={movimientos} 
      formAbono={formAbono} formCargo={formCargo} 
      handleChangeAbono={handleChangeAbono} handleChangeCargo={handleChangeCargo}
      agregaAbono={agregaAbono} agregaCargo={agregaCargo}
      actualizaMovimientos={actualizaMovimientos}
      eliminaMovimiento = {eliminaMovimiento}
      toggleModal={toggleModal}
      />
      {modalDocumento?(
        <>
          <AgregarDocumento linkDocumento={linkDocumento} handleLinkDocumento={handleLinkDocumento} agregaDocumento={agregaDocumento}/>
          <div className="overlay"></div>
        </>
        ):
        ("")
      }
    </>
  )
}
