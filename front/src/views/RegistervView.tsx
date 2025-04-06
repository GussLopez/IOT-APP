import { useState } from "react"
import { toast } from "sonner"
import { RegisterForm } from "../types"
import { useForm } from "react-hook-form"
import axios, { isAxiosError } from "axios"
import ErrorMessage from "../components/ErrorMessage"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { Link, useNavigate } from "react-router-dom"

export default function RegisterView() {
    const navigate = useNavigate()
    const initialValues : RegisterForm = {
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
    }

    const [viewPassword, setViewPassword] = useState(false)

    const { register, watch, handleSubmit, formState: { errors } } = useForm({defaultValues: initialValues})
    const password = watch('password')

    const handleRegister = async (formData: RegisterForm) => {
        try {
            const {data} = await axios.post(`http://localhost:4000/api/auth/create-account`, formData)
            toast.success(data)
            setTimeout(() => {
                navigate('/auth/confirm-account')
            }, 1000);
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error)
            }
        }
    }

    return (
        <>
        <div className="px-4">
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="max-w-[450px]  mx-auto p-5 rounded-lg flex flex-col gap-5 bg-white shadow-lg text-[17px]"
            >
                <h1 className="text-3xl mt-5 font-semibold text-center text-gray-700">Create account</h1>
                <div>
                    <input
                        id="name"
                        type="text"
                        className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                        placeholder="Name"
                        {...register('name', {
                            required: 'The name is required'
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>
                <div>
                    <input
                        id="phone"
                        type="tel"
                        className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                        placeholder="Phone"
                        {...register('phone', {
                            required: 'The phone is required'
                        })}
                    />
                    {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
                </div>
                <div>
                    <input
                        id="email"
                        type="email"
                        className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                        placeholder="Email"
                        {...register('email', {
                            required: 'The emial is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Invalid email, Please introduce a correct email'
                            }
                        })}
                    />
                     {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
                <div className="relative">
                    <input
                        type={viewPassword ? 'text' : 'password'}
                        className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                        placeholder="Password"
                        {...register('password', {
                            required: 'The passwordis required',
                            minLength: {
                                value: 8,
                                message: 'The password is too short, min 8 characters'
                            }
                        })}
                    />
                    <button
                        onClick={() => setViewPassword(!viewPassword)}
                        type="button"
                        className="absolute top-4 right-3 text-gray-600"
                    >
                        {viewPassword ? <EyeSlash size={22} /> : <Eye size={22} />}

                    </button>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>
                <div className="relative">
                    <input
                        id="password_confirmation"
                        type={viewPassword ? 'text' : 'password'}
                        className="p-3 border-2 border-indigo-100 w-full rounded-md focus:outline-indigo-500"
                        placeholder="Confirm password"
                        {...register('password_confirmation', {
                            required: 'Confirm your password',
                           validate: value => value === password || 'The password do not match'
                        })}
                    />
                    <button
                        onClick={() => setViewPassword(!viewPassword)}
                        type="button"
                        className="absolute top-4 right-3 text-gray-600"
                    >
                        {viewPassword ? <EyeSlash size={22} /> : <Eye size={22} />}

                    </button>
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>
                <button
                    type="submit"
                    className="w-full py-3 text-center rounded-md text-xl font-semibold transition-colors bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white cursor-pointer hover:bg-gradient-to-tr hover:from-indigo-400 hover:to-indigo-300"
                >
                    Crear cuenta
                </button>
                <div className="text-center my-3 text-gray-700">
                    <p>Ya tienes cuenta? <Link to="/auth/login" className="text-gray-500 font-semibold underline hover:text-indigo-500"> Inicia sesión aquí</Link></p>
                </div>
            </form>
            
        </div>
    </> 
    )  
}