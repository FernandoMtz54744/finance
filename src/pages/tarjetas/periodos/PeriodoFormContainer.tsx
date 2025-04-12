import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { PeriodoForm } from '@/interfaces/forms/PeriodoForm'
import { Tarjeta } from '@/interfaces/Tarjeta'
import { ToggleButton } from 'primereact/togglebutton'
import { Tooltip } from 'primereact/tooltip'
import { DateTime } from 'luxon'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useState } from 'react'

interface props {
  form: PeriodoForm,
  tarjeta: Tarjeta,
  fechaLimitePago: Date,
  title: string,
  isEdit: boolean,
  handleChange: (e: any)=>void,
  submitFunction: ()=>void,
}

export default function PeriodoFormContainer({form,fechaLimitePago,tarjeta,title, isEdit,handleChange, submitFunction}: props) {

  const [isvalidarFechasActive, setValidarFechasActive] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!validaPeriodo(form)){
      toast.error("Complete los campos")
      return;
    }

    if(isvalidarFechasActive){
      if(!verificaFechasValidas(form))
        return;
    }else{
      const result  = await Swal.fire({
              title: 'Validación de fechas',
              text: "La validación de fechas está desactivada ¿desea continuar?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'Cancelar',
            });
      if(!result.isConfirmed)
        return;     
    }
    submitFunction();
  }

  const verificaFechasValidas = (form: PeriodoForm): boolean=>{
    //Valida dia de inicio
    const diaInicio = DateTime.fromJSDate(form.fechaInicio).day;
    const diaInicioValido = tarjeta.diaCorte % 31 + 1;
    if(diaInicio !== diaInicioValido){
      toast.error("El día de inicio debe ser un " + diaInicioValido);
      return false;
    }
    //Valida dia de corte
    const diaCorte = DateTime.fromJSDate(form.fechaCorte).day;
    const diaCorteValido = tarjeta.diaCorte;
    if(diaCorte !== diaCorteValido){
      toast.error("El día de corte debe ser un " + diaCorteValido);
      return false;
    }
    //Valida dias del periodo
    const fechaInicio = DateTime.fromJSDate(form.fechaInicio);
    const fechaCorte = DateTime.fromJSDate(form.fechaCorte);
    const diferencia = fechaInicio.diff(fechaCorte, "months").months;
    if(Math.abs(diferencia) > 1) {
      toast.error("No puede haber diferencia de más de un mes entre las fechas de inicio y corte");
      return false;
    }

    if(fechaCorte <= fechaInicio){
      toast.error("La fecha de corte debe ser posterior a la de inicio");
      return false;
    }

    return true;
  }

  const validaPeriodo = (form: PeriodoForm)=>{
    if(!form.idUsuario) return false;
    if(!form.idTarjeta) return false;
    if(!form.nombre) return false;
    if(!form.fechaInicio) return false;
    if(!form.fechaCorte) return false;
    if(form.saldoInicial < 0) return false;
    if(!isEdit){
      if(form.saldoFinal !== form.saldoInicial ) return false;
      if(form.totalPeriodo !== 0) return false;
    }
    return true;
  }

  return (
    <div className='flex flex-col justify-center items-center px-4 md:px-0'>
      <form onSubmit={handleSubmit} className='p-4 rounded-md md:w-1/2 w-full bg-neutral-800 mt-12' autoComplete='off'>
        <div className='flex justify-center mb-8 items-center relative flex-col'>
          <div className='text-2xl'>{title}</div>
          <div className='md:absolute md:right-0 mt-5 md:mt-0'>
            <ToggleButton
              id='fechasToggle' checked={isvalidarFechasActive} offLabel="Fechas" onLabel='Fechas'
              pt={{ label: { style: { fontSize: '14px' }}}}
              onChange={(e)=> setValidarFechasActive(e.value)} 
              />
              <Tooltip className='hidden md:inline' target="#fechasToggle" content="Activa o desactiva la validación de fechas" position="top" />
          </div>
        </div>
        <div className='p-fluid'>
          <div className='grid grid-cols-12 items-center'>
            <div className='mb-8 col-span-12'>
              <FloatLabel>
                <InputText name='nombre' id='nombre' value={form.nombre} onChange={handleChange} />
                <label htmlFor="nombre">Nombre del periodo</label>
              </FloatLabel>
            </div>
            <div className='mb-8 col-span-12'>
              <FloatLabel>
                <Calendar name='fechaInicio' id='fechaInicio' value={form.fechaInicio} onChange={handleChange} showIcon dateFormat="dd/M/yy" locale="es"/>
                <label htmlFor="fechaInicio">Fecha de incio {isvalidarFechasActive?`(día ${tarjeta.diaCorte%31 + 1})`:"(validación desactivada)"}</label>
              </FloatLabel>
            </div>
            <div className='mb-8 col-span-12'>
              <FloatLabel>
                <Calendar name='fechaCorte' id='fechaCorte' value={form.fechaCorte} onChange={handleChange} showIcon dateFormat="dd/M/yy" locale="es"/>
                <label htmlFor="fechaCorte">Fecha de corte {isvalidarFechasActive?`(día ${tarjeta.diaCorte})`:"(validación desactivada)"}</label>
              </FloatLabel>
            </div>
            {tarjeta.tipo === "Crédito" && 
            <div className='mb-8 col-span-12'>
              <FloatLabel>
                <Calendar name='fechaLimitePago' id='fechaLimitePago' value={fechaLimitePago} disabled showIcon dateFormat="dd/M/yy" locale="es"/>
                <label htmlFor="fechaLimitePago">Fecha límite de pago</label>
              </FloatLabel>
            </div>
            }
            <div className='mb-8 col-span-12'>
              <FloatLabel>
                <InputNumber mode="currency" currency="USD" name='saldoInicial' id='saldoInicial' value={form.saldoInicial} onValueChange={handleChange} />
                <label htmlFor="saldoInicial">Saldo inicial</label>
              </FloatLabel>
            </div>
          </div>
          <div className='my-4'>
              <Button label='Guardar'/>
          </div>
        </div>
      </form>
    </div>
  )
}
