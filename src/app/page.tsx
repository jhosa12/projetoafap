
"use client"
import { useState, useContext } from "react"
import Image from "next/image";
import logo from "../../public/novaLogo.png"
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { SignInProps } from "@/types/user"

import { Input } from "@/components/ui/input";
import { Loader, Lock, User } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";

export default function Home() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInProps>()
    const [loading, setLoading] = useState(false)
    const { signIn } = useContext(AuthContext)
    
    const handleSignUp: SubmitHandler<SignInProps> = async (data) => {
        setLoading(true)
        
        if (data.user === "" || data.password === "") {
            alert("Preencha todos os campos")
            return;
        }
        
        await signIn(data)
        setLoading(false)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
            <div className="w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Logo with subtle animation */}
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <Image 
                                priority 
                                className="w-40 h-20 object-contain" 
                                src={logo} 
                                alt="Logo" 
                            />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Bem-vindo
                        </h1>

                        {/* Form */}
                        <form 
                            autoComplete="off" 
                            onSubmit={handleSubmit(handleSignUp)} 
                            className="space-y-6 w-full"
                        >
                            {/* Username Field */}
                            <div className="space-y-2">
                             
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="user"
                                        
                                        autoComplete="off"
                                        placeholder="Digite seu usuário"
                                        required
                                        className="pl-10 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        {...register("user")}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                             
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Digite sua senha"
                                        required
                                        className="pl-10 w-full focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        {...register("password")}
                                    />
                                </div>
                            </div>

                          

                            {/* Submit Button */}
                            <Button
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                                size="lg"
                                type="submit"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader className="animate-spin mr-2" />
                                        <span>Entrando...</span>
                                    </div>
                                ) : (
                                    "Acessar"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
