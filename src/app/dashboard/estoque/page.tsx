'use client';

import { Suspense, useContext, useEffect, useState, lazy } from "react"
import Head from "next/head"
import { AuthContext } from "@/store/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, History } from "lucide-react"
import useApi from "@/hooks/useApiPost"
import { Estoque } from "./components/estoque";

export interface FormProps {
  grupo: string,
  id_produto: number | null,
  descricao: string
  id_empresa: string | undefined
}

export interface ProdutosProps {
  id_produto: number,
  descricao: string,
  cod_prod: string,
  estoque: Array<{ quantidade: number, id_empresa: string }>
}

const HistoricoMov = lazy(() => import('@/app/dashboard/estoque/components/historico/historico'))

export default function AdministrarEstoque() {
  const { empresas, permissoes } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'estoque' | 'historico'>('estoque')
  const { postData, data } = useApi<Array<ProdutosProps>, undefined>("/estoque/selectProdutos")

  useEffect(() => {
    postData(undefined)
  }, [])

  return (
    <>
      <Head>
        <title>Estoque</title>
      </Head>

      <div className="flex flex-col w-full text-white">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'estoque' | 'historico')}>
          <TabsList>
            <TabsTrigger value="estoque">
              <Store className="mr-2 h-4 w-4" />
              Estoque
            </TabsTrigger>
            <TabsTrigger value="historico">
              <History className="mr-2 h-4 w-4" />
              Histórico de Movimentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estoque">
            {activeTab === 'estoque' && (
              <Estoque permissoes={permissoes} reqProdutos={() => postData(undefined)} selectProdutos={data ?? []} empresas={empresas} />
            )}
          </TabsContent>

          <TabsContent value="historico">
            {activeTab === 'historico' && (
              <Suspense fallback={<div>Carregando...</div>}>
                <HistoricoMov permissoes={permissoes} />
              </Suspense>
            )}
          </TabsContent>
        </Tabs>
      </div>

















    </>
















  )

}