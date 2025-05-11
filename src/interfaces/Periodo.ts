export interface Periodo {
    id: string,
    idUsuario: string,
    idTarjeta: string,
    nombre: string,
    fechaInicio: Date
    fechaCorte: Date,
    saldoInicial: number,
    saldoFinal: number,
    totalPeriodo: number,
    liquidado?: number,
    isValidado: boolean
}  