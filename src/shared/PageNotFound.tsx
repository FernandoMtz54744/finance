import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
        <div className="text-2xl">PÁGINA NO ENCONTRADA</div>
        <Link to="/" className="bg-teal-950 p-2 rounded-md">Regresar</Link>
    </div>
  )
}
