
import {useState,useContext} from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import logo from "../../public/novaLogo.png"
import {AuthContext} from "../store/AuthContext"
import { SubmitHandler, useForm } from "react-hook-form";
import { Label, TextInput } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { SignInProps } from "@/types/user";


export default function Home() {
 
    const {register,handleSubmit} = useForm<SignInProps>()
    const [loading,setLoading]= useState(false)
    const {sign} =useContext(AuthContext)
       const handleSignUp:SubmitHandler<SignInProps> = async(data)=>{
            setLoading(true)
            
           
            if(data.user===""||data.password===""){
                alert("Preencha todos os campos")
                return;
                }
               
           
           await sign(data)
            setLoading(false)
              }
              
    return(
        <div className=" flex h-[100vh] w-full items-center justify-center bg-gray-50">
       
       <div className="sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col gap-4  p-4 items-center justify-center rounded-lg shadow-xl bg-white">
       <Image priority className="w-32 h-16  mr-7" src={logo} alt="" />
    <Label className="text-xl" value="Login"/>
    <form autoComplete="off" onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-4 w-full items-center">
   <TextInput  autoComplete="off"  placeholder="Usuario" required className="w-2/3" {...register("user")} />
    <TextInput autoComplete="new-password"  placeholder="Senha" type="password" required className="w-2/3" {...register("password")} />
    <Button disabled={loading} className="w-2/3" size={"lg"} type="submit" >
        {loading?<AiOutlineLoading3Quarters className="animate-spin"/>:"Acessar"}
    </Button>
   
    </form>
</div>
</div>)
}

/*export const getServerSideProps = canSSRGuest(async(ctx)=>{

    return{
        props:{}
    }
})*/

 

