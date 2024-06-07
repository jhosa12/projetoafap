import { api } from "@/services/apiClient"
import { getURL } from "next/dist/shared/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import fototeste from '../../../../public/fototeste.jpeg'
import { FaLockOpen } from "react-icons/fa";
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import ModalNovoUsuario from "./modalNovoUsuario"

interface PermissionsProps{
    button:string
}
interface UsersProps{
    cargo:string,
    dir:string,
    email:string,
    telefone:string
    nome:string,
    id:number,
    permissoes:Partial<PermissionsProps>,
}

export default function Usuario() {
    const [userDados,setUserDados]= useState<Array<UsersProps>>()
    const [modalEditar,setModalEditar]=useState<boolean>(false)

    const setarModalEditar =()=>{
        setModalEditar(!modalEditar)
    }

    useEffect(()=>{
        getUsers()
    },[])

    async function getUsers(){
        try {
         const response =   await api.get("/getUser")
         console.log(response.data)
         setUserDados(response.data)
           
            
        } catch (error) {
            toast.error('ERRO NA REQUISIÇÃO')
            
        }
    }


    return (
        <div className="ms-2 me-2">
             <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)] text-white bg-[#2b2e3b] rounded-lg ">
              <ul className="flex flex-col w-full p-2 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <span className="flex w-40 me-2 justify-center font-semibold">#</span>
                    <span className="flex w-full text-start font-semibold">NOME</span>
                      <span className="flex w-full text-start whitespace-nowrap ">CARGO</span>
                      <span className="flex w-full text-start whitespace-nowrap">E-MAIL</span>
                      <span className="flex w-full text-start whitespace-nowrap ">TELEFONE</span>
                      <span className="flex w-full justify-center whitespace-nowrap ">PERMISSÕES</span>
                      <span className="flex w-full justify-end  "></span>
                   
                  </div>
                </li>
                {
                  userDados?.map((item, index) => {
                    //   const soma = nome?.lancamentos?.reduce((total, item) => {
                    //   if (item.conta === nome.conta) {
                    //     return total + Number(item.valor)
                    //   }
                    //   else {
                    //     return total
                    //   }
                    //   }, 0)
                    // let porc;
                    //  if (soma === 0 || nome?.metas[0]?.valor === 0 || soma === null || nome?.metas[0]?.valor === null || isNaN(Number(nome?.metas[0]?.valor))) {
                    //    porc = 0;
                    //  } else {
                    //    porc = (soma * 100) / Number(nome?.metas[0].valor);
                    //  }

                    return (
                      <li  className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                            <span className="flex w-40 me-2 text-start font-semibold">  <img className="w-[26px] h-[26px] rounded-full" src="/fototeste.jpeg" alt="Rounded avatar"></img></span>
                            <span className="flex w-full text-start font-semibold">{item?.nome}</span>
                            <span className="flex w-full text-start font-semibold">{item.cargo}</span>
                            <span className="flex w-full text-start font-semibold">{item.email}</span>
                            <span className="flex w-full text-start ">{item.telefone}</span>
                            <div className="flex w-full justify-center text-orange-400 ">
                                <button className="hover:bg-gray-500 p-1 rounded-lg " >
                                <BiSolidLockOpenAlt size={17} />
                                </button>
                                
                            </div>
                            <div className="flex w-full justify-end gap-2 ">
                                <button onClick={()=>setModalEditar(true)} className="hover:bg-gray-500 p-1 text-blue-500 rounded-lg ">
                                <MdEdit size={17}/>
                                </button>
                                <button className="hover:bg-gray-500 p-1 rounded-lg text-red-500 ">
                                <MdDelete size={17}/>
                                </button>
                            </div>
                        
                         
                        </div>
                   
                      </li>
                    )
                  })
                }
              </ul>
              {modalEditar && <ModalNovoUsuario setarModalEditar={setarModalEditar}/> }
            </div>

            
        </div>
    )
}

