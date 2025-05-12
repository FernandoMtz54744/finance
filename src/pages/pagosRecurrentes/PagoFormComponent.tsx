import { PagoRecurrenteForm } from '@/interfaces/forms/PagoRecurrenteForm'
import { Pago } from '@/interfaces/Pago'
import { DateTime } from 'luxon'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { ToggleButton } from 'primereact/togglebutton'
import { Tooltip } from 'primereact/tooltip'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface props {
    pago?: Pago,
    title: string,
    onSubmit: (e: PagoRecurrenteForm) => void
}

export default function PagoFormComponent({pago, onSubmit, title}: props) {
    const options = ["Mensual", "Anual", "Personalizada"]
    const { control, handleSubmit, watch, formState: {errors}, setValue} = useForm<PagoRecurrenteForm>({ defaultValues: {
        nombre: pago?.nombre || "",
        cantidad: pago?.cantidad || 0,
        periodicidad: pago?.periodicidad || "Mensual",
        correo: pago?.correo || "",
        ultimoPago: pago?.ultimoPago || DateTime.local().toJSDate(), 
        proximoPago: pago?.proximoPago || DateTime.local().plus({months: 1}).toJSDate(),
        diasLimitePago: pago?.diasLimitePago || 0,
        diasAntesNotificacion: pago?.diasAntesNotificacion || 0,
        auditar: pago?.auditar || false,
        ...(pago?.periodicidad === "Personalizada" && { diasPersonalizada: pago.diasPersonalizada })
    }});

    useEffect(() =>{
    const periodicidad = watch("periodicidad");
    if(periodicidad === "Anual"){
        setValue("proximoPago", DateTime.fromJSDate(watch("ultimoPago")).plus({years: 1}).toJSDate());
    }else if(periodicidad === "Mensual"){
        setValue("proximoPago", DateTime.fromJSDate(watch("ultimoPago")).plus({months: 1}).toJSDate());
    }else{
        setValue("proximoPago", DateTime.fromJSDate(watch("ultimoPago")).plus({days: watch("diasPersonalizada")}).toJSDate());
    }
    }, [watch("ultimoPago"), watch("periodicidad"), watch("diasPersonalizada")]);

    return (
        <div className='flex flex-col justify-center items-center px-4 md:px-0'>
            <form onSubmit={handleSubmit(onSubmit)} className='p-4 rounded-md md:w-1/2 w-full bg-neutral-800 mt-12' autoComplete='off'>
                <div className='text-center text-2xl'>{title}</div>
                <div className='p-fluid mt-10 w-full grid grid-cols-12 gap-x-6 gap-y-8 items-center'>

                    <div className='col-span-12 md:col-span-6'>
                        <FloatLabel>
                            <Controller name="nombre" control={control} rules={{required: "El nombre es requerido"}} render={({field}) => (
                                <InputText {...field}/>
                            )}/>
                            <label>Nombre del Pago</label>
                        </FloatLabel>
                        {errors.nombre && <span className='text-xs text-red-500 ml-2'>{errors.nombre.message}</span>}
                    </div>

                    <div className='col-span-12 md:col-span-6'>
                        <FloatLabel>
                            <Controller name="cantidad" control={control} rules={{required: "La cantidad es requerida", min:{value: 1, message: "La cantidad debe ser mayor o igual que 1"} }} render={({field}) => (
                                <InputNumber mode="currency" currency="USD" {...field} onChange={(e) => field.onChange(e.value)} />
                            )}/>
                            <label>Cantidad</label>
                        </FloatLabel>
                        {errors.cantidad && <span className='text-xs text-red-500 ml-2'>{errors.cantidad.message}</span>}
                    </div>

                    <div className='col-span-12 md:col-span-6'>
                        <FloatLabel>
                            <Controller name="ultimoPago" control={control} render={({field}) => (
                                <Calendar {...field} locale='es' showIcon dateFormat="dd/M/yy"/>
                            )} />
                            <label>Último Pago</label>
                        </FloatLabel>
                        {errors.ultimoPago && <span className='text-xs text-red-500 ml-2'>{errors.ultimoPago.message}</span>}
                    </div>

                    <div className='col-span-12 md:col-span-6'>
                        <FloatLabel>
                            <Controller name="proximoPago" control={control} render={({field}) => (
                                <Calendar {...field} locale='es' showIcon dateFormat="dd/M/yy" disabled/>
                            )} />
                            <label>Próximo Pago</label>
                        </FloatLabel>
                    </div>

                    <div className='col-span-12'>
                        <FloatLabel>
                            <Controller name="periodicidad" control={control} render={({field}) => (
                                <Dropdown options={options} {...field} />
                            )} />
                            <label>Periodicidad</label>
                        </FloatLabel>
                    </div>

                    {
                    watch("periodicidad") === "Personalizada" && 
                    <div className='col-span-12'>
                        <FloatLabel>
                            <Controller name="diasPersonalizada" control={control} 
                                rules={{ min:{value: 1, message: "El día debe ser mayor o igual que 1"}, max:{ value: 31, message: "El día debe ser menor o igual a 31"} }}
                                render={({field}) => (
                                <InputNumber prefix="Cada " suffix=" días" {...field} onChange={(e) => field.onChange(e.value)} />
                            )} />
                            <label>Dias personalizados</label>
                        </FloatLabel>
                        {errors.diasPersonalizada && <span className='text-xs text-red-500 ml-2'>{errors.diasPersonalizada.message}</span>}
                    </div>
                    }

                    <div className='col-span-12'>
                        <FloatLabel>
                            <Controller name="correo" control={control} rules={{required: "El correo es requerido"}} render={({field}) => (
                                <InputText {...field} />
                            )} />
                            <label>Correo</label>
                        </FloatLabel>
                        {errors.correo && <span className='text-xs text-red-500 ml-2'>{errors.correo.message}</span>}
                    </div>

                    <div className='col-span-12 md:col-span-5'>
                        <FloatLabel>
                            <Controller name="diasLimitePago" control={control} 
                                rules={{required: "El día es requerido", min:{value: 0, message: "El día debe ser mayor o igual que 0"}, max:{ value: 31, message: "El día debe ser menor o igual a 31"} }}
                                render={({field}) => (
                                <InputNumber {...field} onChange={(e) => field.onChange(e.value)} suffix=" días" />
                            )} />
                            <label>Dias límite para el pago</label>
                        </FloatLabel>
                        {errors.diasLimitePago && <span className='text-xs text-red-500 ml-2'>{errors.diasLimitePago.message}</span>}
                    </div>

                        <div className='col-span-12 md:col-span-5'>
                            <FloatLabel>
                                <Controller name="diasAntesNotificacion" control={control} rules={{required: "El día es requerido", min:{value: 0, message: "El día debe ser mayor o igual que 0"}}}
                                    render={({field}) => (
                                    <InputNumber {...field}  onChange={(e) => field.onChange(e.value)} prefix="Notificarme " suffix=" días antes" />
                                )} />
                                <label>Notificación</label>
                            </FloatLabel>
                            {errors.diasAntesNotificacion && <span className='text-xs text-red-500 ml-2'>{errors.diasAntesNotificacion.message}</span>}
                        </div>

                        <div className='col-span-12 md:col-span-2'>
                            <Controller name="auditar" control={control} render={({field}) => (
                                <ToggleButton  id='auditar' onLabel="Auditar" offLabel="Auditar" checked={field.value} onChange={(e) => field.onChange(e.value)}/>
                            )} />
                            <Tooltip className='hidden md:inline' target="#auditar" content="Indica si los pagos se deben agregar en bitácora" position="top" />
                        </div>

                        <Button label='Guardar' className='col-span-12'/>
                </div>
        </form>
    </div>
  )
}
