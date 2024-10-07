import {  useContext, useEffect, useState } from "react"
import Head from "next/head"
import { AuthContext } from "@/contexts/AuthContext"
import {  Tabs } from "flowbite-react"
import {  FaStore } from "react-icons/fa"
import { Estoque } from "@/components/estoque/estoque"
import { RiHistoryLine} from "react-icons/ri"
import { HistoricoMov } from "@/components/estoque/historico/historico"
import useApi from "@/hooks/useApi"

export interface FormProps{
  grupo:string,
  id_produto:number|null,
  descricao:string
}

export interface EstoqueProps{
    id_produto:number,
    descricao:string,
    quantidade:number,
    tipo:string,
    grupo:string
    cod_prod:string
    alerta:number,
    estoque:Array<{
      id_estoque:number,
      quantidade:number,
      descricao:string,
      id_empresa:string,
      empresa:string
    }>
   // estoque:Array<EstoqueProps>
}
export interface ProdutosProps{
  id_produto:number,
  descricao:string,
  cod_prod:string,
  estoque:Array<{quantidade:number,id_empresa:string}>
}

export default function AdministrarEstoque(){
  
    const [arrayConv,setArrayConv]= useState<Array<EstoqueProps>>([]) 
    const {usuario,empresas,permissoes} = useContext(AuthContext);
    const [tab,setTab] = useState<number>(0)
    const {getData,data}  = useApi<Array<ProdutosProps>,undefined>("/estoque/selectProdutos")

   









    useEffect(()=>{
     getData()
        //reqDadosEstoque()
        
    },[])

  //   const reqDadosEstoque= useCallback(async()=> {
  //       try {
  //           const response =await api.post('/estoque/listar')
           

  //         //  const novoArrayConv = response.data.produtos.filter((item:ConvProps)=>item.)
  //           setArrayConv(response.data)
           

  //       } catch (error) {
  //           console.log(error)
  //       }
        
  //   },[]
  // )
    return(
        <>
            <Head>
                <title>Estoque</title>
            </Head>

            <div className="flex flex-col px-4 w-full text-white">
      <Tabs theme={{tabpanel:'py-1',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-400 "
      }}}}}}}  variant="underline"   onActiveTabChange={e=>setTab(e)}>

      <Tabs.Item  active={tab===0} title="Estoque" icon={FaStore}>
       {tab===0 && <Estoque permissoes={permissoes} reqProdutos={getData} selectProdutos={data??[]} empresas={empresas}  id_usuario={usuario?.id??''} usuario={usuario?.nome??''}   />}
     
      </Tabs.Item>
      <Tabs.Item  active={tab===1} title="Histórico de Movimentação" icon={RiHistoryLine}>
     {tab===1 && <HistoricoMov  id_usuario={usuario?.id??''} usuario={usuario?.nome??''} />}
      </Tabs.Item>

    
    </Tabs>
      </div>
               
             














       

                
                    
                 
              

        </>
     
         














    )

}