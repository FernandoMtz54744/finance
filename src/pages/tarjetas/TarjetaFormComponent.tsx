import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Controller, useForm } from 'react-hook-form';
import { Tarjeta } from '@/interfaces/Tarjeta';
import { TarjetaForm } from '@/interfaces/forms/TarjetaForm';

interface props {
    tarjeta?: Tarjeta
    title: string,
    isEdit: boolean
    onSubmit: (e: any)=> void
}

export default function TarjetaFormComponent({ tarjeta, title, isEdit, onSubmit}: props) {
    const tipos = ["Débito", "Crédito"]

    const { handleSubmit, control, formState: {errors} } = useForm<TarjetaForm>({defaultValues: {
        nombre: tarjeta?.nombre || '',
        tipo: tarjeta?.tipo || 'Débito',
        color: tarjeta?.color || "ffffff",
        diaCorte: tarjeta?.diaCorte || 1,
        correo: tarjeta?.correo || ''
    }});

    return (
        <div className='flex flex-col justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" 
                className='p-4 rounded-md md:w-1/2 sm:w-full bg-neutral-800 mt-12 mx-4'>
                <div className='text-center text-2xl mt-2 mb-6'>{title}</div>

                <div className='p-fluid grid grid-cols-12 gap-y-10 items-center'>
                    <div className='col-span-12'>
                        <FloatLabel >
                            <Controller name="nombre" control={control} rules={{required: "El nombre es requerido"}} render={({field}) => (
                                <InputText {...field}/>
                            )} />
                            <label>Nombre</label>
                        </FloatLabel>
                        {errors.nombre && <span className='text-xs text-red-500 ml-2'>{errors.nombre.message}</span>}
                    </div>

                    <div className='md:col-span-11 col-span-10'>
                        <FloatLabel >
                            <Controller name="tipo" control={control} render={({field}) => (
                                <Dropdown options={tipos} {...field} disabled={isEdit}/>
                            )}/>
                            <label>Tipo</label>
                        </FloatLabel>
                        
                    </div>

                    <Controller name="color" control={control} rules={{validate: (value) => value !== "ffffff"}} render={({field}) => (
                        <ColorPicker format="hex" {...field} className="md:col-span-1 col-span-2 pl-2"/>
                    )}/>

                    <div className='col-span-12 md:col-span-12'>
                        <FloatLabel >
                            <Controller name="diaCorte" control={control} 
                                rules={{ min:{value: 1, message: "El día debe ser mayor o igual que 1"}, max: {value: 31, message: "El día debe ser menor o igual que 31"}}} 
                                render={({field}) => (
                                <InputNumber {...field}  onChange={(e) => field.onChange(e.value)} prefix="Día " suffix=" de cada mes" showButtons/>
                                )} />
                            <label>Día de corte</label>
                        </FloatLabel>
                        {errors.diaCorte && <span className='text-xs text-red-500 ml-2'>{errors.diaCorte.message}</span>}
                    </div>
                                
                    <div className='col-span-12'>
                        <FloatLabel >
                            <Controller name="correo" control={control} rules={{required: "El correo es requerido"}} render={({field}) => (
                                <InputText {...field}/>
                            )} />
                            <label>Correo</label>
                        </FloatLabel>
                        {errors.correo && <span className='text-xs text-red-500 ml-2'>{errors.correo.message}</span>}
                    </div>

                    <Button className='col-span-12' label='Guardar'/>
                </div>

            </form>
        </div>
    )
}
