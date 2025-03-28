import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import api from "../config/axios";
import ErrorMessage from "../components/ErrorMessage";
import { LoginForm } from "../types";

export default function LoginView() {
    const [viewPassword, setViewPassword] = useState(false)
    const navigate = useNavigate()

    const initialValues : LoginForm = {
        email: '',
        password: ''
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

    const handleLogin = async (formData : LoginForm ) => {
       try {
        const { data } = await api.post(`/api/auth/login`, formData)

        localStorage.setItem('AUTH_TOKEN', data)
        toast.success('Inicio de sesión correcto')
        setTimeout(() => {
            navigate('/')
            window.location.reload()
        }, 2000);
       } catch (error: any) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error) 
            }
       }
       
    }

    return (
        <>
            <div className="px-4">
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="max-w-[450px] mx-auto p-5 rounded-lg flex flex-col gap-5 bg-white shadow-lg text-[17px]"
                >
                    <h1 className="text-3xl mt-5 font-semibold text-center text-gray-700">Login</h1>
                    <div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                            {...register('email', {
                                required: 'The email is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Invalid email'
                                }
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={viewPassword ? 'text' : 'password'}
                            className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                            placeholder="Password"
                            {...register('password', {
                                required: 'The password is required',
                            })}
                        />
                        <button 
                            onClick={() => setViewPassword(!viewPassword)}
                            type="button"
                            className="absolute top-4 right-3 text-gray-600 ">
                           {viewPassword ? <EyeSlash size={22} /> : <Eye size={22}/>}
                        </button>
                        {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="text-end my-2 text-[15px]">
                        <a href="#" className="text-gray-400 hover:text-indigo-500">Olvidaste tu contraseña?</a>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 text-center rounded-md text-xl font-semibold transition-colors bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white cursor-pointer hover:bg-gradient-to-tr hover:from-indigo-400 hover:to-indigo-300"
                    >
                        Login
                    </button>
                    <div className="text-center my-3 text-gray-400">
                        <p>No tienes cuenta? <a href="/auth/register" className="text-gray-500 font-semibold underline hover:text-indigo-500"> Registrate aquí</a></p>
                    </div>
                </form>
            </div>
        </>
    )
}
