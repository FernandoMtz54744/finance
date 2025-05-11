import { Periodo } from "@/interfaces/Periodo";

export type PeriodoForm = Omit<Periodo, "id" | "idUsuario" | "idTarjeta" | "liquidado" | "saldoFinal"  | "totalPeriodo" | "isValidado">;

export type AddPeriodo = Omit<Periodo, "id" | "liquidado">;

export type EditPeriodo = Omit<Periodo, "id" | "idUsuario" | "idTarjeta" | "liquidado" | "totalPeriodo" | "isValidado">;