import React from 'react'

export default function AgregarPeriodo({form, handleChange, handleSubmit}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="alias">Nombre del periodo: </label>
          <input type="text" name='alias' id='alias' value={form.alias} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor="fechaInicio">Fecha de incio</label>
          <input type="date" name='fechaInicio' id='fechaInicio' value={form.fechaInicio} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor="fechaCorte">Fecha de corte</label>
          <input type="date" name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange}/>
        </div>
        <div>
          <input type="submit" value="Agregar"/>
        </div>
      </form>
    </div>
  )
}
