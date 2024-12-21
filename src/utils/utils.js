import { DateTime } from 'luxon';

export function convertDate(date) {
    return DateTime.fromISO(date).setLocale("es").toFormat('dd/LLL/yyyy');
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
        return `$0.00`
    }
}

export function getNextFechaByDay(fecha){
    const dia = DateTime.fromISO(fecha).day;
    const hoy = DateTime.local().startOf("day");
    const fechaProxima = hoy.set({day: dia});
    if (hoy.hasSame(fechaProxima, "day")) {
        return hoy.toISODate();
    }
    const fechaFinal =  hoy < fechaProxima? fechaProxima.toISODate() : fechaProxima.plus({months: 1}).toISODate();
    return fechaFinal;
}

export function getLastFechaByDay(fecha){
    const dia = DateTime.fromISO(fecha).day;
    const hoy = DateTime.local().startOf("day");
    const fechaPasada = hoy.set({day: dia});
    if (hoy.hasSame(fechaPasada, "day")) {
        return hoy.toISODate();
    }
    const fechaFinal =  hoy > fechaPasada? fechaPasada.toISODate() : fechaPasada.minus({months: 1}).toISODate();
    return fechaFinal;
}

export function getFechaLimitePago(fecha){
    return DateTime.fromISO(fecha).plus({days: 20}).toISODate();
}