import { useReactToPrint } from "react-to-print"
import OrdemServico from "@/app/dashboard/servicos/_documents/obitos/OrdemServico"
import { useRef, useState } from "react"
import AutTanato from "@/app/dashboard/servicos/_documents/obitos/Tanato"
import { LiaFileContractSolid } from "react-icons/lia"
import { ObitoProps } from "../../_types/obito"






interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
}




interface ArrayProdutoProps {
    id_ob_itens: number | null
    id_produto: number | null,
    id_estoque: number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface DadosProps {
    servico: Partial<ObitoProps>
}



export default function DocumentacaoOS({ servico }: DadosProps) {
    const componentRefOs = useRef<HTMLDivElement>(null);
    const componentRefTanato = useRef<HTMLDivElement>(null)
    const [autorizado, setAutorizado] = useState<boolean>(true)



    const imprimirOS = useReactToPrint({
        contentRef: componentRefOs
    })
    const imprimirTanato = useReactToPrint({
        contentRef:  componentRefTanato
    })
    return (

        <>
            <div className='flex flex-col w-full text-white p-2 gap-6'>


                <button disabled={!servico.id_obitos} type="button" onClick={() => imprimirOS()} className="relative inline-flex ">
                    <span className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><LiaFileContractSolid size={20} /></span>
                    <span className="relative  flex justify-center items-center top-0 start-0 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                        FICHA DE ATENDIMENTO
                    </span>
                </button>
                <div className="inline-flex rounded-lg p-2 border-[1px] border-gray-500 w-fit gap-6">
                    <div className="flex items-center ">
                        <input type="checkbox" checked={autorizado} onClick={() => {
                            setAutorizado(!autorizado)

                        }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">Autorizado</label>
                    </div>

                    <button disabled={!servico.id_obitos} type="button" onClick={() => imprimirTanato()} className="relative inline-flex ">
                        <span className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><LiaFileContractSolid size={20} /></span>
                        <span className="relative  flex justify-center items-center top-0 start-0 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                            AUTORIZAÇÃO TANATOPRAXIA
                        </span>
                    </button>

                </div>

            </div>

            <div style={{ display: 'none' }}>
                <AutTanato
                    autorizado={autorizado}
                    bairro_dec={servico.rd_bairro ?? ''}
                    bairro_falecido={servico.end_bairro ?? ''}
                    cidade_dec={servico.rd_cidade ?? ''}
                    cidade_falecido={servico.end_cidade ?? ''}
                    contrato={Number(servico.id_contrato)}
                    cpf_dec={servico.cpf_cnpj ?? ''}
                    data_nasc_falecido={servico.data_nascimento}
                    endereco_dec={servico.rd_endereco ??''}
                    endereco_falecido={servico.end_rua??''}
                    nome_dec={servico.rd_nome??''}
                    nome_falecido={servico.nome_falecido??''}
                    numero_dec={Number(servico.rd_numero)}
                    numero_falecido={Number(servico.end_numero)}
                    uf_dec={servico.rd_uf??''}
                    uf_falecido={servico.end_uf??''}
                    rg_dec={servico.rd_rg ??''}
                    ref={componentRefTanato}
                />
            </div>
            <div style={{ display: 'none' }}>
                <OrdemServico
                    data={servico}

                    ref={componentRefOs}
                />
            </div>
        </>
    )
}
