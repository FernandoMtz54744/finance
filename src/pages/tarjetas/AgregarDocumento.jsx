import React from 'react'
import "../../styles/agregaDocumento.css"
import { Link } from 'react-router-dom'

export default function AgregarDocumento({linkDocumento, handleLinkDocumento, agregaDocumento}) {
  return (
    <div className="modal-documento modal-active" >
        <div>
            <div className='modal-title'>
                Agregue su documento
            </div>
            <div className='link-container-doc'>
                <input type="text" name='link' className='input-doc' value={linkDocumento} onChange={handleLinkDocumento}/>
                <button className='add-doc-button' onClick={agregaDocumento}>Agregar</button>
            </div>
        </div>
        <div className='consultar-doc-container'>
            <Link className='consultar-doc-button' to={linkDocumento} target='_blank'>Consultar documento</Link>
            <button className='consultar-doc-button'>Subir documento</button>
        </div>
    </div>
  )
}
