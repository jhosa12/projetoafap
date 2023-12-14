
import {FormEvent,useState,useContext} from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import logo from "../../public/logoafap.png"
import {AuthContext} from "../contexts/AuthContext"
export default function Home() {
    const {sign} =useContext(AuthContext)
    const [user,setName]= useState("")
    const [password,setSenha]= useState("")
    const [loading,setLoading]= useState(false)
        function handleSignUp(event:FormEvent){
            event.preventDefault();
            if(user===""||password===""){
                alert("Preencha todos os campos")
                return;
                }
                setLoading(true)
            let data ={
                user:user,
                password:password
            }
            sign(data)
            setLoading(false)
              }
    return(
        <div className=" flex h-[100vh] w-full items-center justify-center bg-[#898686]">
       
       <div className="sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col gap-4 bg-[#525050] p-8 items-center justify-center rounded-lg shadow-xl">
       <Image className="w-40 h-16 mr-7" src={logo} alt="" />
    <h1 className="text-white text-2xl font-medium">Login</h1>
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full items-center">
    <input
        type="text"
        placeholder="Usuário"
        value={user}
        className="border border-black w-full max-w-md h-10 rounded p-2"
        onChange={(e)=>setName(e.target.value)}
    />
    <input
        type="password"
        placeholder="Senha"
        value={password}
        className="border border-black w-full max-w-md h-10 rounded p-2"
        onChange={(e)=>setSenha(e.target.value)}
    />
    <button className={`flex items-center justify-center w-full max-w-md h-12 rounded-lg text-white font-bold bg-[#CA9629]`}>
        {!loading ? "Acessar" : (<AiOutlineLoading3Quarters size={25} className="animate-spin"/>)}
    </button>
    <span>Login:admin - Senha:admin</span>
    </form>
</div>
</div>)
}


 

