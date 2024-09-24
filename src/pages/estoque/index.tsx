import { useCallback, useContext, useEffect, useState } from "react"
import { api } from "@/services/apiClient"
import Head from "next/head"
import { AuthContext } from "@/contexts/AuthContext"
import {  Tabs } from "flowbite-react"
import {  FaStore } from "react-icons/fa"
import { Estoque } from "@/components/estoque/estoque"
import { RiHistoryLine, RiProductHuntFill } from "react-icons/ri"
import { HistoricoMov } from "@/components/estoque/historico/historico"


export interface ConvProps{
    id_produto:number,
    descricao:string,
    quantidade:number
    grupo:string
    cod_prod:string
    id_empresa:string,
    alerta:number
   // estoque:Array<EstoqueProps>
}
export interface ProdutosProps{
  id_produto:number,
  descricao:string
}

export default function AdministrarEstoque(){
  
    const [arrayConv,setArrayConv]= useState<Array<ConvProps>>([]) 
    const [arrayProdutos,setArrayProdutos] = useState<Array<ProdutosProps>>([])
    const {usuario,empresas} = useContext(AuthContext);
   



const reqProdutos = useCallback(async() => {
   try {
    const response= await api.get("/estoque/selectProdutos")
    setArrayProdutos(response.data)
   } catch (error) {
    console.log(error)
   }
},[]
)  

    useEffect(()=>{
        reqDadosEstoque()
        reqProdutos()
    },[])

    const reqDadosEstoque= useCallback(async()=> {
        try {
            const response =await api.post('/estoque/listar')
            console.log(response.data)

          //  const novoArrayConv = response.data.produtos.filter((item:ConvProps)=>item.)
            setArrayConv(response.data)
           

        } catch (error) {
            console.log(error)
        }
        
    },[]
  )
    return(
        <>
            <Head>
                <title>Estoque</title>
            </Head>

            <div className="flex flex-col px-4 w-full text-white">
      <Tabs theme={{tabpanel:'py-1',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-400 "
      }}}}}}}  variant="underline">

      <Tabs.Item  active title="Estoque" icon={FaStore}>
        <Estoque  id_usuario={usuario?.id??''} usuario={usuario?.nome??''} setArrayEstoque={setArrayConv} arrayProdutos={arrayProdutos} arrayEstoque={arrayConv}/>
     
      </Tabs.Item>
      <Tabs.Item title="Histórico de Movimentação" icon={RiHistoryLine}>
      <HistoricoMov  id_usuario={usuario?.id??''} usuario={usuario?.nome??''} setArrayEstoque={setArrayConv} arrayProdutos={arrayProdutos} arrayEstoque={arrayConv}/>
      </Tabs.Item>

    
    </Tabs>
      </div>
               
             














       

                
                    
                 
              

        </>
     
         














    )

}