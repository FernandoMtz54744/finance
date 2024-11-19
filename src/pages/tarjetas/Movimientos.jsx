import React from 'react'
import "../../styles/movimientos.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFile, faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';

export default function Movimientos({movimientos, formAbono, formCargo, 
          handleChangeAbono, handleChangeCargo, agregaAbono, agregaCargo, 
          actualizaMovimientos, eliminaMovimiento, toggleModal}) {


  const navigate = useNavigate();

  const numberFormatOption = { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  };

  return (
    <div>
      <div className='movimientos-container'>
        <div className='abonos-container'>
        <div className='tipo-movimiento-title'>Abonos</div>
          <table>
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th></th></tr></thead>
            <tbody>
            <tr>
              <td>
                <input type="date" name='fecha' value={formAbono.fecha} onChange={handleChangeAbono} className='input-table' />
              </td>
              <td>
                <input type="number" name='cantidad' value={formAbono.cantidad} onChange={handleChangeAbono} className='input-table'/>
              </td>
              <td>
                <input type="text" name='motivo' value={formAbono.motivo} onChange={handleChangeAbono} className='input-table'/>
              </td>
              <td>
                <button onClick={agregaAbono} className='table-agregar-button'>Agregar</button>
              </td>
            </tr>
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "abono").map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{movimiento.fecha}</td>
                <td>${Number(movimiento.cantidad).toLocaleString('en', numberFormatOption)}</td>
                <td>{movimiento.motivo}</td>
                <td><div className='table-eliminar-button' onClick={()=>eliminaMovimiento(movimiento.id)}>Eliminar</div></td>
              </tr>
            )
          })}
          </tbody>
          </table>
          <div className='total'>
              Total Abonos 
              <div className='total-abono'>$
                {
                movimientos?(
                  Number(movimientos.filter(movimiento => movimiento.tipo === "abono").reduce((suma, actual) => suma + actual.cantidad, 0))
                .toLocaleString('en', numberFormatOption)
                ):(0)
              }</div>
          </div>
        </div>

        <div className='cargos-container'>
          <div className='tipo-movimiento-title'>Cargos</div>
         
          <table>
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th></th></tr></thead>
            <tbody>
            <tr>
              <td>
                <input type="date" name='fecha' value={formCargo.fecha} onChange={handleChangeCargo} className='input-table'/>
              </td>
              <td>
                <input type="number" name='cantidad' value={formCargo.cantidad} onChange={handleChangeCargo} className='input-table'/>
              </td>
              <td>
                <input type="text" name='motivo' value={formCargo.motivo} onChange={handleChangeCargo} className='input-table'/>
              </td>
              <td>
                <button onClick={agregaCargo} className='table-agregar-button'>Agregar</button>
              </td>
            </tr>  
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "cargo").map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{movimiento.fecha}</td>
                <td>${Number(movimiento.cantidad).toLocaleString('en', numberFormatOption)}</td>
                <td>{movimiento.motivo}</td>
                <td><div className='table-eliminar-button' onClick={()=>eliminaMovimiento(movimiento.id)}>Eliminar</div></td>
              </tr>
            )
          })}
          </tbody>
          </table>
          <div className='total'>
            Total Cargos 
            <div className='total-cargo'>$
              {
                movimientos?(
                  Number(movimientos.filter(movimiento => movimiento.tipo === "cargo").reduce((suma, actual) => suma + actual.cantidad, 0))
                  .toLocaleString('en', numberFormatOption)
                ):(0)
              }
            </div>
          </div>
        </div>
      </div>
      <div>
        <FontAwesomeIcon icon={faFile}  className='doc-button' onClick={toggleModal}/>
        <FontAwesomeIcon icon={faArrowLeft}  className='back-button' onClick={()=>navigate(-1)}/>
      </div>
        <div className='guardar-mov-button' onClick={actualizaMovimientos}>Guardar movimientos</div>
        
        
    </div>
  )
}
