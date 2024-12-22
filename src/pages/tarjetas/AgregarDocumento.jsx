import React from 'react'
import "../../styles/agregaDocumento.css"

export default function AgregarDocumento({ handleChangeFile, subirDocumento}) {
  return (
    <div className="modal-documento modal-active" >
        <div>
            <div className='modal-title'>
                Agregue su documento
            </div>
            <div className='link-container-doc'>
                <input type="file" name='file' className='input-doc' onChange={handleChangeFile}/>
                <button className='add-doc-button' onClick={subirDocumento}>Agregar</button>
            </div>
        </div>
    </div>
  )
}
