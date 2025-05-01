import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { TarjetaForm } from '@/interfaces/forms/TarjetaForm';

interface props {
    form: TarjetaForm,
    title: string,
    isEdit: boolean
    handleChange: (e: any)=> void,
    handleSubmit: (e: any)=> void
}

export default function TarjetaFormComponent({form, title, isEdit, handleChange, handleSubmit}: props) {
    const tipos = ["Débito", "Crédito"]

    return (
        <div className='flex flex-col justify-center items-center'>
            <form className='p-4 rounded-md md:w-1/2 sm:w-full bg-neutral-800 mt-12 mx-4' onSubmit={handleSubmit} autoComplete="off">
                <div className='text-center text-2xl mt-2 mb-5'>{title}</div>
                <div className='p-fluid'>
                    <div className='grid grid-cols-12 items-center'>
                        <div className='mb-8 col-span-12'>
                            <FloatLabel>
                                <InputText value={form.nombre} onChange={handleChange} name='nombre' id='nombre'/>
                                <label htmlFor="nombre">Nombre</label>
                            </FloatLabel>
                        </div>
                        <div className='mb-8 md:col-span-11 col-span-10'>
                            <FloatLabel>
                                <Dropdown value={form.tipo} onChange={handleChange} options={tipos} name="tipo" id="tipo" disabled={isEdit}/>
                                <label htmlFor="tipo">Tipo</label>
                            </FloatLabel>
                        </div>
                        <div className='mb-8 md:col-span-1 col-span-2 pl-2'>
                            <ColorPicker format="hex" value={form.color} onChange={handleChange} name='color' id='color'/>
                        </div>
                        <div className='mb-8 col-span-12 md:col-span-12'>
                            <FloatLabel>
                                <InputNumber name='diaCorte' id='diaCorte' value={form.diaCorte} onValueChange={handleChange} 
                                    min={1} max={31} prefix="Día " suffix=" de cada mes" showButtons/>
                                <label htmlFor="diaCorte">Día de corte</label>
                            </FloatLabel>
                        </div>
                        <div className='mb-8 col-span-12'>
                            <FloatLabel>
                                <InputText name='correo' id='correo' value={form.correo} onChange={handleChange}/>
                                <label htmlFor="correo">Correo</label>
                            </FloatLabel>
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
