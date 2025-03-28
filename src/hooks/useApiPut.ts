
import { api } from "@/lib/axios/apiClient";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";





const useApiPut = <T=any,P=any>(url:string):{
    data:T|null;
    loading:boolean;
    postData:(payload:P)=>Promise<void>
    setData:(data:T|null)=>void
}=>{
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);



  const postData = async(payload:P)=>{
    setLoading(true)

    try{
        const response:AxiosResponse = await api.put(url,payload)
        setData(response.data)
      //console.log(response.data)

    }catch(error:any){
        //setError(error as AxiosError)
     // console.log(error)
        toast.error(error?.response?.data.message??'Erro ao salvar dados')
        throw new Error("Erro ao salvar dados")

    }finally{
        setLoading(false)
    }
  }



 
  return {data,loading,postData,setData}



}


export default useApiPut;