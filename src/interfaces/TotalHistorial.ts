export interface TotalHistorial{
    idUsuario: string,
    fecha: Date,
    total: number,
    efectivo: number,
    tarjetas: tarjeta[]
}

interface tarjeta{
    nombre: string,
    total: number
}