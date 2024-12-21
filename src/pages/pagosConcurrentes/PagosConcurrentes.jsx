import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { convertDate, currencyFormat, getLastFechaByDay, getNextFechaByDay } from '../../utils/utils';
import "../../styles/pagosConcurrentes.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default function PagosConcurrentes() {
    const [edit, setEdit] = useState(false);
    const [pagos, setPagos] = useState([
        {
            nombre: "Telcel",
            cantidad: 169,
            fechaPago: "2024-10-28",
            pagado: true
        },
        {
            nombre: "Netflix",
            cantidad: 169,
            fechaPago: "2024-12-15",
            pagado: false
        }
    ])
    
  return (
    <div>
        <center className='account-title'>{edit?"Seleccione el pago para editar": "Tus pagos concurrentes"}</center>
        <div className='pagos-container'>
        {pagos.sort((a,b) => a.nombre.localeCompare(b.nombre)).map(pago =>{
            return(
                <Link className={`pago-container ${pago.pagado?"pagado":"no-pagado"}`}>
                    {
                    pago.pagado && (
                    <div className="pago-status">
                        {pago.pagado?`Próximo pago ${convertDate(getNextFechaByDay(pago.fechaPago))}`:"SIN PAGAR"}
                    </div>
                    )
                    }
                    
                    <div className="pago-data">
                        <div>{pago.nombre}</div>
                        <div>{convertDate(getLastFechaByDay(pago.fechaPago))}</div>
                        <div>{currencyFormat(pago.cantidad)}</div>
                        <div className={`${!pago.pagado?"no-pagado":"pagado"}`}>{pago.pagado?"PAGADO":"SIN PAGAR"}</div>
                    </div>
                </Link>
            )
        })}
        </div>
        <Link className='agregar-button' to="">+</Link>
        <FontAwesomeIcon icon={faEdit}  className='edit-button' onClick={()=>setEdit(!edit)}/>
    </div>
  )
}
