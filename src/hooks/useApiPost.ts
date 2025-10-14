
import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";

const useApiPost = <T=any,P=any,U=any>(url:string,signal?:AbortSignal,update?:()=>void,successAction?:()=>void,errorAction?:()=>void):{
    data:T|null
    loading: boolean
    postData:(payload:P)=>Promise<void>
    setData:(data:T|null)=>void
}=>{
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);



  const postData = async (payload: P) => {
    setLoading(true);

    toast.promise(
      api.post(url, payload, { signal }),
      {
        loading: 'Salvando dados...',
        success: (res) => {
          setData(res.data);
          setLoading(false); 
          successAction?.();
          return 'Dados salvos com sucesso'; 
        },
        error: (error) => {
          setLoading(false); 
          errorAction?.();
          return error.response?.data?.error || 'Erro ao salvar dados';
        }
      }
    );

    update?.();
  }; 



 
  return {data,loading,postData,setData}



}


export default useApiPost;