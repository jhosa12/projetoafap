import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";

import { AxiosError, AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";



interface PayloadProps {
    id_usuario:string,
    id_mensalidade_global: number,
    id_mensalidade: number,
    data_pgto: Date,
    hora_pgto: string,
    valor_total: number,
    motivo_bonus:string,
    associado: string,
    form_pagto: string,
    banco_dest: string,
    desconto: boolean,
    id_proximaMensalidade:number
}

 const useBaixaMensalidade = (url:string):{
   
    error:AxiosError|null;
    postData:(payload:Partial<PayloadProps>)=>Promise<void>;
 }=>{
   
    const [error, setError] = useState<AxiosError | null>(null);
    const {setarDadosAssociado} = useContext(AuthContext)

  

    const postData = async(payload:Partial<PayloadProps>)=>{
      
        setError(null)

    

       
        try{
            const response:AxiosResponse = await toast.promise(
                api.put(url,payload),
                {
                    error: 'Erro na Requisição',
                    pending: 'Realizando Baixa',
                    success: 'Baixa Realizada com sucesso'
                }
            )
            
            setarDadosAssociado({mensalidade:response.data})
    
        }catch(error){
            setError(error as AxiosError)
    
        }
      }
    

    
     
      return {error,postData}
     
 }
     
 export default useBaixaMensalidade