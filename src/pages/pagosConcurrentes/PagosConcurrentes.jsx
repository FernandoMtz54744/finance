import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat, getFechaLimitePagoByDays } from '../../utils/utils';
import "../../styles/pagosConcurrentes.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

export default function PagosConcurrentes({pagos, actualizaPago}) {
    const [edit, setEdit] = useState(false);
    
  return (
    <div>
        <center className='account-title'>{edit?"Seleccione el pago para editar": "Tus pagos recurrentes"}</center>
        <div className='pagos-container'>
        {pagos.sort((a,b) => {
             // Priorizar pagos no pagados
            if (!a.pagado && b.pagado) {
                return -1; // a va antes que b
            } else if (a.pagado && !b.pagado) {
                return 1; //b va antes que a
            }
            
            const hoy = DateTime.now();
            const diferenciaA = DateTime.fromISO(a.proximoPago).diff(hoy, 'days').days;
            const diferenciaB = DateTime.fromISO(b.proximoPago).diff(hoy, 'days').days;
            return diferenciaA - diferenciaB;
        }).map((pago,i) =>{
            return(
                <div className={`pago-container ${pago.pagado?"pagado":"no-pagado"}`} key={i}>

                    <div className="pago-status">
                        {pago.pagado?`Próximo Pago: ${convertDate(pago.proximoPago)}`:
                        pago.hasFechaLimite?
                        `Límite de pago: ${convertDate(getFechaLimitePagoByDays(pago.fechaInicio, pago.diasLimitePago))}`:"Sin pagar"}
                    </div>

                    <div className="pago-data">
                        <div>{pago.nombre}</div>
                        <div>{convertDate(pago.fechaInicio)}</div>
                        <div>{currencyFormat(pago.cantidad)}</div>
                        <div>{pago.periodicidad}</div>
                        <div className="switch">
                            <input type="checkbox" checked={pago.pagado}/>
                            <label htmlFor="switch" onClick={()=>actualizaPago(pago.idPago, pago.pagado)}></label>
                        </div>
                        <div className={`${!pago.pagado?"no-pagado":"pagado"}`}>{pago.pagado?"PAGADO":"SIN PAGAR"}</div>
                    </div>
                </div>
            )
        })}
        </div>
        <Link className='agregar-button' to="/agregarPago">+</Link>
        <FontAwesomeIcon icon={faEdit}  className='edit-button' onClick={()=>setEdit(!edit)}/>
    </div>
  )
}
