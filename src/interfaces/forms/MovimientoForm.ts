import { Movimiento } from "../Movimiento";

export type MovimientoForm = Omit<Movimiento, "id" | "tipo">