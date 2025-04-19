import { Firestore } from "firebase/firestore"

export interface Pago{
    id?: string,
    idUsuario: string,
    nombre: string,
    cantidad: number,
    periodicidad: "Mensual" | "Anual" | "Personalizada",
    diasPersonalizada?: number //Cada x días cuando la periodicidad es personalizadas
    correo: string,
    isPagado: boolean,
    ultimoPago: Date, 
    proximoPago: Date,
    diasLimitePago: number, //Días despues del proximo pago para pagar
    diasAntesNotificacion: number, //Días antes del proximo pago para mandar la notificación
    auditar: boolean //Opcion para indicar si mantener registro histórico de los pagos
    notas?: string, //Notas solo cuando la opción de auditar está habilitada
}