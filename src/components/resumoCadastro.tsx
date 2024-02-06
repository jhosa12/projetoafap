import { useContext } from "react";
import { FormWrapper } from "./organizador";
import { AuthContext } from "@/contexts/AuthContext";



export function ResumoCadastro(){
    const {data,closeModa}= useContext(AuthContext)
    return(
        <FormWrapper title="Resumo do Cadastro">
            <div className="flex flex-col   max-h-96 gap-4 p-2 rounded-lg w-[calc(100vw-200px)]">
                <div className="flex gap-4 flex-col p-2 rounded-lg bg-gray-800 border-gray-500 border-[1px]"  >
                <div className="flex gap-4 w-full">
                <div className="flex flex-col w-3/4">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Nome</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.name}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Nascimento</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.nasc?new Date(data.nasc).toLocaleDateString():''}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Sexo</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.sexo}</span><span/>
        </div>
        <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Endereço</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Numero</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.numero}</span><span/>
        </div>
        <div className="flex flex-col w-2/4">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Bairro</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.bairro}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Cidade/UF</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.cidade}</span><span/>
        </div>
          
                </div>

                <div className="flex gap-4 w-full ">
                <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Ponto Ref</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.referencia}</span><span/>
        </div>
      
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">RG</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.rg}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">CPF</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.cpf}</span><span/>
        </div>
      
          <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Email</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.email}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Celular 1</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.celular1}</span><span/>
        </div>
        <div className="flex flex-col w-2/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Celular 2</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.celular2}</span><span/>
        </div>
                </div>
       
                </div>
            </div>
        </FormWrapper>
    )
}