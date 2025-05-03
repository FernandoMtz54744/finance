import { Periodo } from "@/interfaces/Periodo"

export type PeriodoForm = Omit<Periodo, "id" | "idUsuario" | "idTarjeta" | "pagado" | "saldoFinal"  | "totalPeriodo">;

export type AddPeriodo = Omit<Periodo, "id">;