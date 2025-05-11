import { MovimientoViewModel } from "@/interfaces/MovimientoViewModel"
import { Periodo } from "@/interfaces/Periodo"
import { Tarjeta } from "@/interfaces/Tarjeta"
import * as Utils from "@/utils/utils"

type props = {
    tarjeta: Tarjeta,
    periodo: Periodo,
    movimientoViewModel: MovimientoViewModel
}

export default function MovimientosHeader({tarjeta, periodo, movimientoViewModel}: props) {
  return (
    <>
        {/* DATOS DEL PERIODO */}
        <div className='flex md:flex-row flex-col w-full md:justify-between items-center my-4 px-8'>
            <div className='flex flex-row items-center'>{tarjeta.nombre}&nbsp;{tarjeta.tipo} - {periodo.nombre}&nbsp;{periodo.isValidado && <span className='pi pi-verified text-green-500'></span>}</div>
            <div>Fecha inicio: {Utils.convertDate(periodo.fechaInicio)}</div>
            <div>Fecha de corte: {Utils.convertDate(periodo.fechaCorte)}</div>
            {tarjeta.tipo === "Crédito" && (
            <div>Fecha límite de pago: {Utils.convertDate(Utils.getFechaLimitePago(periodo.fechaCorte))}</div>
            )}
        </div>
    
        {/* CÁLCULOS DE LOS MOVIMIENTOS */}
        <div className='flex md:flex-row flex-col justify-around items-center w-full bg-teal-950 p-1'>
            <div>Saldo inicial: {Utils.currencyFormat(periodo.saldoInicial)}</div>
            <div className='flex flex-row'>
                Total Periodo:&nbsp;
                <div className={movimientoViewModel.total.totalPeriodo >= 0?"green":"red"}>
                    {Utils.currencyFormat(movimientoViewModel.total.totalPeriodo)}
                </div>
            </div>
            <div>Saldo Final: {Utils.currencyFormat(movimientoViewModel.total.saldoFinal)}</div>
        </div>
    </>
  )
}
