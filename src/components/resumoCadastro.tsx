import { useContext, useEffect } from "react";
import { FormWrapper } from "./organizador";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";



export function ResumoCadastro(){
    const {data,closeModa}= useContext(AuthContext)
 
    return(
        <FormWrapper title="Resumo do Cadastro">
            <div className="flex flex-col   max-h-[450px] gap-2 p-2 rounded-lg w-[calc(100vw-200px)]">
                <div className="flex gap-4 flex-col p-2 rounded-lg  border-gray-500 border-[1px]"  >
                <div className="flex gap-4 w-full">
                <div className="flex flex-col w-3/4">
            <label  className="block  text-xs font-medium  text-white">Nome</label>
            <span  className="whitespace-nowrap font-bold py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.name}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Nascimento</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.nasc?new Date(data.nasc).toLocaleDateString():''}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Sexo</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.sexo}</span><span/>
        </div>
        <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium  text-white">Endereço</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Numero</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.numero}</span><span/>
        </div>
        <div className="flex flex-col w-2/4">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.bairro}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Cidade/UF</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.cidade}</span><span/>
        </div>
          
                </div>

                <div className="flex gap-4 w-full ">
                <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium  text-white">Ponto Ref</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.referencia}</span><span/>
        </div>
      
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">RG</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.rg}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">CPF</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.cpf}</span><span/>
        </div>
      
          <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium  text-white">Email</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.email}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Celular 1</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.celular1}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Celular 2</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.celular2}</span><span/>
        </div>
                </div>
       
                </div>

                <div className="flex gap-4 flex-col p-2 rounded-lg  border-gray-500 border-[1px]"  >
                <div className="flex gap-4 w-full">
                <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Contrato</label>
            <span  className="whitespace-nowrap font-bold py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.contrato}</span><span/>
        </div>
        <div className="flex flex-col w-1/4">
            <label  className="block  text-xs font-medium  text-white">Origem</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.origem}</span><span/>
        </div>
        <div className="flex flex-col w-1/4">
            <label  className="block  text-xs font-medium  text-white">Plano</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.plano}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Valor</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.valor?data.valor:'0,00'}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Cobrador</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.cobrador}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Consultor</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.consultor}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium  text-white">Supervisor</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.supervisor}</span><span/>
        </div>
        <div className="flex flex-col w-1/12">
            <label  className="block  text-xs font-medium  text-white">NP</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.np}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Vencimento</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.dtvenc?new Date(data.dtvenc).toLocaleDateString():''}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Adesão</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.dtadesao?new Date(data.dtadesao).toLocaleDateString():''}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium  text-white">Carência</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.dtcarencia?new Date(data.dtcarencia).toLocaleDateString():''}</span><span/>
        </div>
          
                </div>
                </div>


            <div className="flex  max-h-60 justify-center">
                <div className="flex  p-2 rounded-lg  border-gray-500 border-[1px]"  >
                {data.arraydep?(
                    <div className="flex flex-col">
                      <table 
                      className="block overflow-y-auto overflow-x-hidden text-xs text-center rtl:text-center border-b-[1px] border-collapse rounded-lg text-gray-400">
                        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                                <tr >
                                  <th scope="col" className=" px-4 py-1">Nome</th>
                                  <th scope="col" className=" px-4 py-1">Nasc</th>
                                  <th scope="col" className=" px-4 py-1">Parent.</th>
                                  <th scope="col" className=" px-4 py-1">Adesão</th>
                                  <th scope="col" className=" px-3 py-1">Carência</th>
                                
                                </tr>
                              </thead>
                              <tbody>
                                {data.arraydep?.map((usuario, index) => (
                                  <tr className=" border-b border-l bg-gray-800 border-gray-700  hover:bg-gray-600" key={index}>
                                    <th scope="row" className="px-4 py-1 font-medium  whitespace-nowrap text-white">{usuario.nome}</th>
                                    <td className="px-4 py-1">{usuario.data_nasc}</td>
                                    <td className="px-4 py-1">{usuario.grau_parentesco}</td>
                                    <td className="px-4 py-1">{usuario.data_adesao}</td>
                                    <td className="px-3 py-1">{usuario.carencia}</td>
                                   
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <span className="text-white text-sm font-semibold">Total: {data.arraydep.length} </span>
                            </div>
                ):(<h2 className="text-white">NÃO HÁ DEPENDENTES CADASTRADOS!</h2>)}
              
                </div>

                </div>


            </div>
        </FormWrapper>
    )
}