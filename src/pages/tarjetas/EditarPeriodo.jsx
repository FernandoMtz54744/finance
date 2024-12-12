import React from 'react'

export default function EditarPeriodo({form, handleChange, handleSubmit, tarjeta}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className='default-form'>
        <center>Periodo</center>
        <div>
          <label htmlFor="alias">Nombre del periodo</label>
          <input type="text" name='alias' id='alias' value={form.alias} onChange={handleChange} autoComplete='off' className='input-form'/>
        </div>
        <div>
          <label htmlFor="fechaInicio">Fecha de incio</label>
          <input type="date" name='fechaInicio' id='fechaInicio' value={form.fechaInicio} onChange={handleChange} className='input-date'/>
        </div>
        <div>
          <label htmlFor="fechaCorte">Fecha de corte</label>
          <input type="date" name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange} className='input-date'/>
        </div>
        {tarjeta.tipo === "Crédito" && (
        <div>
          <label htmlFor="fechaLimitePago">Fecha límite de Pago</label>
          <input type="date" name='fechaLimitePago' id='fechaLimitePago' value={form.fechaLimitePago} onChange={handleChange} className='input-date'/>
        </div>
        )}
        <div>
          <label htmlFor="saldoInicial">Saldo inicial</label>
          <input type="number" name='saldoInicial' id='saldoInicial' value={form.saldoInicial} onChange={handleChange} className='input-form'/>
        </div>
        <div>
          <input type="submit" value="Agregar" className='submit-button'/>
        </div>
      </form>
    </div>
  )
}
