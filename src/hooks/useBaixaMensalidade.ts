import { set } from 'date-fns';
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";

import { AxiosError, AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export type ToastType = 'success' | 'error' | 'info' | 'warn'

interface PayloadProps {
    id_global:number|null,
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
    id_proximaMensalidade:number,
    situacao:string,
    status:string,
    id_empresa:string
}

 const useBaixaMensalidade = (url:string):{
   
    error:AxiosError|null;
    postData:(payload:Partial<PayloadProps>)=>Promise<void>;
 }=>{
   
    const [error, setError] = useState<AxiosError | null>(null);
    const {setarDadosAssociado} = useContext(AuthContext)

  

    const postData = async(payload:Partial<PayloadProps>)=>{
      
       // setError(null)

        const exibirToastERetornar = (mensagem:string, tipo:ToastType = "warn") => {
            toast[tipo](mensagem);
            return;
        };
        // Validações iniciais
        if (!payload?.form_pagto) {
            return exibirToastERetornar('Informe a forma de pagamento!');
        }
        
        if (payload.form_pagto !== 'DINHEIRO' && !payload.banco_dest) {
            return exibirToastERetornar('Informe o banco de destino');
        }
        
        if (payload?.status === 'P') {
            return exibirToastERetornar('Mensalidade com baixa já realizada', 'error');
        }
    
        if (payload.situacao === 'INATIVO') {
            return exibirToastERetornar('Contrato inativo, impossível realizar baixa!', 'info');
        }
    
        if (payload.desconto === true && !payload?.motivo_bonus) {
            return exibirToastERetornar('Informe o motivo do desconto!', 'info');
        }

       
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
    
        }catch(error:any){
          //  setError(error as AxiosError)
          toast.error(error.response.data.error)
    
        }
      }
    

    
     
      return {error,postData}
     
 }
     
 export default useBaixaMensalidade