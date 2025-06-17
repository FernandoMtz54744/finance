import { Rendimiento } from "@/interfaces/Rendimiento"
import TitleComponent from "@/shared/components/TitleComponent";
import * as Utils from "@/utils/utils"
import { DateTime } from "luxon";

interface props {
    rendimientos: Rendimiento[]
}

export default function Rendimientos({rendimientos} : props) {
    // Agrupa los rendimientos por mes-año
    const rendimientosPorMes = rendimientos.reduce((acumulado, rendimiento) => {
        const fecha = DateTime.fromJSDate(rendimiento.fecha);
        const claveMes = fecha.toFormat('yyyy-MM');

        if (!acumulado[claveMes]) {
            acumulado[claveMes] = [];
        }

        acumulado[claveMes].push(rendimiento);
        return acumulado;
    }, {} as Record<string, Rendimiento[]>);

    //Ordenando por fecha
    const clavesOrdenadas = Object.keys(rendimientosPorMes).sort((a, b) => {
        return DateTime.fromFormat(b, 'yyyy-MM').toMillis() - DateTime.fromFormat(a, 'yyyy-MM').toMillis();
    });


  return (
    <div className="p-4 flex flex-col items-center">
        <div className='text-3xl mt-2 mb-4'>Rendimientos</div>
        {clavesOrdenadas.map(clave => {
            const rendimientosDelMes = rendimientosPorMes[clave];
            const fechaMes = DateTime.fromFormat(clave, 'yyyy-MM').setLocale('es');
            const totalMes = rendimientosDelMes.reduce((acc, r) => acc + r.cantidad, 0);

        return (
          <div key={clave} className="my-2 space-y-2 w-full">
            <div className="text-lg">{fechaMes.toFormat('MMMM yyyy')[0].toUpperCase() + fechaMes.toFormat('MMMM yyyy').slice(1)}</div>
            {rendimientosDelMes.map((rendimiento, i) => (
              <div key={i} className="flex flex-row justify-around bg-teal-950 p-2 rounded-md">
                <div>{Utils.convertDate(rendimiento.fecha)}</div>
                <div>{rendimiento.nombreTarjeta}</div>
                <div className="inline-flex items-center gap-1">
                  {Utils.currencyFormat(rendimiento.cantidad)}
                  <i className="pi pi-arrow-circle-up text-green-500"></i>
                </div>
              </div>
            ))}
            <div className="text-right text-green-400 my-2">
              Total {fechaMes.toFormat('MMMM')}: {Utils.currencyFormat(totalMes)}
            </div>
          </div>
        );
      })}
    </div>
  );
}