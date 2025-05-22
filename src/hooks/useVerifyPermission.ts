import { AuthContext } from "@/store/AuthContext";
import { useContext } from "react"




 const useVerifyPermission = ():{
    verify:(permission:string) => boolean
 } =>{
    const {permissoes} = useContext(AuthContext);

    const verify = (permission: string) => {

        if(!permissoes.includes(permission)){
            return true
        }
        return false
    }

    return {verify}
}

export default useVerifyPermission