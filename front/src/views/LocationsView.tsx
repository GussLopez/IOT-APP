import { SquaresFour, ChartLine, MapPinArea, Clock, Trash } from "@phosphor-icons/react";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LocationsView() {

    return (
        <>
            <main className="bg-[#f6f8fb] min-h-screen flex relative">


                <Sidebar>

                    <SidebarItem icon={<SquaresFour size={32} />} text={"Dashboard"} alert active={false} link={'/'} />
                    <SidebarItem icon={<ChartLine size={32} />} text={"Estadísticas"} active={false} alert={undefined} link={'/stats'} />
                    <SidebarItem icon={<Clock size={32} />} text={"Historial"} active={false} alert={undefined} link={"/historial"} />
                    <SidebarItem icon={<Trash size={32} />} text={"Eliminados"} active={false} alert={undefined} link={"/deleted"} />
                    <SidebarItem icon={<MapPinArea size={32} />} text={"Locations"} active={true} alert={undefined} link={"/locations"} />

                </Sidebar>
                <div className="flex-1">
                    <Header />
                    <div className=" max-w-screen-xl mx-auto px-4 my-5">

                        <h1 className="text-xl font-semibold text-gray-700 mb-5">Ubicaciones</h1>
                    </div>

                </div>
            </main>
            <Footer />

        </>
    )
}
