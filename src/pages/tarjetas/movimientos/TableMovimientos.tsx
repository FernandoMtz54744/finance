import { Button } from "primereact/button";
import { Movimiento } from "../../../interfaces/Movimiento";
import { convertDate, currencyFormat } from "../../../utils/utils";

interface props {
    header: string,
    movimientos: Movimiento[],
    eliminaMovimiento: (id: string)=> void,
}

export default function TableMovimientos({header, movimientos, eliminaMovimiento }: props) {
  return (
    <>
        <div className='bg-teal-950 w-full text-center text-3xl mb-3'>{header}</div>
        <table className="table-fix w-full text-left">
            <thead className="border-b-1 border-teal-950">
                <tr>
                    <th className="px-4">Fecha</th>
                    <th >Cantidad</th>
                    <th >Motivo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {movimientos.map((movimiento, i) => (
                    <tr key={i} className="border-b-1 border-teal-900">
                        <td className="px-4">{convertDate(movimiento.fecha)}</td>
                        <td>{currencyFormat(movimiento.cantidad)}</td>
                        <td>{movimiento.motivo} {movimiento.isEfectivo && <i className="pi pi-money-bill" style={{ color: '#3e9c35' }}></i>}</td>
                        <td><Button onClick={()=>eliminaMovimiento(movimiento.id)} icon="pi pi-trash" severity="danger" text size="small"/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  )
}
