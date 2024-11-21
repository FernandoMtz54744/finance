import React from 'react'
import "../../styles/form.css"

export default function AgregarTarjeta({form, handleChange, handleSubmit}) {
  return (
    <div>
        <form className='agrega-tarjeta-form' onSubmit={handleSubmit}>
            <div>
                <label htmlFor="alias">Alias</label>
                <input type="text" name='alias' id='alias' value={form.alias} onChange={handleChange} autoComplete='off'/>
            </div>
            <div>
                <label htmlFor="fechaCorte">Fecha de corte</label>
                <input type="date" name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="color">Color (Hexadecimal)</label>
                <input type="color" name='color' id='color' value={form.color} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="tipo">Tipo</label>
                <select name="tipo" id="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="Débito">Débito</option>
                    <option value="Crédito">Crédito</option>
                </select>
            </div>
            <div>
                <input type="submit" value="Agregar"/>
            </div>
        </form>
    </div>
  )
}
