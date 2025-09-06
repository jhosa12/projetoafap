
import { api } from "@/lib/axios/apiClient";
import { MensalidadeProps } from "../../_types/mensalidades";
import { AxiosError, AxiosResponse } from "axios";
import {  useState } from "react";
import { toast } from "sonner";


export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface PayloadProps {
    id_global:number|null,
    id_usuario:string,
    lancamentoForma:Array<{forma:string,valor:number,banco?:string|undefined,observacao?:string|undefined}>,
    pix_por:string,
    id_mensalidade_global: number,
    id_mensalidade: number,
    data_lanc:string,
    data_pgto:string,
    recebido_por?:string,
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
    id_empresa:string,
    aut?:string
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

        const exibirToastERetornar = (mensagem:string, tipo:ToastType = "warning") => {
            toast[tipo](mensagem);
            return ;
        };
        // Validações iniciais
     //   if (!payload?.form_pagto) {
      //      return exibirToastERetornar('Informe a forma de pagamento!');
      //  }

        if(payload.form_pagto === 'PIX' && !payload.pix_por) {
            return exibirToastERetornar('Informe o pix por!');
            
        }
        
     //   if (payload.form_pagto !== 'DINHEIRO' && !payload.banco_dest) {
         //   return exibirToastERetornar('Informe o banco de destino');
      //  }
        
        if (payload?.status === 'P') {
            return exibirToastERetornar('Mensalidade com baixa já realizada', 'error');
        }
    
        if (payload.situacao === 'INATIVO') {
            return exibirToastERetornar('Contrato inativo, impossível realizar baixa!', 'info');
        }
    
        if (payload.desconto === true && !payload?.motivo_bonus) {
            return exibirToastERetornar('Informe o motivo do desconto!', 'info');
        }

       
        
             toast.promise(
                api.put(url,{...payload}),
                {
                    error: 'Erro na Requisição',
                    loading: 'Realizando Baixa',
                    success:(response)=> {
                        atualizar()
                        setData(response.data)
            
                        setModal(false)
                        return 'Baixa Realizada com sucesso'}
                }
            )
            
           // setarDadosAssociado({mensalidade:response.data})
          
           
    
       
      }
    

    
     
      return {error,postData,data}
     
 }
     
 export default useBaixaMensalidade