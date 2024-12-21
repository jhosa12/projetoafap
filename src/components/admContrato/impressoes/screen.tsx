import { AuthContext } from "@/contexts/AuthContext";
import PrintButtonCarne from "@/Documents/mensalidade/PrintButton";
import DocumentTemplate from "@/Documents/contratoAdesão/DocumentTemplate";
import Carteiras from "@/Documents/carteiraAssociado/DocumentTemplate";
import { Button } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ImpressaoCarne from "@/Documents/mensalidade/ImpressaoCarne";
import ContratoResumo from "@/Documents/contratoResumido/ContratoResumo";
import pageStyle from "@/utils/pageStyle";



export function Impressoes() {
    const { dadosassociado } = useContext(AuthContext)
    const componentContrato = useRef<DocumentTemplate>(null)
    const componentCarteira = useRef<Carteiras>(null)
    const componentCarne = useRef<ImpressaoCarne>(null)
    const componentResumo = useRef<ContratoResumo>(null)
    const [printCarne, setPrintCarne] = useState(false)
    const [printContrato, setPrintContrato] = useState(false)
    const [printCarteira, setPrintCarteira] = useState(false)
    const [printResumo, setPrintResumo] = useState(false)



    useEffect(()=>{
        printCarne && imprimirCarne()
        printContrato && imprimirContrato()
        printCarteira && imprimirCarteira()
        printResumo && imprimirResumo()
    },[printCarne,printContrato,printCarteira,printResumo])




    const imprimirResumo =useReactToPrint({
        pageStyle: pageStyle,
        documentTitle:'RESUMO CONTRATO',
        content:()=>componentResumo.current,
     
        onAfterPrint:()=>{
            setPrintResumo(false)
        }
        

   })




    const imprimirCarne =useReactToPrint({
        pageStyle: pageStyle,
        documentTitle:'CARNÊ ASSOCIADO',
        content:()=>componentCarne.current,
     
        onAfterPrint:()=>{
            setPrintCarne(false)
        }
        

   })

    
    const imprimirContrato =useReactToPrint({
        pageStyle: pageStyle,
        documentTitle:'CONTRATO ASSOCIADO',
        content:()=>componentContrato.current,
        onAfterPrint:()=>{
            setPrintContrato(false)
        }

   })


   const imprimirCarteira =useReactToPrint({
    pageStyle:pageStyle,
    documentTitle:'CONTRATO ASSOCIADO',
    content:()=>componentCarteira.current,
    onAfterPrint:()=>{
        setPrintCarteira(false)
    }

})

    return (
        <>
        <div style={{ display: 'none' }}>
    {  printContrato &&      <DocumentTemplate
            adesao={new Date(dadosassociado?.contrato?.dt_adesao ?? '')}
            bairro={dadosassociado?.bairro ?? ''}
            cidade={dadosassociado?.cidade ?? ''}
            complemento={dadosassociado?.guia_rua ?? ''}
            contrato={dadosassociado?.contrato?.id_contrato ?? 0}
            cpf={dadosassociado?.cpfcnpj ?? ''}
            dependentes={dadosassociado?.dependentes ?? []}
            endereco={dadosassociado?.endereco ?? ''}
            estado={dadosassociado?.uf ?? ''}
            nome={dadosassociado?.nome ?? ''}
            numero={String(dadosassociado?.numero) ?? ''}
            rg={dadosassociado?.rg ?? ''}
            telefone={dadosassociado?.celular1 ?? ''}
            
        ref={componentContrato} />}

       { printCarteira && <Carteiras
            dependentes={dadosassociado?.dependentes ?? []}
            plano={dadosassociado?.contrato?.plano ?? ''}
            ref={componentCarteira}
            bairro={dadosassociado?.bairro ?? ''}
            cartTitular={true}
            celular={dadosassociado?.celular1 ?? ''}
             cidade={dadosassociado?.cidade ?? ''}
             contrato={dadosassociado?.contrato?.id_contrato ?? 0}
             dependentesTitular={dadosassociado?.dependentes ?? []}
             endereco={dadosassociado?.endereco ?? ''}
             numero={Number(dadosassociado?.numero)}
             titular={dadosassociado?.nome ?? ''}
                uf={dadosassociado?.uf ?? ''}
        />}

        {printCarne && <ImpressaoCarne
            ref={componentCarne}
          arrayMensalidade={dadosassociado?.mensalidade?.filter(mensalidade => mensalidade.status !== 'P') ?? []}
            dadosAssociado={
                {bairro: dadosassociado?.bairro ?? '',
                    cidade: dadosassociado?.cidade ?? '',
                    endereco: dadosassociado?.endereco ?? '',
                    id_contrato: dadosassociado?.contrato?.id_contrato ?? 0,
                    nome: dadosassociado?.nome ?? '',
                    uf: dadosassociado?.uf ?? '',
                    numero: Number(dadosassociado?.numero),
                    plano: dadosassociado?.contrato?.plano ?? '',
                }
            }
        
        />}

{printResumo && <ContratoResumo
ref={componentResumo}
dados={dadosassociado??{}}
/>}



        </div>
        <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                                    <div className="flex flex-row text-white gap-6 w-full">
                                       <Button size={'sm'} onClick={()=>setPrintContrato(true)}>Contrato</Button>
                                        <Button size={'sm'} onClick={()=>setPrintCarteira(true)}>Carteiras</Button>
                                        <Button size={'sm'} onClick={()=>setPrintCarne(true)}>Carnê</Button>
                                        <Button size={'sm'} onClick={()=>setPrintResumo(true)}>Resumo de Contrato</Button>

                                    </div>

                                </div>

                                </>
    )
}