import { Card, ToggleSwitch } from "flowbite-react"
import { themaCard } from "../permisssoes"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"


interface DataProps{
    permissions:Array<string>
    handlePermission:(permission:string)=>void
}

export function PermissoesEmpresas({permissions,handlePermission}:DataProps){
    const {empresas} = useContext(AuthContext)


    return(
        <Card theme={themaCard}>
            <h1 className="text-sm font-semibold">Empresas</h1>

            {empresas.map(empresa=>{return(<ToggleSwitch  sizing={'sm'} checked={permissions.includes(`EMP${empresa.id}`)} onChange={()=>handlePermission(`EMP${empresa.id}`)} label={empresa.nome}/>)})}
            
        

        </Card>
     
    )
}