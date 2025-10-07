import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos"
import { api } from "@/lib/axios/apiClient"
import { useState } from "react"
import { toast } from "sonner"

const useActionsProdutos = () => {
  
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutosProps>>([])
  

  async function listarProdutos() {
    
    toast.promise(

      api.post('/produtos/listar',
       
      )

    )
  }


  return {

  }
}