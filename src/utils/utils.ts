import { DateTime } from 'luxon';

export function convertDate(fecha: Date): string{
    return DateTime.fromJSDate(fecha).setLocale("es").toFormat('dd/LLL/yyyy');
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

export function getLastFechaByPeriodicity(startDate, periodicity) {
    const currentDate = DateTime.now();
    const initialDate = DateTime.fromISO(startDate);
  
    if (periodicity === "Anual") {
      const yearsDiff = currentDate.diff(initialDate, "years").years;
      const lastYearIncrement = Math.floor(yearsDiff); // Calcula cuántos años restar
      return initialDate.plus({ years: lastYearIncrement }).toISODate();
    } else if (periodicity === "Mensual") {
      const monthsDiff = currentDate.diff(initialDate, "months").months;
      const lastMonthIncrement = Math.floor(monthsDiff); // Calcula cuántos meses restar
      return initialDate.plus({ months: lastMonthIncrement }).toISODate();
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

export function getFechaLimitePagoByDays(fecha, dias){
    return DateTime.fromISO(fecha).plus({days: dias}).toISODate();
}   

export const obtenerSaldoUltimoPeriodo = (periodos, idTarjeta)=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    if(periodosTarjeta.length === 0){
        return 0;
    }else{
        return periodosTarjeta.sort((a, b) => (new Date(b.fechaCorte)-new Date(a.fechaCorte)))[0].saldoFinal;
    }
}

export const obtenerSaldoTotal = (periodos, idTarjeta)=>{
    const periodosTarjeta = periodos.filter(periodo => periodo.idTarjeta === idTarjeta);
    const saldoTotal = periodosTarjeta.reduce((total, periodo)=>{
      return total + periodo.saldoFinal;
    }, 0)
    return saldoTotal;
}