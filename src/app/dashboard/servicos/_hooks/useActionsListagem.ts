import { useCallback, useEffect, useState } from "react"
import { ConvProps } from "../_types/convalescente"
import { api } from "@/lib/axios/apiClient"
import { toast } from "sonner"

interface ActionsProps {


  // --- Estados que a UI irá ler ---
  pendente: boolean
  aberto: boolean
  entregue: boolean
  criterio: string
  input: string
  arrayConv: Array<ConvProps>
  listaConv: Partial<ConvProps>
  excluir: boolean
  arrayFiltro: Array<ConvProps>
  currentItems: Array<ConvProps>
  pageCount: number

  // --- Funções para alterar o estado  ---
  setPendente: (value: boolean) => void
  setAberto: (value: boolean) => void
  setEntregue: (value: boolean) => void
  setCriterio: (value: string) => void
  setInput: (value: string) => void
  setExcluir: (value: boolean) => void

  // --- Funções de Ação ---
  setarListaConv: (fields: Partial<ConvProps>) => void
  handlePageClick: (selectdItem: { selected: number }) => void
  listarConv: () => Promise<void>
  deletarConv: () => Promise<void>
  receberDevolucao: (id_conv: number) => Promise<void>

}


const useActionsListagem = () => {

  const [input, setInput] = useState('')
  const [arrayConv, setConv] = useState<Array<ConvProps>>([])
  const [criterio, setCriterio] = useState("Contrato")
  const [listaConv, setLista] = useState<Partial<ConvProps>>({ convalescenca_prod: [] });
  const [excluir, setExcluir] = useState(false)
  const [pendente, setPendente] = useState(true)
  const [entregue, setEntregue] = useState(true)
  const [arrayFiltro, setFiltro] = useState<Array<ConvProps>>([])
  const [aberto, setAberto] = useState(true)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 16;

  const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
    setLista(prev => ({ ...prev, ...fields }));
  }, []);

  const handlePageClick = (selectdItem: { selected: number }) => {
    setCurrentPage(selectdItem.selected)
  }

  const offset = currentPage * itemsPerPage;

  const currentItems = arrayFiltro.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(arrayFiltro.length / itemsPerPage);


  useEffect(() => {
    try {

      listarConv()

    } catch (error) {


    }
  }, [])

  async function listarConv() {

    if (!input) {
      const response = await api.post("/convalescencia/listar")
      setConv(response.data)


    }
    else if (criterio === 'Contrato') {
      const response = await api.post("/convalescencia/listar", {
        id_contrato: Number(input)
      }
      )
      setConv(response.data)

    }
    else if (criterio === 'Titular') {
      const response = await api.post("/convalescencia/listar", {
        titular: input.toUpperCase()
      })
      setConv(response.data)
    }

    else if (criterio === 'Usuario') {
      const response = await api.post("/convalescencia/listar", {
        nome: input.toUpperCase()
      })
      setConv(response.data)
    }
  }

  async function deletarConv() {
    toast.promise(
      api.delete("/convalescencia/deletar", {
        data: {
          id_conv: listaConv.id_conv
        }
      }),
      {
        error: 'Erro ao deletar lançamento',
        loading: 'Efetuando Exclusão',
        success: 'Excluido com sucesso!'

      }
    )
    listarConv()
    setarListaConv({ id_conv: undefined })
    setExcluir(false)

  }

  async function receberDevolucao(id_conv: number) {

    toast.promise(
      api.put("/convalescencia/receber",
        {
          id_conv,
          status: "FECHADO"
        }
      ),
      {
        error: "Erro na Requisição",
        loading: "Realizando Devolução",
        success: "Produto devolvido com Sucesso"
      }

    )



    setInput('')
    listarConv()
  }

  useEffect(() => {

    if (arrayConv.length > 0) {
      let novoArray
      if (pendente && entregue && aberto) {
        setFiltro(arrayConv)
      }

      else if (pendente && !aberto && !entregue) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE'))
      }
      else if (aberto && !pendente && !entregue) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'ABERTO'))
      }
      else if (entregue && !pendente && !aberto) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.every(dado => dado.status === 'FECHADO'))
      }
      else if (pendente && aberto && !entregue) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE' || dado.status === 'ABERTO'))
      }
      else if (pendente && entregue && !aberto) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE' || dado.status === 'FECHADO'))
      }
      else if (aberto && entregue && !pendente) {
        novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'FECHADO' || dado.status === 'ABERTO'))
      }


      novoArray && setFiltro(novoArray)

    }


  }, [pendente, entregue, aberto, arrayConv])

  return {

    
  // --- Estados que a UI irá ler ---
  pendente,
  aberto,
  entregue,
  criterio,
  input,
  arrayConv,
  listaConv,
  excluir,
  arrayFiltro,
  currentItems,
  pageCount,

  // --- Funções para alterar o estado  ---
  setPendente,
  setAberto,
  setEntregue,
  setCriterio,
  setInput,
  setExcluir,

  // --- Funções de Ação ---
  setarListaConv,
  handlePageClick,
  listarConv,
  deletarConv,
  receberDevolucao

  }
}


export default useActionsListagem;