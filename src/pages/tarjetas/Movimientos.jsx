import React from 'react'
import "../../styles/movimientos.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFile, faArrowLeft} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';

export default function Movimientos({movimientos,
          formMovimiento,agregaMovimiento,handleChangeForm,handleKeyDownForm,
          actualizaMovimientos, eliminaMovimiento, toggleModal, 
          initial, final}) {

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
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th>Método</th><th></th></tr></thead>
            <tbody>
            <tr>
                <td>
                  <input type="date" name='fecha' value={formMovimiento.abono.fecha} onChange={(e)=>handleChangeForm(e, "abono")} 
                  className='input-table' onKeyDown={(e)=>handleKeyDownForm(e, "abono")} 
                  min={initial} max={final} defaultValue={initial}/>
                </td>
                <td>
                  <input type="number" name='cantidad' value={formMovimiento.abono.cantidad} onChange={(e)=>handleChangeForm(e, "abono")}  className='input-table cantidad-input' onKeyDown={(e)=>handleKeyDownForm(e, "abono")} />
                </td>
                <td>
                  <input type="text" name='motivo' value={formMovimiento.abono.motivo} onChange={(e)=>handleChangeForm(e, "abono")}  className='input-table' autoComplete='off' onKeyDown={(e)=>handleKeyDownForm(e, "abono")} />
                </td>
                <td>
                  <select name="metodo" id="metodo" value={formMovimiento.abono.metodo} onChange={(e)=>handleChangeForm(e, "abono")} className='select-metodo'>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </td>
                <td>
                  <button onClick={()=>agregaMovimiento("abono")} className='table-agregar-button'>Agregar</button>
                </td>
            </tr>
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "abono").map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{movimiento.fecha}</td>
                <td>${Number(movimiento.cantidad).toLocaleString('en', numberFormatOption)}</td>
                <td className='motivo-movimiento'>{movimiento.motivo}</td>
                <td className='motivo-movimiento'>{movimiento.metodo}</td>
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
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th>Método</th><th></th></tr></thead>
            <tbody>
            <tr>
              <td>
                <input type="date" name='fecha' value={formMovimiento.cargo.fecha} onChange={(e)=>handleChangeForm(e, "cargo")}  
                className='input-table' onKeyDown={(e)=>handleKeyDownForm(e, "cargo")} 
                min={initial} max={final} defaultValue={initial}
                />
              </td>
              <td>
                <input type="number" name='cantidad' value={formMovimiento.cargo.cantidad} onChange={(e)=>handleChangeForm(e, "cargo")} className='input-table cantidad-input' onKeyDown={(e)=>handleKeyDownForm(e, "cargo")} />
              </td>
              <td>
                <input type="text" name='motivo' value={formMovimiento.cargo.motivo} onChange={(e)=>handleChangeForm(e, "cargo")} className='input-table' autoComplete='off' onKeyDown={(e)=>handleKeyDownForm(e, "cargo")} />
              </td>
              <td>
                  <select name="metodo" id="metodo" value={formMovimiento.cargo.metodo} onChange={(e)=>handleChangeForm(e, "cargo")} className='select-metodo'>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </td>
              <td>
                <button onClick={()=>agregaMovimiento("cargo")} className='table-agregar-button'>Agregar</button>
              </td>
            </tr>  
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "cargo").map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{movimiento.fecha}</td>
                <td>${Number(movimiento.cantidad).toLocaleString('en', numberFormatOption)}</td>
                <td className='motivo-movimiento'>{movimiento.motivo}</td>
                <td className='motivo-movimiento'>{movimiento.metodo}</td>
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
