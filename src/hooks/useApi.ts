import { api } from "@/services/apiClient";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";





const useApi = <T=any,P=any>(url:string):{
    data:T|null;
    error:AxiosError|null;
    loading:boolean;
    postData:(payload:P)=>Promise<void>
    getData:()=>Promise<void>
}=>{
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);



  const postData = async(payload:P)=>{
    setLoading(true)
    setError(null)
    try{
        const response:AxiosResponse = await api.post(url,payload)
        setData(response.data)

    }catch(error){
        setError(error as AxiosError)

    }finally{
        setLoading(false)
    }
  }

  const getData = async()=>{
    setLoading(true)
    setError(null)
    try{
        const response:AxiosResponse = await api.get(url)
        setData(response.data)

    }catch(error){
        setError(error as AxiosError)

    }finally{
        setLoading(false)
    }
  }

 
  return {data,error,loading,postData,getData}



}


export default useApi;