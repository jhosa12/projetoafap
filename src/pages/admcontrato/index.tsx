
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import { ModalBusca } from '../../components/modal'

import React, { useState, useContext, useEffect, useRef } from "react";
import { RiFileAddLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext"
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import 'react-tooltip/dist/react-tooltip.css';
import Head from "next/head";
import CarteirasDep from "../../components/admContrato/carteiras/carteirasDep";
import { HistoricoMensalidade } from "@/components/admContrato/historicoMensalidade/historicoMensalidade";
import ObitosAssociado from "@/components/admContrato/obitos/obitos";
import { Button, Tabs } from "flowbite-react";
import { HiIdentification, HiMiniInbox, HiMiniWallet, HiOutlineUserGroup, HiPrinter, HiUserCircle, HiUserGroup } from "react-icons/hi2";
import { DadosAssociado } from "@/components/admContrato/dadosAssociado/screen";
import { Dependentes } from "@/components/admContrato/dependentes/dependentes";
import { Impressoes } from "@/components/admContrato/impressoes/screen";
import ModalCadastro from "@/components/admContrato/cadastro/modalCadastro";
import { HiClipboardList } from "react-icons/hi";
import { FaHandshake } from "react-icons/fa";
import { AcordosScreen } from "@/components/admContrato/acordos/screen";








interface CidadesProps {
    id_cidade: number,
    estado: number,
    uf: string,
    cidade: string
}
interface PlanosProps {
    id_plano: number,
    descricao: string,
    valor: number
}


interface MensalidadeProps {
    id_acordo: number,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number
}


interface ConvProps {
    editar: boolean
    id_conv: number | null,
    id_contrato: number | null,
    id_associado: number | null,
    id_dependente: number | null,
    id_contrato_st: string,
    tipo_entrada: string,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number | null,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number | null,
    descontos: number | null,
    total: number | null,
    logradouro_r: string,
    numero_r: number | null,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string,
    convalescenca_prod: Array<Partial<{
        id_conv: number,
        id_produto: number,
        descricao: string,
        unidade: string,
        grupo: string,
        data: Date,
        data_dev: Date,
        quantidade: number,
        valor: number,
        descontos: number,
        total: number,
        hora: Date,
        cortesia: string,
        retornavel: string,
        status: string
    }>>,
    contrato: {
        situacao: string,
        carencia: string,
        associado: {
            nome: string
        }

    }

}

interface ContratoProps {
    id_contrato: number,
    plano: string,
    id_plano: number,
    valor_mensalidade: number,
    dt_adesao: Date,
    dt_carencia: Date,
    situacao: string,
    anotacoes: string,
    consultor: string,
    cobrador: string,
    data_vencimento: Date,
    n_parcelas: number,
    origem: string,
    supervisor: string,
    convalescencia: Array<ConvProps>,
    categoria_inativo: string,
    motivo_inativo: string,
    dt_cancelamento: true,
}
interface AcordoProps {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}

interface DependentesProps {
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
    convalescenca: {
        convalescenca_prod: Partial<{
            id_conv: number,
            id_produto: number,
            descricao: string,
            unidade: string,
            grupo: string,
            data: Date,
            data_dev: Date,
            quantidade: number,
            valor: number,
            descontos: number,
            total: number,
            hora: Date,
            cortesia: string,
            retornavel: string,
            status: string
        }>,
    }
}

interface AssociadoProps {
    nome: string,
    data_nasc: Date,
    sexo: string,
    celular1: string, celular2: string, telefone: string,
    id_associado: number,
    endereco: string,
    bairro: string,
    numero: number,
    cidade: string,
    cep: string,
    cpf: string, rg: string
    email: string,
    profissao: string,
    guia_rua: string,
    uf: string,
    mensalidade: Array<MensalidadeProps>,
    contrato: ContratoProps,
    dependentes: Array<DependentesProps>
    acordo: Array<AcordoProps>

}





export default function AdmContrato() {

    const { usuario, data, closeModa, dadosassociado, carregarDados, permissoes } = useContext(AuthContext)
    const [indexTab, setIndex] = useState<number>(0)
    const [openCadastro, setCadastro] = useState<boolean>(false)





















    useEffect(() => {
        async function listaCadastro() {
            const response = await api.get('/listarDadosCadastro')
            closeModa({ ...data, cidades: response.data.cidades, planos: response.data.planos })
        }
        listaCadastro()
    }, [])


    async function atualizarObs() {
        try {
            const response = await toast.promise(
                api.put('/atualizarObservacao', {
                    id_contrato: dadosassociado?.contrato?.id_contrato,
                    anotacoes: data.contrato?.anotacoes?.toUpperCase()
                }),
                {
                    error: 'Erro ao adicionar Observação',
                    pending: 'Adicionando Observação',
                    success: 'Observação inserida com sucesso'
                }

            )

            //  await carregarDados()

        } catch (err) {
            console.log(err)
        }


    }



    useEffect(() => {

        if (dadosassociado?.contrato?.situacao === 'INATIVO') {
            toast.error('CONTRATO INATIVO');
        }
        let x = 0;

        Array.isArray(dadosassociado?.mensalidade) &&  dadosassociado?.mensalidade?.map((item, index) => {
            new Date() >= new Date(item.vencimento) && item.status === 'A' || item.status === 'E' ? (x = x + 1) : '';
        });
        if (x > 1) {
            toast.warn(`Possui ${x} mensalidades Vencidas`);
        }

        if (dadosassociado?.contrato?.convalescencia.find(item => item.status === 'ABERTO')) {

            toast.info('Possui Material Convalescente!')
        }


        // Marcar o componente como desmontado quando ele for desmontado
    }, [dadosassociado?.contrato?.situacao, dadosassociado?.mensalidade]);




    return (
        <>

            <Head>
                <title>Administrar Contrato</title>

            </Head>
            <div className="flex flex-col w-full mr-2  justify-center">
                {data.closeModalPlano && (<ModalBusca />)}
                {openCadastro && (<ModalCadastro onClose={setCadastro} isOpen={openCadastro} />)}

                <div className="flex  flex-col px-4  ">
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 pb-1">
                        <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100" } }} size={'xs'} onClick={() => closeModa({ closeModalPlano: true, mensalidade: {} })} type="button" color={'light'}>
                            <IoMdSearch size={15} />
                            BUSCAR CLIENTE
                        </Button>
                        <Button size={'xs'} type="button" onClick={() => setCadastro(true)} color={'warning'}>
                            NOVO ASSOCIADO
                            <RiFileAddLine size={15} />
                        </Button>
                    </div>
                    <div className="flex-col w-full border  rounded-lg shadow  border-gray-700">
                        <Tabs theme={{ base: 'bg-white rounded-lg', tablist: { tabitem: { base: "flex items-center justify-center enabled:text-black rounded-t-lg p-4 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 " } } }} aria-label="Tabs with icons" variant="underline" onActiveTabChange={e => setIndex(e)} >

                            <Tabs.Item  active={indexTab === 0} title="DADOS ASSOCIADO" icon={HiUserCircle}>
                                {indexTab === 0 && <DadosAssociado dadosassociado={dadosassociado ?? {}} />}
                            </Tabs.Item>

                            <Tabs.Item active={indexTab === 1} disabled={!permissoes.includes('ADM1.2')} title="HISTÓRICO/MENSALIDADE" icon={HiMiniWallet}>
                                {<HistoricoMensalidade
                                    carregarDados={carregarDados}
                                    dados={{ acordo: data.acordo ?? {}, closeModalPlano: data.closeModalPlano ?? false, id_associado: dadosassociado?.id_associado ?? 0, mensalidade: data.mensalidade ?? {}, mensalidadeAnt: data.mensalidadeAnt ?? {} }}
                                    dadosAssociado={{
                                        nome: dadosassociado?.nome ?? '',
                                        id_contrato_global: dadosassociado?.contrato?.id_contrato_global ?? null,
                                        id_global: dadosassociado?.id_global ?? null,
                                        endereco: dadosassociado?.endereco ?? '',
                                        bairro: dadosassociado?.bairro ?? '',
                                        cidade: dadosassociado?.cidade ?? '',
                                        plano: dadosassociado?.contrato?.plano ?? '',
                                        numero: Number(dadosassociado?.numero),
                                        uf: dadosassociado?.uf ?? '',
                                        arrayAcordo: dadosassociado?.acordo ?? [],
                                        arrayMensalidade: dadosassociado?.mensalidade ?? [],
                                        id_associado: dadosassociado?.id_associado ?? 0,
                                        id_contrato: dadosassociado?.contrato?.id_contrato ?? 0,
                                        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade ?? 0
                                    }}
                                    setarDados={closeModa}
                                    usuario={{ id: Number(usuario?.id), nome: usuario?.nome ?? '' }}


                                />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 2}  title="ACORDOS" icon={FaHandshake}>

                                <AcordosScreen/>

                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 3} disabled={!permissoes.includes('ADM1.3')} title="DEPENDENTES" icon={HiUserGroup
                            }>
                                {indexTab === 3 && <Dependentes />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 4} title="CARTEIRAS" icon={HiIdentification}>
                                {indexTab === 4 && <CarteirasDep
                                    titular={dadosassociado?.nome ?? ''}
                                    dependentes={dadosassociado?.dependentes ?? []}
                                    contrato={dadosassociado?.contrato?.id_contrato ?? 0}
                                    plano={dadosassociado?.contrato?.plano ?? ''}
                                    bairro={dadosassociado?.bairro ?? ''}
                                    celular={dadosassociado?.celular1 ?? ''}
                                    cidade={dadosassociado?.cidade ?? ''}
                                    endereco={dadosassociado?.endereco ?? ''}
                                    numero={dadosassociado?.numero ?? null}
                                    uf={dadosassociado?.uf ?? ''}
                                />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 5} disabled={!permissoes.includes('ADM1.5')} title="ÓBITOS" icon={HiMiniInbox
                            }>
                                {indexTab === 5 && <ObitosAssociado
                                    obitos={dadosassociado?.contrato?.obitos ?? []}
                                />}
                            </Tabs.Item>

                            <Tabs.Item active={indexTab === 6} title="IMPRESSÕES" icon={HiPrinter
                            }>
                                {indexTab === 6 && <Impressoes />}
                            </Tabs.Item>


                        </Tabs>
                        <div className="flex flex-col">



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}




/*export const getServerSideProps = canSRRAuth(async (ctx) => {
    return {
        props: {}
    }
})*/