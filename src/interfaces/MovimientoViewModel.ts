import { Movimiento } from "./Movimiento";

export interface MovimientoViewModel{
    movimientos: Movimiento[],
    total: total,
    linkDocumento: string
}

interface total { 
    totalAbono: number, 
    totalCargo: number,
    totalPeriodo: number, 
    saldoFinal: number
}
