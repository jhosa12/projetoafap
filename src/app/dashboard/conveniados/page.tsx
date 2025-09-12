'use client';

import { ModalNovoConveniado } from "@/components/modals/comercial/modalNovoConveniado"
import { AuthContext } from "@/store/AuthContext"
import { api } from "@/lib/axios/apiClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"


export interface ConveniadosProps {
        id_conveniados:number|null,
        usuario: string
        conveniado: string
        endereco :string
        fone: string
        filename: string
    

}


export default function Conveniados() {
    const [conveniados,setConveniados]=useState<ConveniadosProps[]>([])
    const [openNovoConveniado, setOpenNovoConveniado] = useState(false)
    const {usuario} = useContext(AuthContext)
    const [conveniado, setConveniado] = useState<ConveniadosProps>({} as ConveniadosProps)


    const handleListarConveniados=async()=>{

       toast.promise(
            api.get('/conveniados/listar'),
            {
                error:'Erro ao Requisitar Dados',
                loading:'Listando dados.....',
                success:(response)=>{
                  setConveniados(response.data)
                  return 'Dados Carregados'}
            }
        )
    }




    useEffect(()=>{
        handleListarConveniados()
    },[])
    return (
        <>
       { openNovoConveniado &&<ModalNovoConveniado conveniados={conveniados} setConveniados={setConveniados} conveniado={conveniado} usuario={usuario?.nome??''} openModal={openNovoConveniado} setOpenModal={setOpenNovoConveniado}/>}
        <div className="bg-white h-[calc(100vh-59px)] flex flex-col p-2 ">
            <Button onClick={()=>{setOpenNovoConveniado(true),setConveniado({
              conveniado:'',
              fone:'',
              endereco:'',
              filename:'',
              id_conveniados:null,
              usuario:usuario?.nome??''
            })}} className="ml-auto">Novo Conveniado</Button>

            <div className="grid grid-cols-5 gap-4">
            {conveniados.map(item=>(
    <Card 
      key={item.id_conveniados} 
      className="relative max-w-sm col-span-1 h-full"
    >
      <div className="relative">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.filename}`}
          alt={item.conveniado}
          className="h-40 w-full object-cover rounded-t-md"
        />
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Opções">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={()=>{setConveniado(item); setOpenNovoConveniado(true)}}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={()=>{}}>
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex flex-col">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
            {item.conveniado}
          </h5>
          <span className="text-sm text-gray-500 ">{item.endereco}</span>
          <span className="text-sm font-normal break-words overflow-y-auto text-gray-700 ">
            {item.fone}
          </span>
        </div>
      </CardContent>
    </Card>
   )) }

            </div>
     
        </div>
        </>
    )
}