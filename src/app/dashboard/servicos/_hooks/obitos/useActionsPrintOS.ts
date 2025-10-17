import { useEffect, useRef, useState } from 'react';
import { ObitoProps } from './../../_types/obito';
import { pageStyle } from '@/utils/pageStyle';
import { useReactToPrint } from 'react-to-print';
export type DocsObito = 'ORDEMSERVICO' | 'TANATO'

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
    
      if (documentoAtivo === 'ORDEMSERVICO') {
        imprimirOrdemDeServico()
      } else if (documentoAtivo === 'TANATO') {
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