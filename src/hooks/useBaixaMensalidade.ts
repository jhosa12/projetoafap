
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { MensalidadeProps } from "@/types/financeiro";

import { AxiosError, AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export type ToastType = 'success' | 'error' | 'info' | 'warn'

interface PayloadProps {
    id_global:number|null,
    id_usuario:string,
    pix_por:string,
    id_mensalidade_global: number,
    id_mensalidade: number,
    data_lanc:Date,
    data_pgto: Date,
    hora_pgto: string,
    valor_total: number,
    motivo_bonus:string,
    associado: string,
    form_pagto: string,
    banco_dest: string,
    desconto: boolean,
    valor_metodo: number,
    id_proximaMensalidade:number,
    situacao:string,
    status:string,
    id_empresa:string
}

 const useBaixaMensalidade = (url:string,setModal:(state:boolean)=>void,atualizar:Function):{
   
    error:AxiosError|null;
    postData:(payload:Partial<PayloadProps>)=>Promise<void>;
    data:Array<MensalidadeProps>|[]|null
 }=>{
   
    const [error, setError] = useState<AxiosError | null>(null);
    const [data, setData] = useState<Array<MensalidadeProps>|[]|null>(null);

  

    const postData = async(payload:Partial<PayloadProps>)=>{
      
       // setError(null)

        const exibirToastERetornar = (mensagem:string, tipo:ToastType = "warn") => {
            toast[tipo](mensagem);
            return ;
        };
        // Validações iniciais
        if (!payload?.form_pagto) {
            return exibirToastERetornar('Informe a forma de pagamento!');
        }

        if(payload.form_pagto === 'PIX' && !payload.pix_por) {
            return exibirToastERetornar('Informe o pix por!');
            
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
                api.put(url,{...payload,data_pgto:payload?.data_pgto?.toISOString()}),
                {
                    error: 'Erro na Requisição',
                    pending: 'Realizando Baixa',
                    success: 'Baixa Realizada com sucesso'
                }
            )
            
           // setarDadosAssociado({mensalidade:response.data})
            atualizar()
            setData(response.data)

            setModal(false)
           
    
        }catch(error:any){
          //  setError(error as AxiosError)
         // console.log(error)
          toast.error(error.response?.data?.error??'Erro desconhecido')
    
        }
      }
    

    
     
      return {error,postData,data}
     
 }
     
 export default useBaixaMensalidade