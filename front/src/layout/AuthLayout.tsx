import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {

    return (
        <>
            <div className="bg-[#f6f8fb] min-h-screen pt-20">
                <Outlet />

            </div>

            <Toaster position="bottom-right" richColors />
        </>
    )
}
