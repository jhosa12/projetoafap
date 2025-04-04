
import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";





const useApiPut = <T=any,P=any,U=any>(url:string,update?:()=>void,onClose?:()=>void):{
    data:T|null;
    loading:boolean;
    postData:(payload:P,signal?:AbortSignal)=>Promise<void>
    setData:(data:T|null)=>void
}=>{
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);



  const postData = async(payload:P,signal?:AbortSignal)=>{
    setLoading(true)

   
        toast.promise(
          api.put(url,payload,{signal}),
          {
            loading: 'Atualizando dados...',
            success: (res)=>{
              setData(res.data)
              update?.()
              onClose?.()
              return'Dados atualizados com sucesso'
            },
            error:(error)=>{
             
              return  'Erro ao atualizar dados'}
          }

        )

       
      //console.log(response.data)
       
    
        setLoading(false)
    
  }



 
  return {data,loading,postData,setData}



}


export default useApiPut;