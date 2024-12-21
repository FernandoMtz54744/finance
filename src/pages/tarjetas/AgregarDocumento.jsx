import React from 'react'
import "../../styles/agregaDocumento.css"

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
    </div>
  )
}
