






import { api } from "@/lib/axios/apiClient";
import { AxiosError, AxiosResponse } from "axios";
import {  useState } from "react";





const useApiGet = <T=any,P=any>(url:string):{
    data:T|null;
    error:AxiosError|null;
    loading:boolean;
    postData:(payload:P)=>Promise<void>,
    setData:(data:T|null)=>void
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
       // console.log(response.data)

    }catch(error){
        setError(error as AxiosError)

    }finally{
        setLoading(false)
    }
  }

  return {data,error,loading,postData,setData}
}


export default useApiGet;