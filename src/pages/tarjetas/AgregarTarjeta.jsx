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
    // <div>
    //     <form  style={{backgroundColor: "white"}} className='flex flex-row items-center'>
    //         <div className='formgrid grid'>
    //             <div className='col-12'>
    //                 <InputText  value={form.alias} onChange={handleChange} name='alias' id='alias' autoComplete='off'/>
    //             </div>
    //         </div>
            
    //         <div className='field col-12'>
    //             <div className='formgroup-inline'>
    //                 <Dropdown className='field' value={form.tipo} onChange={handleChange} options={tipos} name="tipo" id="tipo" placeholder="Tipo"/>
    //                 <ColorPicker className='field' format="hex" value={form.color} onChange={handleChange} name='color' id='color'/>
    //             </div>
    //         </div>
                
            
            
    //         <div className='field col-12'>
    //             <Calendar className='field' 
    //                 name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange}/>
    //                 <Calendar className='field' 
    //                 name='fechaLimitePago' id='fechaLimitePago' value={form.fechaLimitePago} onChange={handleChange}/>
    //         </div>
    //         <div className='field col-12'>
    //             <FloatLabel>
    //                 <InputText name='correo' id='correo' value={form.correo} onChange={handleChange} autoComplete='off'/>
    //                 <label htmlFor="correo">Correo</label>
    //             </FloatLabel>
    //         </div>
    //         <div className='field col-12'>
    //             <Button label='Registrar' />
    //         </div>
    //     </form>
    // </div>
    <div>
        <form className='default-form' onSubmit={handleSubmit}>
            <center>
                Tarjeta
            </center>
            <div>
                <label htmlFor="alias">Nombre de la tarjeta</label>
                <div className='alias-color-container'>
                    <input type="text" name='alias' id='alias' value={form.alias} onChange={handleChange} autoComplete='off' className='input-form alias-input'/>
                    <input type="color" name='color' id='color' value={form.color} onChange={handleChange} className='input-color'/>
                </div>
            </div>
            <div>
                <label htmlFor="tipo">Tipo</label>
                <select name="tipo" id="tipo" value={form.tipo} onChange={handleChange} className="input-select">
                    <option value="Débito">Débito</option>
                    <option value="Crédito">Crédito</option>
                </select>
            </div>
            <div>
                <label htmlFor="fechaCorte">Fecha de corte</label>
                <input type="date" name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange} className='input-date'/>
            </div>
            {form.tipo === "Crédito"?(
            <div>
                <label htmlFor="fechaLimitePago">Fecha limite de pago</label>
                <input type="date" name='fechaLimitePago' id='fechaLimitePago' value={form.fechaLimitePago} onChange={handleChange} className='input-date'/>
            </div>
            ):("")}
            <div>
                <label htmlFor="correo">Correo de notificaciones</label>
                <input type="email" name='correo' id='correo' value={form.correo} onChange={handleChange} autoComplete='off' className='input-form alias-input'/>
            </div>
            
            <div>
                <input type="submit" value="Agregar" className='submit-button'/>
            </div>
        </form>
    </div>
  )
}
