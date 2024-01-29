import { useContext } from "react";
import { FormWrapper } from "./organizador";
import { AuthContext } from "@/contexts/AuthContext";



export function ResumoCadastro(){
    const {data,closeModa}= useContext(AuthContext)
    return(
        <FormWrapper title="Resumo do Cadastro">
            <div className="flex flex-col  max-h-96 gap-4 p-2 rounded-lg w-[calc(100vw-200px)]">
                <div className="flex gap-4 w-full">
                <div className="flex flex-col w-3/4">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Nome</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.name}</span><span/>
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
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
          <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Ponto Ref</label>
            <span  className="whitespace-nowrap py-1 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
                </div>

                <div className="flex gap-4 w-full">
                <div className="flex flex-col w-3/4">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Nome</label>
            <span  className="whitespace-nowrap py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.name}</span><span/>
        </div>
        <div className="flex flex-col w-2/4">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Endereço</label>
            <span  className="whitespace-nowrap py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
        <div className="flex flex-col w-1/6">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Numero</label>
            <span  className="whitespace-nowrap py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.numero}</span><span/>
        </div>
        <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Bairro</label>
            <span  className="whitespace-nowrap py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
          <div className="flex flex-col w-2/3">
            <label  className="block  text-xs font-medium text-gray-900 dark:text-white">Ponto Ref</label>
            <span  className="whitespace-nowrap py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{data.endereço}</span><span/>
        </div>
                </div>

            </div>
        </FormWrapper>
    )
}