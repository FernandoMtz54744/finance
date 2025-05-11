import { Pago } from "@/interfaces/Pago";

export type PagoRecurrenteForm = Omit<Pago, "id" | "idUsuario" | "isPagado" | "isPagado">;

export type PagoRecurrenteAdd = Omit<Pago, "id">;