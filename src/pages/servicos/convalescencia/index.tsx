import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient"
import { useContext, useEffect, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";
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
    const [arrayConv, setConv] = useState<Array<ConvProps>>([])
    const [dropOpen,setDrop] = useState(false)
    const [criterio,setCriterio]=useState("Contrato")
    const [input,setInput] =useState('')
    const {listaConv,setarListaConv,usuario}= useContext(AuthContext)




    useEffect(() => {
        try {
            listarConv()

        } catch (error) {


        }
    }, [])
    async function listarConv() {
        const response = await api.get("/convalescencia/listar")
        setConv(response.data)

    }
    return (
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">

            <div className="flex flex-row w-full p-2 border-b-[1px]  border-gray-600">
                <h1 className="flex w-full items-end  text-gray-300 font-semibold text-2xl ">Controle Convalescente</h1>
                <div className="flex justify-end items-end w-full">
                <form onSubmit={()=>{}} className="flex w-2/3">
    <button onClick={()=>setDrop(!dropOpen)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg focus:outline-none  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">{criterio} 
    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
 
      {dropOpen && (
          <div className="absolute top-[134px] divide-gray-100 z-20 rounded-lg shadow  bg-gray-700">
          <ul className="py-2 text-sm text-gray-200">
          <li >
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Contrato'),setDrop(false)}}>Contrato</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Titular'),setDrop(false)}}>Titular</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Dependente'),setDrop(false)}}>Usuário</a>
          </li>
         
          </ul>
      </div>
      )}
        <div className="relative  w-full">
            <input   value={input} onChange={e=>setInput(e.target.value)} type={criterio==="Contrato"?"number":"search"} autoComplete="off"  className="uppercase flex justify-center  p-2.5 w-full z-20 text-sm  rounded-e-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Buscar Lançamento" required/>
            <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg></button>
        </div>
        </form>
    </div>




            </div>

            <div className="flex w-full justify-center p-1 max-h-[calc(100vh-150px)]">{/*DIV DA TABELA*/}
                <table
                    className="block w-full  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                    <thead className="sticky w-full top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th scope="col" className=" px-4 py-1">
                                Contrato
                            </th>

                            <th scope="col" className="px-8 py-1">
                                Titular
                            </th>
                            <th scope="col" className="px-8 py-1">
                                Usuário
                            </th>
                            <th scope="col" className="px-8 py-1">
                                Data
                            </th>
                            <th scope="col" className="px-8 py-1">
                                status
                            </th>
                            <th scope="col" className="px-8 py-1">
                                <span >Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrayConv?.map((item, index) => {
                            return (
                                <tr key={index} className={`border-b  border-gray-700 "bg-gray-600":"bg-gray-800"} hover:bg-gray-600`}>
                                    <td className="px-4 py-1">
                                        {item.id_contrato}
                                    </td>
                                    <td className="px-8 py-1">
                                        {item.nome}
                                    </td>
                                    <td className="px-8 py-1">
                                        {item.nome}
                                    </td>

                                    <td className="px-8 py-1">
                                        {new Date(item.data).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-1">
                                    {item.status}
                                    </td>
                                    <td className="px-8 py-1">
                                        <div className="flex flex-row w-full gap-2">
                                            <button className="text-yellow-500 hover:bg-yellow-500 p-1 rounded-lg hover:text-white">
                                                <LuFolderEdit size={18} />
                                            </button>
                                            <button className="text-blue-500 hover:bg-blue-500 p-1 rounded-lg hover:text-white">
                                            <RiUserReceived2Line size={18} />
                                            </button>
                                            <button className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white">
                                                <MdDeleteOutline size={18} />
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