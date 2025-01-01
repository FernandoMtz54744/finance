import React from 'react'

export default function AgregarPago({form, handleChange, handleSubmit}) {
  return (
    <div>
        <form className='default-form' onSubmit={handleSubmit}>
            <center>
                Agregar Pago Recurrente
            </center>
            <div>
                <label htmlFor="nombre">Nombre del pago</label>
                <input type="text" name='nombre' id='nombre' value={form.nombre} onChange={handleChange} autoComplete='off' className='input-form alias-input'/>
            </div>
            <div>
                <label htmlFor="cantidad">Cantidad</label>
                <input type='cantidad' name='cantidad' value={form.cantidad} onChange={handleChange} autoComplete='off' className='input-form alias-input'/>
            </div>
            <div>
                <label htmlFor="fechaPago">Fecha de Pago</label>
                <input type="date" name='fechaPago' id='fechaPago' value={form.fechaPago} onChange={handleChange} className='input-date'/>
            </div>
            <div>
                <label htmlFor="periodicidad">Periodicidad</label>
                <select name="periodicidad" id="periodicidad" value={form.periodicidad} onChange={handleChange} className="input-select">
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                </select>
            </div>
            <div>
                <div className='checkbox-container2'>
                    <label htmlFor="checkbox">Tiene fecha límite</label>
                    <input type="checkbox" name='hasFechaLimite' checked={form.hasFechaLimite} onChange={handleChange}/>
                </div>
            </div>
            {form.hasFechaLimite && (
            <div>
                <label htmlFor="diasLimitePago">Días límite para hacer el pago</label>
                <input type="number" name='diasLimitePago' id='diasLimitePago' value={form.diasLimitePago} onChange={handleChange} className='input-date'/>
            </div>
            )}
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
