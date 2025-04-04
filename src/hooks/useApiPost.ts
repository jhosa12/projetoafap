
import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";





const useApiPost = <T=any,P=any,U=any>(url:string,signal?:AbortSignal,update?:()=>void):{
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
            error:(error)=>{
              console.log(error)
              return  'Erro ao salvar dados'}
          }

        )

       
      //console.log(response.data)
        update?.()
    
        setLoading(false)
    
  }



 
  return {data,loading,postData,setData}



}


export default useApiPost;