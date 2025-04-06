import { MetaLogo } from "@phosphor-icons/react";

export default function Footer() {

    return (
        <>
            <footer className="py-10 bg-white border-t-1 border-gray-200">
                <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-5 items-center py-3">
                        <MetaLogo size={30} weight="bold" color="#0032ff" />
                        <p className="text-2xl font-semibold">Dashboard</p>
                    </div>
                    <p className="text-gray-400">© 2025 Todos los derechos reservados</p>

                </div>
            </footer>
        </>
    )
}
