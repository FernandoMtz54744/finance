export function convertDate (date) {
    return [date.substring(8,10), date.substring(5,7), date.substring(0,4)].join('/');
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
    const dia = Number(fecha.substring(8,10));
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return new Date(year, month+1, dia).toISOString();
}