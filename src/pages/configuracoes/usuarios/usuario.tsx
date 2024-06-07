import { api } from "@/services/apiClient"
import { getURL } from "next/dist/shared/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

interface UsersProps{
    cargo:string,
    dir:string,
    email:string,
    nome:string,
    id:number,
    permissoes:JSON,
}

export default function Usuario() {
    const [userDados,setUserDados]= useState<Array<UsersProps>>()

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
                  <div className="inline-flex w-full items-center"><span className="flex w-full font-semibold">USUÁRIO</span>
                    <div className="flex w-full gap-8  items-center">
                      <span className="flex w-full text-start whitespace-nowrap ">CARGO</span>
                      <span className="flex w-full text-start whitespace-nowrap">PERMISSÕES</span>
                      <span className="flex w-full text-start whitespace-nowrap ">META</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EQV. DE DESPESAS</span>
                      <span className="flex w-full justify-end  "></span>
                    </div>
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
                        <div className="inline-flex w-full items-center"><span className="flex w-full font-semibold">{item?.nome}</span>
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.cargo}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.permissoes?.button}</span>
                            <span className="flex w-full text-start whitespace-nowrap"><span className="rounded-lg bg-red-500  p-1">{/*!Number.isNaN(porc) ? porc + '%' : '0%'*/}</span></span>
                            <span className="flex w-full text-start whitespace-nowrap"><span className="rounded-lg bg-blue-500  p-1">{/*!Number.isNaN(porc) ? porc + '%' : '0%'*/}</span></span>
                           
                          </div>
                        </div>
                   
                      </li>
                    )
                  })
                }
              </ul>
            </div>

            
        </div>
    )
}

