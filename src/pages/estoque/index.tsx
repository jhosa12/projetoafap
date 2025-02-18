import {  Suspense, useContext, useEffect, useState,lazy } from "react"
import Head from "next/head"
import { AuthContext } from "@/contexts/AuthContext"
import {  Tabs } from "flowbite-react"
import {  FaStore } from "react-icons/fa"
import { Estoque } from "@/components/estoque/estoque"
import { RiHistoryLine} from "react-icons/ri"

import useApi from "@/hooks/useApiPost"

export interface FormProps{
  grupo:string,
  id_produto:number|null,
  descricao:string
  id_empresa:string|undefined
}

const HistoricoMov = lazy(()=>import('@/components/estoque/historico/historico'))

export interface EstoqueProps{
    id_produto:number,
    descricao:string,
    quantidade:number,
    empresa:string
    produtos:{grupo:string,descricao:string,cod_prod:true, tipo:string},
   
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
    const {postData,data}  = useApi<Array<ProdutosProps>,undefined>("/estoque/selectProdutos")

   
    useEffect(()=>{
     postData(undefined)
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

            <div className="flex flex-col w-full text-white">
      <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-104px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}}  variant="underline"  onActiveTabChange={e=>setTab(e)}>

      <Tabs.Item  active={tab===0} title="Estoque" icon={FaStore}>
       {tab===0 && <Estoque permissoes={permissoes} reqProdutos={()=>postData(undefined)} selectProdutos={data??[]} empresas={empresas} />}
      </Tabs.Item>
      <Tabs.Item  active={tab===1} title="Histórico de Movimentação" icon={RiHistoryLine}>
     {tab===1 &&
     <Suspense fallback={<div>Carregando...</div>}>
       <HistoricoMov permissoes={permissoes}  id_usuario={usuario?.id??''} usuario={usuario?.nome??''} />
     </Suspense>
     
      
      }
      </Tabs.Item>

    
    </Tabs>
      </div>
               
             














       

                
                    
                 
              

        </>
     
         














    )

}