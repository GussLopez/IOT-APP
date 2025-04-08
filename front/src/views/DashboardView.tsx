
import { useEffect, useState } from "react";
import DataCards from "../components/DataCards";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";
import Map from "../components/Map";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import { ChartLine, Clock, Drop, SquaresFour, Trash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Parcelas from "../components/Parcelas";




export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    const navigate = useNavigate()

    const token = localStorage.getItem('AUTH_TOKEN')
    if (!token) {
        navigate('/auth/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get('https://moriahmkt.com/iotapp/update/ ')
                    .then((res) => {
                        setData(res.data);
                    })
                    .catch((err) => console.log(err))

            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])
    return (
        <>
            <main className="bg-[#f6f8fb] min-h-screen flex relative">


                <Sidebar>

                    <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={true} link={'/'} />
                    <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={'/stats'} />
                    <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
                    <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
                    <SidebarItem icon={<Drop size={32} />} text={"Zona de Riegos"} active={false} alert={undefined} link={"/irrigation"} />


                </Sidebar>
                <div className="flex-1">
                    <Header />


                    <div className="xl:grid grid-cols-2 gap-10 max-w-screen-xl mx-auto px-4 my-5">
                        <div className="bg-white rounded-xl p-5 mb-5 xl:mb-0">
                            <h1 className="text-xl font-semibold text-gray-700 mb-5">Mapa de ubicaciones</h1>
                            <Map parcelas={data?.parcelas || []} />
                        </div>
                        <div>

                            <div className="grid grid-cols-2 gap-10 pb-20 xl:pb-0">
                                <DataCards data={data?.sensores || []} />
                            </div>
                        </div>
                    </div>
                    <Parcelas data={data?.parcelas || []} />
                </div>
            </main>
            <Footer />
        </>
    )
}
