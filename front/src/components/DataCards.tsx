import { Thermometer, Drop, SunHorizon, CloudRain } from "@phosphor-icons/react";
import Card from "../components/Card";
import Spinner from "./Spinner";

export default function DataCards({ data }: any) {

    if (!data) return <Spinner />;
    return (
        <>
            <Card
                title={"Temperatura"}
                icon={<Thermometer size={32}
                    color="#ff0061"
                    weight="fill"
                />}
                bgIconColor={"ffe8f1"}
                data={`${data.temperatura} °C`} />
            <Card
                icon={<Drop size={32} color="#0052ff" weight="fill" />}
                title={"Humedad"}
                data={`${data.humedad} %`}
                bgIconColor={"edf3ff"}
            />
            <Card
                icon={<CloudRain size={32} color="#00b9ff" weight="fill" />}
                title={"Lluvia"}
                data={`${data.lluvia} mm`}
                bgIconColor={"e8f9ff"}
            />
            <Card
                icon={<SunHorizon size={32} color="#ff4000" weight="fill" />}
                title={"Sol "}
                data={`${data.sol} W/m`}
                bgIconColor={"ffebe4"}
            />
        </>
    )
}
