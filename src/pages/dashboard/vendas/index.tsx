import { useContext, useEffect, useState, useCallback } from "react"
import Head from "next/head"
import { AuthContext } from "@/store/AuthContext"
import { Tabs } from "flowbite-react"
import { FaStore } from "react-icons/fa"
import { RiHistoryLine } from "react-icons/ri"
import { Acompanhamento, SetorProps } from "@/components/vendas/acompanhamento"
import { Historico } from "@/components/vendas/historico/ScreenHistorico"
import useApiGet from "@/hooks/useApiGet"
import { toast } from "sonner"
import { CidadeSelectVirtualizada } from "@/components/ui/virtualize"
import { useForm } from "react-hook-form"
import { SalesTracking } from "@/components/vendas/sales/SalesTracking"


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

  const { usuario, infoEmpresa,cidades} = useContext(AuthContext);
  const [tab, setTab] = useState<number>(0)
  const {data,postData} = useApiGet<Array<SetorProps>,undefined>("/gerenciarAdministrativo/listarSetores")

  const mockSetores = [
    { id_grupo: 1, descricao: "Vendas Diretas" },
    { id_grupo: 2, descricao: "Televendas" },
    { id_grupo: 3, descricao: "E-commerce" },
    { id_grupo: 4, descricao: "Parcerias" }
  ];

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
      
        <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'w-full bg-white rounded-b-lg h-[calc(100vh-100px)]',tablist:{tabitem:{base: "flex items-center  justify-center px-4 py-3 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}} variant="underline" onActiveTabChange={e => setTab(e)}>

          <Tabs.Item active={tab === 0} title="ACOMPANHAMENTO" icon={()=><FaStore className="mr-2 h-4 w-4"/>}>
           {/* { tab === 0 && <Acompanhamento logoUrl={infoEmpresa?.logoUrl??''} usuario={usuario?.nome??''} setores={data??[]} empresa={infoEmpresa?.id??''} />} */}
            <SalesTracking
              empresa="1"
              setores={mockSetores}
              logoUrl="/placeholder.svg"
            />
          </Tabs.Item>
          <Tabs.Item active={tab === 1} title="HISTÓRICO" icon={()=><RiHistoryLine className="mr-2 h-4 w-4"/>}>
           
              
               {tab === 1 && <Historico />}
              
          </Tabs.Item>
       
        </Tabs>
    </>

  )

}