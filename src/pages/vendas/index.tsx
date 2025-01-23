import { Suspense, useContext, useEffect, useState, useCallback } from "react"
import Head from "next/head"
import { AuthContext } from "@/contexts/AuthContext"
import { Tabs } from "flowbite-react"
import { FaStore } from "react-icons/fa"
import { RiHistoryLine } from "react-icons/ri"
import { Acompanhamento, SetorProps } from "@/components/vendas/acompanhamento"
import { Historico } from "@/components/vendas/historico/historico"
import useApiGet from "@/hooks/useApiGet"
import { toast } from "react-toastify"


export interface FormProps {
  grupo: string,
  id_produto: number | null,
  descricao: string
  id_empresa: string | undefined
}



export interface EstoqueProps {
  id_produto: number,
  descricao: string,
  quantidade: number,
  empresa: string
  produtos: { grupo: string, descricao: string, cod_prod: true, tipo: string },

  // estoque:Array<EstoqueProps>
}
export interface ProdutosProps {
  id_produto: number,
  descricao: string,
  cod_prod: string,
  estoque: Array<{ quantidade: number, id_empresa: string }>
}

export default function Vendas() {

  const { usuario, empresas, permissoes, selectEmp } = useContext(AuthContext);
  const [tab, setTab] = useState<number>(0)
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const {data,postData} = useApiGet<Array<SetorProps>,undefined>("/gerenciarAdministrativo/listarSetores")

  const listarSetores = useCallback(async()=>{

    try {
      await postData(undefined)
   
      
    } catch (error) {
      toast.error('Erro ao listar setores')
    }
  },[])

  useEffect(() => {
    listarSetores()
    
  },[])
  
  return (
    <>
      <Head>
        <title>Vendas</title>
      </Head>

        <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-70px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}} variant="underline" onActiveTabChange={e => setTab(e)}>

          <Tabs.Item active={tab === 0} title="ACOMPANHAMENTO" icon={()=><FaStore className="mr-2 h-4 w-4"/>}>
            {tab === 0 && <Acompanhamento usuario={usuario?.nome??''} setores={data??[]} empresa={selectEmp} />}

          </Tabs.Item>
          <Tabs.Item active={tab === 1} title="HISTÓRICO" icon={()=><RiHistoryLine className="mr-2 h-4 w-4"/>}>
            {tab === 1 &&
              
                <Historico />
              }
          </Tabs.Item>
       
        </Tabs>
    </>

  )

}