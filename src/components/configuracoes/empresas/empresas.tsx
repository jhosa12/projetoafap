import { api } from "@/services/apiClient";
import { EmpresaProps } from "@/types/empresa";
import { Button, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiMiniCog6Tooth, HiMiniPencil } from "react-icons/hi2";
import { IoIosAddCircle } from "react-icons/io";
import { toast } from "react-toastify";




export function Empresas() {
    const [empresas,setEmpresas] = useState<Array<EmpresaProps>>([])

const handleListarEmp = useCallback(async()=>{
    try {
        const response = await api.get("/empresas/listarDados")
        console.log(response.data)
        setEmpresas(response.data)
        alert('empresas listadas')
    } catch (error) {
        toast.error('erro na requisição')
    }
},[empresas]
)
useEffect(()=>{
    handleListarEmp()
},[])



    return (
        <div className="flex flex-col  px-4 w-full overflow-y-auto h-[calc(100vh-138px)]  ">
            <Button className="inline-flex justify-items-center ml-auto bg-blue-600 " size={'sm'} ><IoIosAddCircle size={22} className="mr-2"/>Nova empresa</Button>

            <div>
                <Table hoverable={true}>
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
                            <Table.Cell>
                                {}
                            </Table.Cell>
                            <Table.Cell className="flex gap-4">
                           <button className="text-gray-500 hover:text-yellow-500"><HiMiniCog6Tooth size={15} /></button> 
                           <button className="text-gray-500 hover:text-blue-500"><HiMiniPencil size={15} /></button> 
                            </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                </Table>
            </div>

        </div>
    )
}