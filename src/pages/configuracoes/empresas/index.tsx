
import { api } from "@/services/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { IoIosAddCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ModalEmpresa } from "@/components/configuracoes/empresas/modalEmpresa/modalEmpresa";



export default function Empresas() {
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
        <div className={ `flex flex-col mt-2 px-4 w-full overflow-y-auto h-[calc(100vh-138px)]`}>

  {   open && <ModalEmpresa empresa={empresa} open={open} onClose={onClose} />}
            <Button onClick={()=>{setEmpresa({} as EmpresaProps);onClose(true)}} type="button" className="mr-auto"  variant={'outline'} size="sm" ><IoIosAddCircle size={20}  />NOVA EMPRESA</Button>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto mt-2" >
                <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-6 py-2  text-xs text-black font-semibold" } } }} hoverable={true}>
                    <Table.Head theme={{cell: { base: " px-6 py-2  text-xs text-black font-semibold" }}}>
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