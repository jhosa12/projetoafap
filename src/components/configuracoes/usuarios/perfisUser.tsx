
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { AuthContext } from "@/contexts/AuthContext"
import useApiGet from "@/hooks/useApiGet"
import { ConsultoresProps } from "@/types/consultores"
import { FuncaoProps } from "@/types/funcao"
import { Table } from "flowbite-react"
import { useContext, useEffect } from "react"
  
interface DataProps{
  id_user:string|undefined
  perfis:Array<ConsultoresProps>
}


export function PerfisUser({id_user,perfis}:DataProps){
 const {data,postData,loading} = useApiGet<Array<ConsultoresProps>,{id_user:string|undefined}>("/gerenciarAdministrativo/listarPerfis")


useEffect(()=>{
  handleListarFuncoes()

},[])



 const handleListarFuncoes = async () => {
      await postData({id_user})

 }

  

    return(
        <Dialog>
  <DialogTrigger>
  <Button className="w-full" variant="outline">Perfis</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar Perfis</DialogTitle>
      <DialogDescription>
        Adicione aqui os perfis desse usuário na empresa
      </DialogDescription>
    </DialogHeader>

    <div>
      <Table>
        <Table.Head>
          <Table.HeadCell>
            nome
          </Table.HeadCell>
          <Table.HeadCell>
            Perfil
          </Table.HeadCell>
        </Table.Head>

        <Table.Body>
          {perfis?.map((item,index)=>(
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {item?.nome}
            </Table.Cell>
            <Table.Cell>
              {item?.funcao}
            </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>

      </Table>
    </div>
  
  </DialogContent>
</Dialog>
    )
}