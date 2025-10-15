import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { PremioProps } from "../_types/premio";
import { DadosSorteiosProps } from "../_types/sorteios";
import { GanhadoresProps } from "../_types/ganhadores";
import { SubmitHandler } from "react-hook-form";
import { ConveniadosProps } from "@/app/dashboard/conveniados/page";


interface ActionsProps {

  conveniados?: Array<ConveniadosProps>,

}


export const useActionsSorteios = (param: Partial<ActionsProps> = {}) => {

  const { conveniados = [] } = param

  const [dadosSorteio, setSorteio] = useState<Array<DadosSorteiosProps>>([]);
  const [ganhador, setGanhador] = useState<Partial<DadosSorteiosProps>>({})
  const [premios, setPremios] = useState<Array<Partial<PremioProps>>>([])
  const [premioAtual, setPremioAtual] = useState<PremioProps>()
  const [ganhadores, setGanhadores] = useState<Array<GanhadoresProps>>([]);
  const [loading, setLoading] = useState(false)


  async function listarPremios() {
    try {

      const response = await api.get('/sorteio/listarPremios')
      setPremios(response.data)

    } catch (error) {

      toast.error("Erro ao busca prêmios.")
    }
  }

  async function cadastrarPremio(data: PremioProps) {


    try {

      const conveniadoNome = conveniados.find(
        item => String(item.id_conveniados) === String(data.id_conveniados)
      )?.conveniado || "";

      const payload = {
        id_empresa: data.id_empresa,
        id_conveniados: Number(data.id_conveniados),
        conveniado: conveniadoNome,
        descricao: data.descricao,
        data: new Date(),
        ordem: data.ordem,
      }


      const response = await api.post('/sorteio/cadastroPremio', payload)



      const premio: PremioProps = response.data
      setPremios([...premios, premio])

    } catch (error) {
      console.log(error)
      toast.error('Erro ao cadastrar prêmio!')

    }
  }

  async function salvarGanhador() {
    if (!ganhador.id_contrato_global) {
      toast.error('Sorteio não selecionado!')
      return
    }
    try {
      const response = await api.post('/sorteio/salvarGanhador', {
        id_empresa: ganhador.id_empresa,
        id_contrato_global: ganhador.id_contrato_global,
        id_contrato: ganhador.id_contrato,
        bairro: ganhador.associado?.bairro,
        endereco: ganhador.associado?.endereco,
        cidade: ganhador.associado?.cidade,
        numero: ganhador.associado?.numero,
        titular: ganhador.associado?.nome,
        premio: premioAtual,
        status: 'PENDENTE',
        data_sorteio: new Date()
      })

      console.log(response.data)
      setPremios(response.data.premios)
      setGanhadores(response.data.ganhadores)

    } catch (error) {
      console.log(error)
      toast.error('Erro ao salvar ganhador!')

    }
    setLoading(false)


  }

  async function listarGanhadores(
    { date,
      id_empresa }:
      {
        date?: Date | undefined,
        id_empresa?: string | undefined
      }) {

    setLoading(true)

    try {
      const response = await api.post('/sorteio/listarGanhadores',
        {
          data_sorteio: date,
          id_empresa

        }
      )

      setGanhadores(response.data)

    } catch (error) {

      console.log(error)
      toast.error("Erro ao buscar ganhadores!")

    }
    setLoading(false)


  }

  async function deletarPremio(premio: PremioProps) {

    try {

      const response = await api.delete("/sorteio/deletarPremio", {
        data: {
          id_premio: premio.id_premio
        }
      })

      listarPremios()
      toast.success("Prêmio excluído com sucesso!")

    } catch (error) {
      throw error
    }
  }

  async function editarPremio(data: PremioProps) {

    try {

      const response = await api.put('/sorteio/editarPremio', {
        id_premio: data.id_premio,
        descricao: data.descricao,
        id_empresa: data.id_empresa,
        id_conveniados: data.id_conveniados
      })


    } catch (error) {


      toast.error("Erro ao editar prêmio.")

    }
  }

  async function editarStatusGanhador(data: GanhadoresProps) {

    try {

      const response = await api.put("/sorteio/editarGanhador", {
        id_contrato_global: data.id_contrato_global,
        status: data.status

      })

      console.log("Dados para api:", response.data)

    } catch (error) {
      toast.error("Erro ao atualizar status do ganhador.")
    }
  }

  const onSave: SubmitHandler<PremioProps> = async (data) => {

    try {

      if (data.id_premio) {
        await editarPremio(data)
        toast.success("Prêmio editado com sucesso!")
        await listarPremios()

      } else {

        await cadastrarPremio(data)
        toast.success("Prêmio cadastrado com sucesso!")
        await listarPremios()
      }
      return true

    } catch (error) {

      toast.error("Erro ao cadastrar prêmio!")

    }
    return true
  }


  return {

    listarPremios,
    salvarGanhador,
    listarGanhadores,
    cadastrarPremio,
    editarPremio,
    deletarPremio,
    editarStatusGanhador,
    onSave,


    ganhador,
    setGanhador,
    setSorteio,
    premios,
    setPremios,
    setPremioAtual,
    ganhadores,
    dadosSorteio,
    loading,
    setLoading,
    premioAtual,


  }
}