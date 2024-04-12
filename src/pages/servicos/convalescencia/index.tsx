import { api } from "@/services/apiClient"
import { useEffect, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

interface ConvProps {
    id_conv: number,
    id_contrato: number,
    id_associado: number,
    id_contrato_st: number,
    tipo_entrada: number,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number,
    descontos: number,
    total: number,
    logradouro_r: string,
    numero_r: number,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string
}

export default function Convalescente() {
    const [listaConv,setConv] = useState<Array<ConvProps>>([])

    useEffect(()=>{
        try {
        listarConv()
            
        } catch (error) {

            
        }
    },[])
    async function listarConv() {
      const response =  await api.get("/convalescencia/listar")
      setConv(response.data)
        
    }
    return (
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">

            <div className="flex flex-row w-full p-2 border-b-[1px] border-gray-600">
                <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Controle Convalescente</h1>
            </div>

            <div className="flex p-1 max-h-[calc(100vh-150px)]">{/*DIV DA TABELA*/}
                    <table
                        className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                        <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th scope="col" className=" px-2 py-1">
                                    Contrato
                                </th>

                                <th scope="col" className="px-2 py-1">
                                    Titular
                                </th>
                                <th scope="col" className="px-2 py-1">
                                    Usuário
                                </th>
                                <th scope="col" className="px-2 py-1">
                                    Data
                                </th>
                                <th scope="col" className="px-2 py-1">
                                    status
                                </th>
                                <th scope="col" className="px-2 py-1">
                                    <span >Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaConv?.map((item, index) => {
                                return (
                                <tr  key={index} className={`border-b  border-gray-700 "bg-gray-600":"bg-gray-800"} hover:bg-gray-600`}>
                                    <td className="px-2 py-1">
                                        {item.id_contrato}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.nome}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.nome}
                                    </td>
                                
                                    <td className="px-2 py-1">
                                        {new Date(item.data).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.status}
                                    </td>

                                    <td className="px-2 py-1">
                                       <div className="flex flex-row w-full gap-2">
                                        <button className="text-yellow-500 hover:bg-yellow-500 p-1 rounded-lg hover:text-white">
                                        <LuFolderEdit size={18}/>
                                        </button>
                                        <button className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white">
                                        <MdDeleteOutline size={18}/>
                                        </button>
                                       
                                       </div>
                                    </td>
                            
                                </tr>)
                            })}

                        </tbody>



                    </table>



                </div>
        </div>

    )
}