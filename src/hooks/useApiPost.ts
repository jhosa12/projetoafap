
import { api } from "@/lib/axios/apiClient";
import {  AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "sonner";





const useApiPost = <T=any,P=any>(url:string,signal?:AbortSignal):{
    data:T|null;
    loading:boolean;
    postData:(payload:P)=>Promise<void>
    setData:(data:T|null)=>void
}=>{
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);



  const postData = async(payload:P)=>{
    setLoading(true)

   
        toast.promise(
          api.post(url,payload,{signal}),
          {
            loading: 'Salvando dados...',
            success: (res)=>{
              setData(res.data)
              return'Dados salvos com sucesso'
            },
            error: 'Erro ao salvar dados'
          }

        )

       
      //console.log(response.data)

    
        setLoading(false)
    
  }



 
  return {data,loading,postData,setData}



}


export default useApiPost;