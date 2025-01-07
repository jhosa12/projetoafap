
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import { ModalBusca } from '../../components/modal'
import React, { useState, useContext, useEffect} from "react";
import { AuthContext } from "../../contexts/AuthContext"
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import 'react-tooltip/dist/react-tooltip.css';
import Head from "next/head";
import CarteirasDep from "../../components/admContrato/carteiras/carteirasDep";
import { HistoricoMensalidade } from "@/components/admContrato/historicoMensalidade/historicoMensalidade";
import ObitosAssociado from "@/components/admContrato/obitos/obitos";
import { Button, Tabs } from "flowbite-react";
import { HiIdentification, HiMiniInbox, HiMiniWallet, HiPrinter, HiUserCircle, HiUserGroup } from "react-icons/hi2";
import { DadosAssociado } from "@/components/admContrato/dadosAssociado/screen";
import { Dependentes } from "@/components/admContrato/dependentes/dependentes";
import { Impressoes } from "@/components/admContrato/impressoes/screen";
import ModalCadastro from "@/components/admContrato/cadastro/modalCadastro";
import { FaHandshake } from "react-icons/fa";
import { AcordosScreen } from "@/components/admContrato/acordos/screen";
import { VerificarSituacao } from "@/utils/admContrato/verificarSituacao";



export default function AdmContrato() {

    const { usuario,data,closeModa,  dadosassociado, carregarDados, permissoes,setarDadosAssociado } = useContext(AuthContext)
    const [indexTab, setIndex] = useState<number>(0)
    const [openCadastro, setCadastro] = useState<boolean>(false)
    const [modalBusca, setModalBusca] = useState<boolean>(false)

  /*  useEffect(() => {
        async function listaCadastro() {
            const response = await api.get('/listarDadosCadastro')
            closeModa({ ...data, cidades: response.data.cidades, planos: response.data.planos })
        }
        listaCadastro()
    }, [])*/




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

        VerificarSituacao(dadosassociado?.contrato?.situacao, dadosassociado?.mensalidade, dadosassociado?.contrato?.convalescencia)


      
    }, [ dadosassociado?.id_global]);




    return (
        <>

            <Head>
                <title>Administrar Contrato</title>

            </Head>
            <div className="flex flex-col w-full mr-2  justify-center">
                {modalBusca && (<ModalBusca visible={modalBusca} setVisible={()=>setModalBusca(false)} />)}
                {openCadastro && (<ModalCadastro onClose={setCadastro} isOpen={openCadastro} />)}

                <div className="flex  flex-col px-4  ">
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 pb-1">
                        <Button theme={{ color: { light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100" } }} size={'sm'} onClick={() => setModalBusca(true)} type="button" color={'light'}>
                            <IoMdSearch size={18} />
                            BUSCAR CLIENTE
                        </Button>
                        <Button size={'sm'} type="button" onClick={() => setCadastro(true)} color={'warning'}>
                        <IoMdAdd size={18} />
                            NOVO ASSOCIADO
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
                                        id_empresa: dadosassociado?.id_empresa ?? '',
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
                                    usuario={{ id: usuario?.id, nome: usuario?.nome ?? '' }}


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