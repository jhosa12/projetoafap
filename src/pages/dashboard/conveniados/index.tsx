import { ModalNovoConveniado } from "@/components/modals/comercial/modalNovoConveniado"
import { ModalNovaConta } from "@/components/tabs/financeiro/contasPagarReceber/modalNovaConta"
import { AuthContext } from "@/store/AuthContext"
import { api } from "@/lib/axios/apiClient"
import { Button, Card, Dropdown } from "flowbite-react"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"


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

        const response = await toast.promise(
            api.get('/conveniados/listar'),
            {
                error:'Erro ao Requisitar Dados',
                pending:'Listando dados.....',
                success:'Dados Carregados'
            }
        )

        setConveniados(response.data)
    }

    useEffect(()=>{
        handleListarConveniados()
    },[])
    return (
        <>
       { openNovoConveniado &&<ModalNovoConveniado conveniados={conveniados} setConveniados={setConveniados} conveniado={conveniado} usuario={usuario?.nome??''} openModal={openNovoConveniado} setOpenModal={setOpenNovoConveniado}/>}
        <div className="bg-white h-[calc(100vh-59px)] flex flex-col p-2 ">
            <Button theme={{color:{blue:"border border-transparent bg-blue-700 text-white   enabled:hover:bg-blue-800 "}}} onClick={()=>{setOpenNovoConveniado(true),setConveniado({
              conveniado:'',
              fone:'',
              endereco:'',
              filename:'',
              id_conveniados:null,
              usuario:usuario?.nome??''
            })}} color={"blue"} className="ml-auto">Novo Conveniado</Button>

            <div className="grid grid-cols-5 gap-4">
            {conveniados.map(item=>(
    <Card 
    key={item.id_conveniados} 
     className=" relative  max-w-sm col-span-1 h-full" 
     imgSrc={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.filename}`}

    
     
      >
        <div className="absolute top-0 right-0 z-10 flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <Dropdown.Item  onClick={()=>{setConveniado(item),setOpenNovoConveniado(true)}}>
            <span
              
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  "
            >
              Editar
            </span>
          </Dropdown.Item>
     
          <Dropdown.Item>
            <button
              onClick={()=>{}}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 "
            >
              Deletar
            </button>
          </Dropdown.Item>
        </Dropdown>
      </div>
        <div className="flex flex-col">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
      {item.conveniado}
    </h5>
    <span className="text-sm text-gray-500 ">{item.endereco}</span>
    <span className="text-sm font-normal break-words overflow-y-auto text-gray-700 ">
     {item.fone}
    </span>
        </div>

  
  </Card>
   )) }

            </div>
     
        </div>
        </>
    )
}