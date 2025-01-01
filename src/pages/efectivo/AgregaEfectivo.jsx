import React from 'react'
import { currencyFormat } from '../../utils/utils'

export default function AgregaEfectivo({form, handleChange, agregarEfectivo, sumaEfectivo}) {


  return (
    <div>
        <div className='table-efectivo-container'>
            <table className='table-efectivo'>
                <thead>
                    <tr>
                        <td>Billetes</td><td>Cantidad</td><td>Total</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>$50</td><td><input type="number" name='cincuenta' value={form.cincuenta} onChange={handleChange} placeholder='0'/></td><td>{currencyFormat(form.cincuenta * 50)}</td>
                    </tr>
                    <tr>
                        <td>$100</td><td><input type="number" name='cien' value={form.cien} onChange={handleChange} placeholder='0'/></td><td>{currencyFormat(form.cien * 100)}</td>
                    </tr>
                    <tr>
                        <td>$200</td><td><input type="number" name='doscientos' value={form.doscientos} onChange={handleChange} placeholder='0'/></td><td>{currencyFormat(form.doscientos * 200)}</td>
                    </tr>
                    <tr>
                        <td>$500</td><td><input type="number" name='quinientos' value={form.quinientos} onChange={handleChange} placeholder='0'/></td><td>{currencyFormat(form.quinientos * 500)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><div className='total-efectivo'>Total efectivo</div></td>
                        <td>{currencyFormat(sumaEfectivo(form.cincuenta, form.cien,form.doscientos,form.quinientos))}</td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            <button onClick={agregarEfectivo} className='add-efectivo-button'>Registrar efectivo</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}
