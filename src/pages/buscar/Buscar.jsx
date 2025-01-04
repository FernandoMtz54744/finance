import React from 'react'
import { convertDate, currencyFormat } from '../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

export default function Buscar({tarjetas, movimientosFiltered, handleChange, formFiltros, borrarFiltros, total}) {
  return (
    <div>
        <center className='title'>Búsqueda de movimientos</center>
        <div className='filtros'>
            <div className='filtro-element'>
                <div>Fecha inicio:&nbsp;</div>
                <div><input type="date" className='input-table' onChange={handleChange} value={formFiltros.fechaInicio} name='fechaInicio'/></div>
            </div>
            <div className='filtro-element'>
                <div>Fecha fin:&nbsp;</div>
                <div><input type="date" className='input-table' onChange={handleChange} value={formFiltros.fechaFin} name='fechaFin'/></div>
            </div>
            <div className='checkbox-container filtro-element'>
                <label htmlFor='efectivo'>Efectivo:</label>
                <input type='checkbox' name='efectivo' id='efectivo' onChange={handleChange} checked={formFiltros.efectivo}/>
            </div>
            <div className='filtro-element'>
                <div>Palabra:&nbsp;</div>
                <div><input type="text" className='input-table palabra-filtro' onChange={handleChange} value={formFiltros.palabra} name='palabra'/></div>
            </div>
            <div className='filtro-element'>
                <div>Tarjeta:&nbsp;</div>
                <div>
                    <select name='tarjeta' className='input-select-filtro' onChange={handleChange} value={formFiltros.tarjeta}>
                        {tarjetas.map((tarjeta, i) =>{
                            return(
                                <option value={tarjeta.idTarjeta} key={i}>{tarjeta.tipo} {tarjeta.alias}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className='filtro-element'>
                <button onClick={borrarFiltros} className='table-agregar-button borrar-filtro'>Borrar filtros</button>
            </div>
        </div>
        
        <div className='movimientos-container movimientos-busqueda'>
            <div className='abonos-container'>
                <div className='tipo-movimiento-title'>Abonos</div>
                    <table>
                        <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th></tr></thead>
                        <tbody>
                            {movimientosFiltered && movimientosFiltered.filter(movimiento => movimiento.tipo === "abono").sort((a, b) => (new Date(a.fecha)-new Date(b.fecha))).map((movimiento,i) => {
                            return(
                            <tr key={i}>
                                <td>{convertDate(movimiento.fecha)}</td>
                                <td>{currencyFormat(movimiento.cantidad)}</td>
                                <td className='motivo-movimiento'>{movimiento.motivo} {movimiento.isEfectivo && (<FontAwesomeIcon icon={faMoneyBillWave} className='billete-efectivo'/>)}</td>
                            </tr>
                            )
                        })}
                      </tbody>
                      </table>
                      <div className='total'>
                          Total Abonos 
                          <div className='total-abono'>{currencyFormat(total.totalAbono)}</div>
                      </div>
            </div>
            
            <div className='cargos-container'>
                <div className='tipo-movimiento-title'>Cargos</div>
                <table>
                    <thead><tr><th>Fecha</th><th>Cantidad</th><th>Motivo</th></tr></thead>
                    <tbody>
                        {movimientosFiltered && movimientosFiltered.filter(movimiento => movimiento.tipo === "cargo").sort((a, b) => (new Date(a.fecha)-new Date(b.fecha))).map((movimiento,i) => {
                        return(
                            <tr key={i}>
                            <td>{convertDate(movimiento.fecha)}</td>
                            <td>{currencyFormat(movimiento.cantidad)}</td>
                            <td className='motivo-movimiento'>{movimiento.motivo} {movimiento.isEfectivo && (<FontAwesomeIcon icon={faMoneyBillWave} className='billete-efectivo'/>)}</td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
                <div className='total'>Total Cargos 
                    <div className='total-cargo'>{currencyFormat(total.totalCargo)}</div>
                </div>
            </div>
        </div>
        <div className='total-filtros'>
            Total: {currencyFormat(total.totalPeriodo)} 
        </div>
    </div>
  )
}
