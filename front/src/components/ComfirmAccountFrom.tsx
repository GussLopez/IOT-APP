import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import api from "../config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ConfirmACcountForm() {
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    const handleChange = (token: string) => {
        setToken(token)
    }

    const handleComplete = async (token: string) => {
        
        try {
            const { data } = await api.post(`/api/auth/confirm-account`, {token})
            console.log(data);
            toast.success(data)
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000);
        } catch (error) {
            console.log(error);
            toast.error('Token no válido')
        }
    }
    return (
    <>
    <div className="flex justify-center gap-5 my-10">
        <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
        >
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
            <PinInputField className="h-10 w-10 border border-gray-300 placeholder-white shadow rounded-lg text-center outline-none focus:ring-1" />
        </PinInput>

    </div>
    </>  
    )  
}