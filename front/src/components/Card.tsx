import { ReactNode } from "react"

interface CardProps {
    title: string,
    icon: ReactNode,
    bgIconColor: string,
    data: string,
}

export default function Card({ title, icon, bgIconColor, data }: CardProps) {

    return (
        <>
            <div className="h-[150px] flex flex-col text-center sm:text-start sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 bg-white p-4 sm:p-5 rounded-lg -sm hover:-md transition-">
                <div
                    className={"w-20 h-20 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded flex justify-center items-center flex-shrink-0"}
                    style={{ backgroundColor: `#${bgIconColor}` }}
                >
                    {icon}
                </div>
                <div>
                    <h2 className="text-gray-500 text-[16px] font-semibold uppercase tracking-wide">{title}</h2>
                    <p className="font-bold text-xl md:text-xl">{data}</p>
                </div>
            </div>
        </>
    )
}
