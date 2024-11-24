import { addMonths, format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function convertDate(date) {
    const fecha = parseISO(date);
    return format(fecha,"dd/MMM/yyyy", {locale: es})
}

export function currencyFormat(number){
    const numberFormatOption = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    };
    if(number > 0){
        return `$${Number(number).toLocaleString('en', numberFormatOption)}`
    }else if(number < 0){
         return `-$${Math.abs(Number(number)).toLocaleString('en', numberFormatOption)}`
    }else{
        return `$${Number(number).toLocaleString('en', numberFormatOption)}`
    }
}

export function getNextFechaByDay(fecha){
    const dia = parseISO(fecha).getDate();
    const hoy = new Date();
    const fechaProxima = new Date(hoy.getFullYear(), hoy.getMonth(), dia);
    if (hoy.getDate() === dia) {
        return format(hoy, 'yyyy-MM-dd');
    }
    const fechaFinal = isBefore(hoy, fechaProxima) ? fechaProxima : addMonths(fechaProxima, 1);
    return format(fechaFinal, 'yyyy-MM-dd');
}

//En formato dd/MM/yyyy
export const toLocaleEs=(fecha)=>{
    const dia = Number(fecha.substring(0,2));
    const mes = Number(fecha.substring(3,5));
    const anio = fecha.substring(6,10);
    return `${dia} de ${mesToEs(mes)} de ${anio}`
}

const mesToEs =(mes)=>{
    switch(mes){
        case 1:
            return "enero";
        case 2: 
            return "febrero";
        case 3:
            return "marzo";
        case 4: 
            return "abril";
        case 5:
            return "mayo";
        case 6: 
            return "junio";
        case 7:
            return "julio";
        case 8:
            return "agosto";
        case 9:
            return "septiembre";
        case 10:
            return "octubre";
        case 11:
            return "noviembre";
        case 12:
            return "diciembre";
        default:
            return "mes no disponible";
    }
}