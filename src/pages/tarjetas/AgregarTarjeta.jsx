import React from 'react'
import "../../styles/form.css"
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

export default function AgregarTarjeta({form, handleChange, handleSubmit}) {
    const tipos = ["Débito", "Crédito"]

  return (
    <div className='flex justify-content-center'>
        <form className='p-4 border-round-sm md:w-6 sm:w-full surface-0 mt-8 mx-4' onSubmit={handleSubmit}>
            <div className='text-center text-2xl mt-2 mb-5'>Agregar Tarjeta</div>
            <div className='p-fluid'>
                <div className='grid align-items-center p-fluid'>
                    <div className='field col-12'>
                        <FloatLabel>
                            <InputText value={form.alias} onChange={handleChange} name='alias' id='alias' autoComplete='off'/>
                            <label htmlFor="alias">Alias</label>
                        </FloatLabel>
                    </div>
                    <div className='field md:col-11 col-10'>
                        <Dropdown value={form.tipo} onChange={handleChange} options={tipos} name="tipo" id="tipo" placeholder="Tipo"/>
                    </div>
                    <div className='field md:col-1 col-2'>
                        <ColorPicker format="hex" value={form.color} onChange={handleChange} name='color' id='color'/>
                    </div>
                    <div className={`field col-12 ${form.tipo === "Crédito"?"md:col-6":"md:col-12"}`}>
                        <FloatLabel>
                            <Calendar name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange}/>
                            <label htmlFor="fechaCorte">Fecha de corte</label>
                        </FloatLabel>
                    </div>
                    {
                    form.tipo === "Crédito" && 
                    <div className= 'field md:col-6 col-12'>
                        <FloatLabel>
                                <Calendar name='fechaLimitePago' id='fechaLimitePago' value={form.fechaLimitePago} onChange={handleChange}/>
                                <label htmlFor="fechaLimitePago">Fecha límite de pago</label>
                        </FloatLabel>
                    </div>
                    }
                    
                    <div className='field col-12'>
                        <FloatLabel>
                            <InputText name='correo' id='correo' value={form.correo} onChange={handleChange} autoComplete='off'/>
                            <label htmlFor="correo">Correo</label>
                        </FloatLabel>
                    </div>
                </div>
                <Button label='Registrar'/>
            </div>
        </form>
    </div>
  )
}
