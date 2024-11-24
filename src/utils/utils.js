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