import { Efectivo } from '@/interfaces/Efectivo'
import { currencyFormat } from '../../utils/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'

interface props {
    form: Efectivo,
    handleChange: (e: any)=>void,
    agregarEfectivo: (e: any)=>void,
    sumaEfectivo: (efectivo: Efectivo) => number
}

export default function AgregaEfectivo({form, handleChange, agregarEfectivo, sumaEfectivo}: props) {
  return (
    <table>
        <thead className='bg-teal-950 text-center'>
            <tr>
                <td className='py-2 rounded-l-lg px-8'>Billetes</td>
                <td>Cantidad</td>
                <td className='rounded-r-lg px-8'>Total</td>
            </tr>
        </thead>
        <tbody className='text-center'>
            <tr>
                <td>$50</td>
                <td>
                    <InputNumber value={form.cincuenta} onChange={(e) => handleChange({target: {name: 'cincuenta', value: e.value}})} placeholder='0 billetes'  suffix=' billetes' min={0}/>
                </td>
                <td>{currencyFormat(form.cincuenta * 50)}</td>
            </tr>
            <tr>
                <td>$100</td>
                <td className='w-3xs'>
                    <InputNumber value={form.cien} onChange={(e) => handleChange({target: {name: 'cien', value: e.value}})} placeholder='0 billetes' suffix=' billetes' min={0}/>
                </td>
                <td>{currencyFormat(form.cien * 100)}</td>
            </tr>
            <tr>
                <td>$200</td>
                <td className='w-3xs'>
                    <InputNumber value={form.doscientos} onChange={(e) => handleChange({target: {name: 'doscientos', value: e.value}})} placeholder='0 billetes' suffix=' billetes' min={0}/>
                </td>
                <td>{currencyFormat(form.doscientos * 200)}</td>
            </tr>
            <tr>
                <td>$500</td>
                <td className='w-3xs'>
                    <InputNumber value={form.quinientos} onChange={(e) => handleChange({target: {name: 'quinientos', value: e.value}})} placeholder='0 billetes' suffix=' billetes' min={0}/>
                </td>
                <td>{currencyFormat(form.quinientos * 500)}</td>
            </tr>
            <tr>
                <td colSpan={2} className='p-4'> Total en efectivo </td>
                <td>{currencyFormat(sumaEfectivo(form))}</td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <div className='p-fluid w-full'>
                        <Button onClick={agregarEfectivo} label="Registrar efectivo"/>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  )
}
