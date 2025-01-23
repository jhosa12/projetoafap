import { inter, roboto_Mono } from "@/fonts/fonts";
import { api } from "@/services/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { Button, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiMiniCog6Tooth, HiMiniPencil } from "react-icons/hi2";
import { IoIosAddCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { ModalEmpresa } from "./modalEmpresa/modalEmpresa";




export function Empresas() {
    const [empresas,setEmpresas] = useState<Array<EmpresaProps>>([])
    const [empresa,setEmpresa] = useState<EmpresaProps>({} as EmpresaProps)
    const [open,onClose]=useState(false)

const handleListarEmp = useCallback(async()=>{
    try {
        const response = await api.get("/empresas/listarDados")
     
        setEmpresas(response.data)
    } catch (error) {
        toast.error('erro na requisição')
    }
},[empresas]
)
useEffect(()=>{
    handleListarEmp()
},[])

const handleOpenEmpresa = useCallback((item:EmpresaProps)=>{
    setEmpresa(item)
    onClose(true)
},[])



    return (
        <div className={ `flex flex-col  px-4 w-full overflow-y-auto h-[calc(100vh-138px)]`}>

            <ModalEmpresa open={open} onClose={onClose} />
            <Button type="button" className="ml-auto mb-2" color="blue" size="sm" ><IoIosAddCircle size={22} className="mr-2 "/>NOVA EMPRESA</Button>

            <div className={roboto_Mono.className}>
                <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-2  text-xs text-black font-semibold" } } }} hoverable={true}>
                    <Table.Head>
                        <Table.HeadCell>
                            Nome
                        </Table.HeadCell>
                        <Table.HeadCell>
                           Razão social
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Cidade
                        </Table.HeadCell>
                        <Table.HeadCell>
                            CNPJ
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Status
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Ações
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {empresas.map((item,index)=>(
                            <Table.Row key={item.id} className="text-black">
                            <Table.Cell className="whitespace-nowrap font-medium ">
                               {item.nome}
                            </Table.Cell>
                            <Table.Cell>
                                {item.razao_social}
                            </Table.Cell>
                            <Table.Cell>
                                {item.cidade_uf}
                            </Table.Cell>
                            <Table.Cell>
                                {item.cnpj}
                            </Table.Cell>
                            <Table.Cell >
                                {}
                            </Table.Cell>
                            <Table.Cell className="flex gap-4">
                           <button onClick={()=>handleOpenEmpresa(item)} className="text-gray-500 hover:text-yellow-500"><HiMiniCog6Tooth size={15} /></button> 
                           
                            </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                </Table>
            </div>

        </div>
    )
}