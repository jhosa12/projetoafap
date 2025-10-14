'use client';

import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient"
import Head from "next/head"
import React, { useContext, useEffect, useState } from "react"
import { BiSolidInjection } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PlanoContasProps } from "../financeiro/_types/ccustos";
import { PlanoContas } from "./_components/plano-contas/modal-adicionar-conta";



interface MetasProps {
  id_meta: number,
  id_conta: string,
  id_grupo: number,
  descricao: string,
  valor: number,
  date: Date,
  grupo: GruposProps
}


interface GruposProps {
  id_grupo: number,
  descricao: string
}
interface PlanosProps {
  id_plano: number,
  descricao: string,
  limite_dep: number,
  valor: number,
  acrescimo: number

}
interface ConvProps {
  id_conv_global: number,
  id_conv: number,
  id_produto: number,
  descricao: string,
  unidade: number,
  grupo: number,
  data: Date,
  data_dev: Date,
  quantidade: number,
  valor: number,
  desconto: number,
  total: number,
  cortesia: string,
  retornavel: string,
  status: string
}




export default function gerenciarAdministrativo() {

  const [arrayPlanoContas, setArrayPlanoContas] = useState<Array<PlanoContasProps>>([])
  const [arraygrupos, setArrayGrupos] = useState<Array<GruposProps>>([])
  const [arrayPlanos, setArrayPlanos] = useState<Array<PlanosProps>>([])
  const [arrayConv, setArrayConv] = useState<Array<ConvProps>>([])
  const [arrayMetas, setArrayMetas] = useState<Array<MetasProps>>([])
  const { usuario, signOut, selectEmp, empresas } = useContext(AuthContext)




  const setarDados = (planoContas: Array<PlanoContasProps>, grupos: Array<GruposProps>) => {
    setArrayPlanoContas(planoContas)
    setArrayGrupos(grupos)
  }
  const setarPlanos = (planos: Array<PlanosProps>) => {
    setArrayPlanos(planos)

  }
  const setarConv = (conv: Array<ConvProps>) => {
    setArrayConv(conv)

  }
  const setarMetas = (met: Array<MetasProps>) => {
    setArrayMetas(met)

  }

  useEffect(() => {
    const user = !!usuario
    if (!user) {
      signOut()
      return;
    }

    try {
      carregarDados();
    } catch (err) {
      toast.error('Erro ao Carregar Dados')
    }

  }, [usuario]);






  async function carregarDados() {
    const response = await api.get('/gerenciarAdministrativo')
    setarDados(response.data.plano_contas, response.data.grupos)
    setArrayPlanos(response.data.planos)
    setArrayConv(response.data.convalescenca)
    setArrayMetas(response.data.metas)
  }

  return (
    <>
      <Head>
        <title>Gerenciar setor Administrativo</title>
      </Head>

      <Tabs defaultValue="plano-contas" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white">
          <TabsTrigger value="plano-contas" className="flex items-center gap-2">
            <FaCalendarAlt className="h-4 w-4" />
            PLANO DE CONTAS
          </TabsTrigger>
          <TabsTrigger value="convalescentes" className="flex items-center gap-2">
            <BiSolidInjection className="h-4 w-4" />
            CONVALESCENTES
          </TabsTrigger>
          <TabsTrigger value="metas" className="flex items-center gap-2">
            <IoMdSettings className="h-4 w-4" />
            METAS CONTAS
          </TabsTrigger>
          <TabsTrigger value="veiculos" className="flex items-center gap-2">
            <IoMdSettings className="h-4 w-4" />
            VEÍCULOS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plano-contas" className="bg-white rounded-b-lg p-4 h-[calc(100vh-120px)] overflow-auto">
          <PlanoContas
            carregarDados={carregarDados}
            arrayPlanoContas={arrayPlanoContas}
            arraygrupos={arraygrupos}
            setarDados={setarDados}
          />
        </TabsContent>
      </Tabs>



    </>)
}