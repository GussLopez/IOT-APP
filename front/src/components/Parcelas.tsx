import { Calendar, MapPin, User } from "@phosphor-icons/react";
import Spinner from "./Spinner";

export default function Parcelas({ data }: any) {
  const parcelas = data
  console.log(parcelas);

  if (!parcelas) return <Spinner />
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-5">Parcelas</h2>
        <div className="md:grid md:grid-cols-4 gap-5">

          {parcelas.map((parcela: any) => (
            <div key={parcela.id} className="bg-white p-5 rounded-lg [&>div]:mb-2 mb-5">
              <h4 className="textl-xl font-semibold mb-3 text-indigo-400">{parcela.nombre}</h4>
              <div className="flex gap-3 items-center">
                <MapPin size={24}/>
                <p>{parcela.ubicacion}</p>
              </div>
              <div className="flex gap-3 items-center">
                <User size={24}/>
                <p>{parcela.responsable}</p>
              </div>
              <div className="flex gap-3 items-center">
                <Calendar size={24}/>
                <p>Ultimo Riego: {parcela.ultimo_riego}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
