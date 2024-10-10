import { AuthContext } from "@/contexts/AuthContext";
import PrintButtonCarne from "@/Documents/carne/PrintButton";
import DocumentTemplate from "@/Documents/contratoAdesão/DocumentTemplate";
import Carteiras from "@/Documents/carteiraAssociado/DocumentTemplate";
import { Button } from "flowbite-react";
import { useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";



export function Impressoes() {
    const { dadosassociado } = useContext(AuthContext)
    const componentContrato = useRef<DocumentTemplate>(null)
    const componentCarteira = useRef<Carteiras>(null)




    
    const imprimirContrato =useReactToPrint({
        pageStyle: `
            @page {
                margin: 1rem;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                @page {
                    size: auto;
                    margin: 1rem;
                }
                @page {
                    @top-center {
                        content: none;
                    }
                    @bottom-center {
                        content: none;
                    }
                }
            }
        `,
        documentTitle:'CONTRATO ASSOCIADO',
        content:()=>componentContrato.current

   })


   const imprimirCarteira =useReactToPrint({
    pageStyle: `
        @page {
            margin: 1rem;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            @page {
                size: auto;
                margin: 1rem;
            }
            @page {
                @top-center {
                    content: none;
                }
                @bottom-center {
                    content: none;
                }
            }
        }
    `,
    documentTitle:'CONTRATO ASSOCIADO',
    content:()=>componentCarteira.current

})

    return (
        <>
        <div style={{ display: 'none' }}>
            <DocumentTemplate
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
            
        ref={componentContrato} />

        <Carteiras
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
        />
        </div>
        <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                                    <div className="flex flex-row text-white gap-6 w-full">
                                       <Button size={'sm'} onClick={imprimirContrato}>Contrato</Button>
                                        <Button size={'sm'} onClick={imprimirCarteira}>Carteiras</Button>
                                        <PrintButtonCarne
                                            arrayMensalidade={dadosassociado?.mensalidade ?? []}
                                            dadosAssociado={{
                                                nome: dadosassociado?.nome ?? '',
                                                bairro: dadosassociado?.bairro ?? '',
                                                cidade: dadosassociado?.cidade ?? '',
                                                endereco: dadosassociado?.endereco ?? '',
                                                id_contrato: Number(dadosassociado?.contrato?.id_contrato),
                                                numero: Number(dadosassociado?.numero),
                                                plano: dadosassociado?.contrato?.plano ?? '',
                                                uf: dadosassociado?.uf ?? ''
                                            }}


                                        />

                                    </div>

                                </div>

                                </>
    )
}