export interface Tarjeta {
    id?: string,
    idUsuario: string,
    nombre: string,
    color: string,
    correo: string,
    diaCorte: number,
    tipo: "Crédito" | "Débito"
}
  