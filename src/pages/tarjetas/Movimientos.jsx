import React from 'react'
import "../../styles/movimientos.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFile, faArrowLeft, faEye, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from 'react-router-dom';
import { convertDate, currencyFormat } from '../../utils/utils';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';

export default function Movimientos({movimientos,
          formMovimiento,agregaMovimiento,handleChangeForm,handleKeyDownForm,
          actualizaMovimientos, eliminaMovimiento, toggleModal, 
          periodo, total, linkDocumento, tarjeta}) {

  const navigate = useNavigate();

  return (
    <div>
      <div className='title-movimientos'>
          <div>{tarjeta.alias}&nbsp;{tarjeta.tipo}</div>
          <div>{periodo.alias}</div>
          <div>Fecha inicio: {convertDate(periodo.fechaInicio)}</div>
          <div>Fecha de corte: {convertDate(periodo.fechaCorte)}</div>
          {periodo.fechaLimitePago && (
            <div>Fecha límite de pago: {convertDate(periodo.fechaLimitePago)}</div>
          )}
      </div>
      <div className='title-saldo'>
          <div>Saldo inicial: {currencyFormat(periodo.saldoInicial)}</div>
          <div className='total-periodo'>Total Periodo:&nbsp;<div className={total.totalPeriodo >= 0?"green":"red"}>{currencyFormat(total.totalPeriodo)}</div></div>
          <div>Saldo Final: {currencyFormat(total.saldoFinal)}</div>
      </div>
      <div className='form-movimientos'>
        <div>
          Fecha:&nbsp;  
          <input type="date" name='fecha' value={formMovimiento.fecha} onChange={handleChangeForm} className='input-table' onKeyDown={handleKeyDownForm} min={periodo.fechaInicio} max={tarjeta.tipo==="Crédito"?periodo.fechaLimitePago:periodo.fechaCorte}/>
        </div>
        <div>
          Cantidad:&nbsp;
          <input type="number" name='cantidad' value={formMovimiento.cantidad} onChange={handleChangeForm}  className='input-table cantidad-input' onKeyDown={handleKeyDownForm} />
        </div>
        <div>
          Motivo:&nbsp;
          <input type="text" name='motivo' value={formMovimiento.motivo} onChange={handleChangeForm}  className='input-table' autoComplete='off' onKeyDown={handleKeyDownForm} />
        </div>
        <div className='checkbox-container'>
          <label htmlFor='isEfectivo'>Efectivo</label>
          <input type='checkbox' name='isEfectivo' id='isEfectivo' onChange={handleChangeForm} checked={formMovimiento.isEfectivo} onKeyDown={handleKeyDownForm}/>
        </div>
        <button onClick={agregaMovimiento} className='table-agregar-button'>Agregar</button>
      </div>
      <div className='movimientos-container'>
        <div className='abonos-container'>
        <div className='tipo-movimiento-title'>Abonos</div>
          <table>
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th></th></tr></thead>
            <tbody>
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "abono").sort((a, b) => (new Date(a.fecha)-new Date(b.fecha))).map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{convertDate(movimiento.fecha)}</td>
                <td>{currencyFormat(movimiento.cantidad)}</td>
                <td className='motivo-movimiento'>{movimiento.motivo} {movimiento.isEfectivo && (<FontAwesomeIcon icon={faMoneyBillWave} className='billete-efectivo'/>)}</td>
                <td className='eliminar-column'><FontAwesomeIcon icon={faTrash} className='table-eliminar-button' onClick={()=>eliminaMovimiento(movimiento.id)}>Eliminar</FontAwesomeIcon></td>
              </tr>
            )
          })}
          </tbody>
          </table>
          <div className='total'>
              Total Abonos 
              <div className='total-abono'>
                 {currencyFormat(total.totalAbono)}</div>
              </div>
          </div>

        <div className='cargos-container'>
          <div className='tipo-movimiento-title'>Cargos</div>
         
          <table>
            <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th><th></th></tr></thead>
            <tbody>
            {movimientos && movimientos.filter(movimiento => movimiento.tipo === "cargo").sort((a, b) => (new Date(a.fecha)-new Date(b.fecha))).map((movimiento,i) => {
            return(
              <tr key={i}>
                <td>{convertDate(movimiento.fecha)}</td>
                <td>{currencyFormat(movimiento.cantidad)}</td>
                <td className='motivo-movimiento'>{movimiento.motivo} {movimiento.isEfectivo && (<FontAwesomeIcon icon={faMoneyBillWave} className='billete-efectivo'/>)}</td>
                <td className='eliminar-column'><FontAwesomeIcon icon={faTrash} className='table-eliminar-button' onClick={()=>eliminaMovimiento(movimiento.id)}>Eliminar</FontAwesomeIcon></td>
              </tr>
            )
          })}
          </tbody>
          </table>
          <div className='total'>
            Total Cargos 
            <div className='total-cargo'>
                {currencyFormat(total.totalCargo)}
            </div>
          </div>
        </div>
      </div>
      <div>
      <div className='botones-movimientos-container'>
        <FontAwesomeIcon icon={faArrowLeft}  className='back-button-movimientos' onClick={()=>navigate(-1)}/>
        <div className='guardar-mov-button' onClick={actualizaMovimientos}>Guardar movimientos</div>
        <div className='doc-buttons-container'>
          {linkDocumento && (
          <Link to={linkDocumento} target='_blank'><FontAwesomeIcon icon={faEye}  className='view-button'/></Link>
          )} 
          <FontAwesomeIcon icon={faFile}  className='doc-button' onClick={toggleModal}/>
        </div>
      </div>
        
      </div>
    </div>
  )
}
