import { useEffect, useRef, useState } from 'react';
import { ObitoProps } from './../../_types/obito';
import { pageStyle } from '@/utils/pageStyle';
import { useReactToPrint } from 'react-to-print';
export type DocsObito = 'ordemDeServico' | 'tanato'

type SetarListaObitoType = (item: Partial<ObitoProps>) => void
export function useActionsPrintOS(

  itemSelecionado: Partial<ObitoProps | null>,
  idContratoGlobal: number | null,
  setarListaObito: SetarListaObitoType,
  onClose?: Function,

) {

  const [documentoAtivo, setDocumentoAtivo] = useState<DocsObito | null>(null) 

  const componentRefs = {

    ordemDeServico: useRef<HTMLDivElement>(null),
    tanato: useRef<HTMLDivElement>(null)

  }


  const limparEstadoPosImpressao = () => {
    console.log("Impressão concluída ou cancelada. Limpando estado.")
    setDocumentoAtivo(null)
    onClose?.()
  }

  const imprimirOrdemDeServico = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "ORDEM DE SERVIÇO",
    contentRef: componentRefs.ordemDeServico,
    onAfterPrint: limparEstadoPosImpressao,
    
  })

  const imprimirTanato = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: "TANATO",
    contentRef: componentRefs.tanato,
    onAfterPrint: limparEstadoPosImpressao,

  })

  useEffect(() => {
    if (documentoAtivo) {
      console.log(`useEffect do hook detectou: '${documentoAtivo}'. Acionando a impressão.`)
      if (documentoAtivo === 'ordemDeServico') {
        imprimirOrdemDeServico()
      } else if (documentoAtivo === 'tanato') {
        imprimirTanato()
      }
    }
  }, [documentoAtivo])

  const iniciarImpressao = (doc: DocsObito) => {
    console.log(`Componente soliucitou impressão para: ${doc}`)

    setDocumentoAtivo(doc)
  }

  return {
    iniciarImpressao,
    componentRefs,
    documentoAtivo
  }
}