import { BitacoraPago } from "../BitacoraPago";

export type BitacoraPagoForm = Omit<BitacoraPago, "id" | "idPago">

export type BitacoraPagoAdd = Omit<BitacoraPago, "id">