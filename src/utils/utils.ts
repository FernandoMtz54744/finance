import { Pago } from '@/interfaces/Pago';
import { Periodo } from '@/interfaces/Periodo';
import { DateTime } from 'luxon';

export function convertDate(fecha: Date): string{
    return DateTime.fromJSDate(fecha).setLocale("es").toFormat('dd/LLL/yyyy');
}

export function currencyFormat(cantidad: number){
    const numberFormatOption = { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    };
    if(cantidad > 0){
        return `$${Number(cantidad).toLocaleString('en', numberFormatOption)}`
    }else if(cantidad < 0){
        return `-$${Math.abs(Number(cantidad)).toLocaleString('en', numberFormatOption)}`
    }else{
        return `$0.00`
    }
}

export function getNextFechaByDay(dia: number): Date{
    const hoy = DateTime.local().startOf("day");
    const fechaProxima = hoy.set({day: dia});
    if (hoy.hasSame(fechaProxima, "day")){
        return hoy.toJSDate();
    }
    const fechaFinal =  hoy < fechaProxima? fechaProxima.toJSDate() : fechaProxima.plus({months: 1}).toJSDate();
    return fechaFinal;
}

export function getNextFechaByPeriodicity(startDate, periodicity) {
    const currentDate = DateTime.now();
    const initialDate = DateTime.fromISO(startDate);
  
    if (periodicity === "Anual") {
      const yearsDiff = currentDate.diff(initialDate, "years").years;
      const nextYearIncrement = Math.ceil(yearsDiff); // Calcula cuántos años sumar
      return initialDate.plus({ years: nextYearIncrement }).toISODate();
    } else if (periodicity === "Mensual") {
      const monthsDiff = currentDate.diff(initialDate, "months").months;
      const nextMonthIncrement = Math.ceil(monthsDiff); // Calcula cuántos meses sumar
      return initialDate.plus({ months: nextMonthIncrement }).toISODate();
    }
  
    throw new Error("Periodicidad no soportada");
}

export function getLastFechaByPeriodicity(pago: Pago): Date{
    const hoy = DateTime.now();

    if(pago.fechaPago.periodicidad === "Anual"){
        const fecha = DateTime.local(hoy.year, pago.fechaPago.mes!, pago.fechaPago.dia); //Fecha con el día dado
        if(hoy >= fecha){
            return fecha.toJSDate();
        }else{
            return fecha.minus({years: 1}).toJSDate();
        }
    }else if (pago.fechaPago.periodicidad === "Mensual"){
        const fecha =  DateTime.local(hoy.year, hoy.month, pago.fechaPago.dia)
        if(hoy >= fecha){
            return fecha.toJSDate();
        }else{
            return fecha.minus({months: 1}).toJSDate();
        }
    }
    throw new Error("Periodicidad no soportada");
}

export function getLastFechaByDay(dia: number): Date{
    const hoy = DateTime.local().startOf("day");
    const fechaPasada = hoy.set({day: dia});
    if (hoy.hasSame(fechaPasada, "day")) {
        return hoy.toJSDate();
    }
    const fechaFinal =  hoy > fechaPasada? fechaPasada.toJSDate() : fechaPasada.minus({months: 1}).toJSDate();
    return fechaFinal;
}

export function getFechaLimitePago(fecha: Date): Date{
    return DateTime.fromJSDate(fecha).plus({days: 20}).toJSDate();
}

export function getFechaLimitePagoByDays(fecha: Date, dias: number): Date{
    return DateTime.fromJSDate(fecha).plus({days: dias}).toJSDate();
}   

export const obtenerSaldoUltimoPeriodo = (periodos: Periodo[], idTarjeta: string): number=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    if(periodosTarjeta.length === 0){
        return 0;
    }else{
        return periodosTarjeta.sort((a, b) => (b.fechaCorte.getTime()-a.fechaCorte.getTime()))[0].saldoFinal;
    }
}

export const obtenerSaldoTotal = (periodos: Periodo[], idTarjeta: string): number =>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    const saldoTotal = periodosTarjeta.reduce((total, periodo)=>{
      return total + periodo.saldoFinal;
    }, 0)
    return saldoTotal;
}

export const obtenerProximoPago = (pago: Pago): Date =>{
    const hoy = DateTime.local().startOf("day");
    if(pago.periodicidad === "Mensual"){
        return hoy.plus({months: 1}).toJSDate();    
    }else if(pago.periodicidad === "Anual"){
        return hoy.plus({years: 1}).toJSDate();   
    }else{
        return hoy.plus({days: pago.diasPersonalizada}).toJSDate();
    }
}