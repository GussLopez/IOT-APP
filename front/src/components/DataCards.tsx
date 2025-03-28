import { Thermometer, Drop, SunHorizon, CloudRain } from "@phosphor-icons/react";
import Card from "../components/Card";
import Spinner from "./Spinner";

export default function DataCards({ data }: any) {

    if (!data) return <Spinner />;
    return (
        <>
            <Card
                title={"Temperature"}
                icon={<Thermometer size={32}
                    color="#ff0061"
                    weight="fill"
                />}
                bgIconColor={"ffe8f1"}
                data={data.temperatura} />
            <Card
                icon={<Drop size={32} color="#0052ff" weight="fill" />}
                title={"HUMIDITY"}
                data={data.humedad}
                bgIconColor={"edf3ff"}
            />
            <Card
                icon={<CloudRain size={32} color="#00b9ff" weight="fill" />}
                title={"RAIN"}
                data={data.lluvia}
                bgIconColor={"e8f9ff"}
            />
            <Card
                icon={<SunHorizon size={32} color="#ff4000" weight="fill" />}
                title={"SUN INTENSITY "}
                data={data.sol}
                bgIconColor={"ffebe4"}
            />
        </>
    )
}
