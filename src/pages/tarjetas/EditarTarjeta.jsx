import React from 'react'

export default function EditarTarjeta({form, handleChange, handleSubmit}) {
  return (
    <div>
    <form className='default-form' onSubmit={handleSubmit}>
        <center>
            Editar Tarjeta
        </center>
        <div>
            <label htmlFor="alias">Nombre de la tarjeta</label>
            <div className='alias-color-container'>
                <input type="text" name='alias' id='alias' value={form.alias} onChange={handleChange} autoComplete='off' className='input-form alias-input'/>
                <input type="color" name='color' id='color' value={form.color} onChange={handleChange} className='input-color'/>
            </div>
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
