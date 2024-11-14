import { api } from "@/services/apiClient";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";





const useApiPost = <T=any,P=any>(url:string):{
    data:T|null;
    loading:boolean;
    postData:(payload:P)=>Promise<void>
}=>{
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);



  const postData = async(payload:P)=>{
    setLoading(true)

    try{
        const response:AxiosResponse = await api.post(url,payload)
        setData(response.data)
  

    }catch(error:any){
        //setError(error as AxiosError)
        toast.error(error?.response?.data.message)
       

    }finally{
        setLoading(false)
    }
  }



 
  return {data,loading,postData}



}


export default useApiPost;