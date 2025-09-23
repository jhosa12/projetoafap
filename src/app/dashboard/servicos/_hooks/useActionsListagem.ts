import { useCallback, useEffect, useRef, useState } from "react"
import { ConvProps } from "../_types/convalescente"
import { api } from "@/lib/axios/apiClient"
import { toast } from "sonner"
import { useReactToPrint } from "react-to-print"


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
  componentRefComprovante: React.RefObject<HTMLDivElement>;
  componentRefContrato: React.RefObject<HTMLDivElement>;

  // --- Funções para alterar o estado  ---
  setPendente: (value: boolean) => void
  setAberto: (value: boolean) => void
  setEntregue: (value: boolean) => void
  setCriterio: (value: string) => void
  setInput: (value: string) => void
  setExcluir: (value: boolean) => void
  setFiltro: Array<ConvProps>

  // --- Funções de Ação ---
  setarListaConv: (fields: Partial<ConvProps>) => void
  handlePageClick: (selectdItem: { selected: number }) => void
  listarConv: () => Promise<void>
  deletarConv: () => Promise<void>
  receberDevolucao: (id_conv: number) => Promise<void>
  imprimirComprovante: () => void;
  imprimirContrato: () => void;
  receberDev: (status: string) => Promise<void>;

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
  const componentRefComprovante = useRef<HTMLDivElement>(null);
  const componentRefContrato = useRef<HTMLDivElement>(null);

  const setarListaConv = useCallback((fields: Partial<ConvProps>) => {
    setLista(prev => ({ ...prev, ...fields }));
  }, []);


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

  async function receberDevolucao(id_conv_prod: number | null) {

    await toast.promise(
      api.put("/convalescencia/receber",
        {
          id_conv_prod,
          status: "ENTREGUE",
         
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

    let dadosProcessados = arrayConv

    if (input.trim() !== '') {

      dadosProcessados = dadosProcessados.filter(item => {

        const termoBusca = input.toLowerCase()

        if (criterio === 'Titular' && item.nome) {
          return item.nome.toLowerCase().startsWith(termoBusca)
        }

        if (criterio === 'Contrato' && item.id_contrato) {
          return String(item.id_contrato).startsWith(termoBusca)
        }

        if (criterio === 'Usuario' && item.usuario) {
          return item.usuario.toLowerCase().startsWith(termoBusca)
        }

        return item.nome ? item.nome.toLowerCase().startsWith(termoBusca) : false
      })
    }

    if (pendente || aberto || entregue) {
      dadosProcessados = dadosProcessados.filter(item => {
        const statusDoItem = (item.status || '').trim().toUpperCase()
        if (pendente && statusDoItem === 'PENDENTE') return true
        if (aberto && statusDoItem === 'ABERTO') return true
        if (entregue && statusDoItem === 'ENTREGUE') return true
        return false
      })
    }

    setFiltro(dadosProcessados);

  }, [input, criterio, pendente, entregue, aberto, arrayConv]);

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
    componentRefComprovante,
    componentRefContrato,


    // --- Funções para alterar o estado  ---
    setPendente,
    setAberto,
    setEntregue,
    setCriterio,
    setInput,
    setExcluir,
    setFiltro,

    // --- Funções de Ação ---
    setarListaConv,
    listarConv,
    deletarConv,
    receberDevolucao,

  }
}


export default useActionsListagem;