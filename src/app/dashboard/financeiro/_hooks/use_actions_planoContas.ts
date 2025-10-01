import { useEffect, useState } from "react"
import { PlanoContasProps } from "../_types/types"
import { api } from "@/lib/axios/apiClient"
import { toast } from "sonner"
import { UserProps } from "@/types/user"










 const useActionsPlanoContas = (user:UserProps|undefined)=>{
    const [array_plano_contas,setArray] = useState<Array<PlanoContasProps>>()

useEffect(()=>{
   user?.nome && get_contas()
},[user])

    const get_contas = async () =>{
        try {
            const  response = await api.get(`/financeiro/planoContas?perm_lanc=all`)
            setArray(response.data)
        } catch (error) {
            toast.error('Erro ao requisitar plano de contas')
        }

    }


    const post_conta = async ()=>{



    }

    const put_conta = async ()=>{


    }









    return {

        array_plano_contas,
        post_conta,
        put_conta


    }
}

export default useActionsPlanoContas