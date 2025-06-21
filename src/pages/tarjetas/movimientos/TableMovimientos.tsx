import { Button } from "primereact/button";
import { Movimiento } from "../../../interfaces/Movimiento";
import { convertDate, currencyFormat } from "../../../utils/utils";
import { Tooltip } from "primereact/tooltip";

interface props {
    header: string,
    movimientos: Movimiento[],
    eliminaMovimiento: (id: string)=> void,
}

export default function TableMovimientos({header, movimientos, eliminaMovimiento }: props) {
  return (
    <>
        <div className='bg-teal-950 w-full text-center text-3xl mb-3'>{header}</div>
        <table className="table-fix w-full text-left tracking-tighter md:tracking-normal leading-5">
            <thead className="border-b-1 border-teal-950">
                <tr>
                    <th className="pl-3 md:px-4">Fecha</th>
                    <th className="pl-2 md:px-0">Cantidad</th>
                    <th className="pl-2 md:pl-0">Motivo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="text-sm md:text-base">
                {movimientos.map((movimiento, i) => (
                    <tr key={i} className="border-b-1 border-teal-900">
                        <td className="pl-3 md:px-4">{convertDate(movimiento.fecha)}</td>
                        <td className="pl-2 md:px-0">{currencyFormat(movimiento.cantidad)}</td>
                        <td className="align-middle pl-2 md:pl-0">
                            <span className="inline-flex items-center gap-1 my-1 md:my-0">{movimiento.motivo} {movimiento.isRendimiento 
                            && <i className="pi pi-arrow-circle-up text-green-500" data-pr-tooltip="Rendimiento de inversión"></i>}
                            </span>
                            <Tooltip target=".pi-arrow-circle-up" />
                        </td>
                        <td className="pr-2 md:pr-0"><Button onClick={()=>eliminaMovimiento(movimiento.id)} icon="pi pi-trash" severity="danger" text size="small"/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  )
}
