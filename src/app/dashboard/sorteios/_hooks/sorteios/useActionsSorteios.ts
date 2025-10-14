import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { PremioProps } from "../../_types/premio";
import { DadosSorteiosProps } from "../../_types/sorteios";
import { GanhadoresProps } from "../../_types/ganhadores";






export const useActionsSorteios = () => {

  const [dadosSorteio, setSorteio] = useState<Array<DadosSorteiosProps>>([]);
  const [ganhador, setGanhador] = useState<Partial<DadosSorteiosProps>>({})
  const [premios, setPremios] = useState<Array<PremioProps>>([])
  const [premioAtual, setPremioAtual] = useState<PremioProps>()
  const [ganhadores, setGanhadores] = useState<Array<GanhadoresProps>>([]);
  const [loading, setLoading] = useState(false)


  async function listarPremios() {
    toast.promise(
      api.get('/sorteio/listarPremios'),
      {
        error: 'Erro ao Requisitar Dados',
        loading: 'Listando dados.....',
        success: (response) => {
          setPremios(response.data)
          return 'Dados Carregados'
        }
      }
    )

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

  async function listarGanhadores() {

    try {
      const response = await api.post('/sorteio/listarGanhadores',
        {
          data_sorteio: undefined
        }
      )
      setGanhadores(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }


  }
  return {

    listarPremios,
    salvarGanhador,
    listarGanhadores,


    ganhador,
    setGanhador,
    setSorteio,
    premios,
    setPremioAtual,
    ganhadores,
    dadosSorteio,
    loading,
    setLoading,
    premioAtual


  }
}