import { Tarjeta } from "@/interfaces/Tarjeta";

export type TarjetaForm = Omit<Tarjeta, "id" | "idUsuario">

export type AddTarjeta = Omit<Tarjeta, "id">

export type EditTarjeta = Omit<Tarjeta, "id" | "idUsuario" | "tipo">;