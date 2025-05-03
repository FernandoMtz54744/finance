import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { PeriodoForm } from '@/interfaces/forms/PeriodoForm'
import { Tarjeta } from '@/interfaces/Tarjeta'
import { ToggleButton } from 'primereact/togglebutton'
import { Tooltip } from 'primereact/tooltip'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as Utils from '@/utils/utils'
import { Periodo } from '@/interfaces/Periodo'

interface props {
  tarjeta: Tarjeta,
  periodo?: Periodo,
  title: string,
  onSubmit: (e: any)=> void
}

export default function PeriodoFormComponent({tarjeta, periodo, title, onSubmit}: props) {

  const [isvalidarFechasActive, setValidarFechasActive] = useState<boolean>(true);
  const [fechaLimitePago, setFechaLimitePago] = useState<Date | null>(Utils.getFechaLimitePago(Utils.getNextFechaByDay(tarjeta.diaCorte)));
  const { control, formState: {errors}, watch, handleSubmit } = useForm<PeriodoForm>({defaultValues: {
    nombre: periodo?.nombre || '',
    fechaInicio: periodo?.fechaInicio || Utils.getLastFechaByDay(tarjeta.diaCorte + 1),
    fechaCorte: periodo?.fechaCorte || Utils.getNextFechaByDay(tarjeta.diaCorte),
    saldoInicial: periodo?.saldoInicial || 0
  }});

  useEffect(()=>{
    if(tarjeta.tipo === "Crédito" && watch("fechaCorte")){
      setFechaLimitePago(Utils.getFechaLimitePago(watch("fechaCorte")));
    }
  }, [watch("fechaCorte")]);

  const validaFechaInicio = ()=>{
    const fechaInicio = DateTime.fromJSDate(watch("fechaInicio"));
    const diaInicioValido = (tarjeta.diaCorte % 31) + 1;
    if(isvalidarFechasActive && fechaInicio.day !== diaInicioValido){
      return "El día de inicio debe ser un " + diaInicioValido;
    }
    return true;
  }

  const validaFechaCorte = ()=>{
    const fechaCorte = DateTime.fromJSDate(watch("fechaCorte"));
    if(isvalidarFechasActive && fechaCorte.day !== tarjeta.diaCorte){
      return "El día de corte debe ser un " + tarjeta.diaCorte;
    }
    
    if(watch("fechaInicio")){
      const fechaInicio = DateTime.fromJSDate(watch("fechaInicio"));
      if(fechaCorte <= fechaInicio){
        return "La fecha de corte debe ser posterior a la de inicio";
      }
      const diferencia = fechaInicio.diff(fechaCorte, "months").months;
      if(Math.abs(diferencia) > 1) {
        return "No puede haber diferencia de más de un mes entre las fechas de inicio y corte";
      }
    }
    return true;
  }

  return (
    <div className='flex flex-col justify-center items-center px-4 md:px-0'>
      <form onSubmit={handleSubmit(onSubmit)} className='p-4 rounded-md md:w-1/2 sm:w-full bg-neutral-800 mt-12 mx-4' autoComplete='off'>
        
        <div className='flex flex-col justify-center mb-8 mt-4 items-center relative '>
          <div className='text-2xl mb-4 md:mb-0'>{title}</div>
          <div className='md:absolute md:right-0'>
            <ToggleButton checked={isvalidarFechasActive} offLabel="Fechas" onLabel='Fechas' 
              onIcon="pi pi-check" offIcon="pi pi-times" id='fechasToggle' 
              pt={{ label: { style: { fontSize: '14px' }}}} onChange={(e)=> setValidarFechasActive(e.value)}/>
            <Tooltip className='hidden md:inline' target="#fechasToggle" content="Activa o desactiva la validación de fechas" position="top" />
          </div>
        </div>
        
        <div className='p-fluid grid grid-cols-12 items-center gap-y-10'>

          <div className='col-span-12'>
            <FloatLabel>
              <Controller name="nombre" control={control} rules={{required: "El nombre del periodo es requerido"}} render={({field}) => (
                <InputText {...field}/>
              )}/>
              <label>Nombre del periodo</label>
            </FloatLabel>
            {errors.nombre && <span className='text-xs text-red-500 ml-2'>{errors.nombre.message}</span>}
          </div>

          <div className='col-span-12'>
            <FloatLabel>
              <Controller name="fechaInicio" control={control} 
                rules={{required: "La fecha de inicio es requerida", validate: validaFechaInicio}} 
                render={({field}) => (
                <Calendar {...field} showIcon dateFormat="dd/M/yy" locale="es"/>
              )}/>
              <label>Fecha de incio {isvalidarFechasActive?`(día ${tarjeta.diaCorte%31 + 1})`:"(validación desactivada)"}</label>
            </FloatLabel>
            {errors.fechaInicio && <span className='text-xs text-red-500 ml-2'>{errors.fechaInicio.message}</span>}
          </div>

          <div className='col-span-12'>
            <FloatLabel>
              <Controller name="fechaCorte" control={control} 
                rules={{required: "La fecha de corte es requerida", validate: validaFechaCorte}} 
                render={({field}) => (
                <Calendar {...field} showIcon dateFormat="dd/M/yy" locale="es"/>
              )}/>
              <label>Fecha de corte {isvalidarFechasActive?`(día ${tarjeta.diaCorte})`:"(validación desactivada)"}</label>
            </FloatLabel>
            {errors.fechaCorte && <span className='text-xs text-red-500 ml-2'>{errors.fechaCorte.message}</span>}
          </div>

          {tarjeta.tipo === "Crédito" && 
          <div className='col-span-12'>
            <FloatLabel>
              <Calendar value={fechaLimitePago} disabled showIcon dateFormat="dd/M/yy" locale="es"/>
              <label>Fecha límite de pago</label>
            </FloatLabel>
          </div>
          }

          <div className='col-span-12'>
            <FloatLabel>
              <Controller name="saldoInicial" control={control} 
                rules={{required: "El saldo inicial es requerido", min:{value: 0, message: "El saldo inicial debe ser mayor o igual que cero"}}} 
                render={({field}) => (
                <InputNumber mode="currency" currency="USD" {...field} onChange={(e) => field.onChange(e.value)}/>
              )}/>
              <label>Saldo inicial</label>
            </FloatLabel>
            {errors.saldoInicial && <span className='text-xs text-red-500 ml-2'>{errors.saldoInicial.message}</span>}
          </div>
          
          <Button className='col-span-12'label='Guardar'/>
        </div>
      </form>
    </div>
  )
}
