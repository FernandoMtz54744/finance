import { Pago } from '@/interfaces/Pago'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { ToggleButton } from 'primereact/togglebutton'
import { Tooltip } from 'primereact/tooltip'

interface props {
    form: Pago,
    title: string,
    handleChange: (e: any) => void,
    handleSubmit: (e: any) => void
}

export default function PagoFormComponent({form, handleChange, handleSubmit, title}: props) {
    const options = ["Mensual", "Anual", "Personalizada"]

    return (
        <div className='flex flex-col justify-center items-center px-4 md:px-0'>
            <form onSubmit={handleSubmit} className='p-4 rounded-md md:w-1/2 w-full bg-neutral-800 mt-12' autoComplete='off'>
                <center className='text-2xl'>{title}</center>
                <div className='p-fluid mt-10 w-full'>
                    <div className='grid grid-cols-12 gap-x-6 items-center justify-between'>
                        <div className='mb-8 col-span-12 md:col-span-6'>
                            <FloatLabel>
                                <InputText name='nombre' id='nombre' value={form.nombre} onChange={handleChange}/>
                                <label htmlFor="nombre">Nombre del Pago</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-6'>
                            <FloatLabel>
                                <InputNumber mode="currency" currency="USD" name='cantidad' value={form.cantidad} onChange={(e) => handleChange({target: {name: 'cantidad', value: e.value}})} />
                                <label htmlFor="cantidad">Cantidad</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-6'>
                            <FloatLabel>
                                <Calendar name='ultimoPago' value={form.ultimoPago} onChange={handleChange} locale='es' showIcon dateFormat="dd/M/yy"/>
                                <label htmlFor="ultimoPago">Último Pago</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-6'>
                            <FloatLabel>
                                <Calendar name='proximoPago' value={form.proximoPago} onChange={handleChange} locale='es' showIcon dateFormat="dd/M/yy" disabled/>
                                <label htmlFor="proximoPago">Próximo Pago</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12'>
                            <FloatLabel>
                                <Dropdown value={form.periodicidad} onChange={handleChange} options={options} name='periodicidad'/>
                                <label htmlFor="periodicidad">Periodicidad</label>
                            </FloatLabel>
                        </div>

                        {
                        form.periodicidad === "Personalizada" && 
                        <div className='mb-8 col-span-12'>
                        <FloatLabel>
                            <InputNumber name='diasPersonalizada' value={form.diasPersonalizada} prefix="Cada " suffix=" días"
                                onChange={(e) => handleChange({target: {name: 'diasPersonalizada', value: e.value}})} />
                            <label htmlFor="diasPersonalizada">Dias personalizados</label>
                        </FloatLabel>
                        </div>
                        }

                        <div className='mb-8 col-span-12'>
                            <FloatLabel>
                                <InputText name='correo' value={form.correo} onChange={handleChange} />
                                <label htmlFor="correo">Correo</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-5'>
                            <FloatLabel>
                                <InputNumber name='diasLimitePago' value={form.diasLimitePago} suffix=" días" 
                                    onChange={(e) => handleChange({target: {name: 'diasLimitePago', value: e.value}})} />
                                <label htmlFor="diasLimitePago">Dias límite para el pago</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-5'>
                            <FloatLabel>
                                <InputNumber name='diasAntesNotificacion' value={form.diasAntesNotificacion} 
                                    onChange={(e) => handleChange({target: {name: 'diasAntesNotificacion', value: e.value}})} prefix="Notificarme " suffix=" días antes"/>
                                <label htmlFor="diasAntesNotificacion">Notificación</label>
                            </FloatLabel>
                        </div>

                        <div className='mb-8 col-span-12 md:col-span-2 flex justify-center'>
                            <ToggleButton checked={form.auditar} onChange={handleChange} name='auditar' id='auditar'
                                onLabel="Auditar" offLabel="Auditar" />
                            <Tooltip className='hidden md:inline' target="#auditar" content="Indica si los pagos se deben agregar en bitácora" position="top" />
                        </div>
                    </div>
                    <div className='my-4'>
                        <Button label='Guardar'/>
                    </div>
                </div>
        </form>
    </div>
  )
}
