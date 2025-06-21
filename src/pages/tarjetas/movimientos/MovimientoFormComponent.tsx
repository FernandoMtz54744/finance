import { MovimientoForm } from "@/interfaces/forms/MovimientoForm";
import { Periodo } from "@/interfaces/Periodo";
import { Tarjeta } from "@/interfaces/Tarjeta";
import { Calendar } from "primereact/calendar";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Utils from "@/utils/utils"
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";

type props = {
  tarjeta: Tarjeta,
  periodo: Periodo,
  onSubmit: (data: MovimientoForm) => void
}

export default function MovimientoFormComponent({tarjeta,periodo, onSubmit}: props) {
  const { control, handleSubmit, setValue, watch, formState, reset} = useForm<MovimientoForm>({ defaultValues:{
      fecha: periodo.fechaInicio,
      cantidad: 0,
      motivo: '',
      isRendimiento: false
  }});

  useEffect(()=>{
    if(formState.isSubmitSuccessful)
      reset();
  })
    
  const handleKeyDown = (e: any) =>{    
    if(e.key === 'Enter'){
      if(e.target.type === "checkbox"){
        e.preventDefault()
        setValue("isRendimiento", !watch("isRendimiento"));   
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-5 px-4 w-full gap-x-5 gap-y-3 m-5 border-y-2 border-teal-950 py-2' autoComplete="off">
      
      <div className="col-span-5 md:col-span-1 flex flex-row items-center">
        Fecha:&nbsp;
        <Controller name="fecha" control={control} rules={{ required: true } } render={({field}) => (
          <Calendar className='p-inputtext-sm w-full' minDate={periodo.fechaInicio} 
            maxDate={tarjeta.tipo==="Crédito"?Utils.getFechaLimitePago(periodo.fechaCorte):periodo.fechaCorte} 
            dateFormat="dd/M/yy" locale="es" {...field}/>
        )}/>
      </div>
    
      <div className="col-span-5 md:col-span-1 flex flex-row items-center">
        Cantidad:&nbsp; 
        <Controller name="cantidad" control={control} rules={{ required: true, validate: (value)=> value!==0 } } render={({field}) => (
          <InputNumber {...field} className='p-inputtext-sm w-full' mode="currency" currency="USD" onChange={(e) => field.onChange(e.value)} />
        )}/>
      </div>
    
      <div className="col-span-5 md:col-span-1 flex flex-row items-center">
        Motivo:&nbsp;
        <Controller name="motivo" control={control} rules={{ required: true } } render={({field}) => (
          <InputText {...field} className='p-inputtext-sm w-full' />
        )}/>
      </div>
    
      <div className='col-span-5 md:col-span-1 flex flex-row justify-center'>
        <Controller name="isRendimiento" control={control} render={({field}) => (
          <ToggleButton className='p-inputtext-sm' onLabel="Rendimiento" offLabel="Movimiento" onIcon="pi pi-arrow-circle-up" offIcon="pi pi-arrow-right-arrow-left"
            checked={field.value} onChange={(e) => field.onChange(e.value)} onKeyDown={handleKeyDown}/>
        )}/>
      </div>
    
      <Button label='Agregar' className="col-span-5 md:col-span-1"/>
    </form>
  )
}
