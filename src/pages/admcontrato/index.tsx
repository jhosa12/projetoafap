
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
import {  Modal, Spinner, Tabs } from "flowbite-react";
import { HiIdentification, HiMiniInbox, HiMiniWallet, HiPrinter, HiUserCircle, HiUserGroup } from "react-icons/hi2";
import { DadosAssociado } from "@/components/admContrato/dadosAssociado/screen";
import { Dependentes } from "@/components/admContrato/dependentes/dependentes";
import ModalCadastro from "@/components/admContrato/cadastro/modalCadastro";
import { FaHandshake } from "react-icons/fa";
import { VerificarSituacao } from "@/utils/admContrato/verificarSituacao";
import { Acordos } from "@/components/admContrato/acordos/screen";
import { Button } from "@/components/ui/button"


export default function AdmContrato() {

    const { usuario,data,closeModa,  dadosassociado, carregarDados, permissoes,limparDados,loading,infoEmpresa } = useContext(AuthContext)
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
useEffect(() => {
    limparDados()
},[])



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

      
      if(dadosassociado?.id_global)
        VerificarSituacao({
            situacao:dadosassociado?.contrato?.situacao??'',
            mensalidades:dadosassociado?.mensalidade??[], 
            convalescencia:dadosassociado?.contrato?.convalescencia??[],
            carencia:dadosassociado?.contrato?.dt_carencia??null
        })


      
    }, [ dadosassociado?.id_global]);




    return (
        <>
     
        {loading &&    <Modal size={'sm'} popup show={loading}>
                <Modal.Body>
                    <div className=" flex flex-col pt-6 w-full justify-center items-center">
                    <Spinner size={'lg'} color={'warning'}/>
                    <span>Localizando dados....</span>
                    </div>
                   
                </Modal.Body>
            </Modal>
            }
            <Head>
                <title>Administrar Contrato</title>

            </Head>
            <div className={`flex flex-col w-full mr-2  justify-center`}>
                {modalBusca && (<ModalBusca visible={modalBusca} setVisible={()=>setModalBusca(false)} />)}
                {openCadastro && (<ModalCadastro onClose={setCadastro} isOpen={openCadastro} />)}
              
                <div className="flex  flex-col px-4  ">
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 pb-1">
                        <Button variant={'outline'} size={'sm'} onClick={() => setModalBusca(true)} type="button" >
                            <IoMdSearch size={18} />
                            Buscar Cliente
                        </Button>
                        <Button variant={'outline'} size={'sm'} type="button" onClick={() => setCadastro(true)} >
                        <IoMdAdd size={18} />
                            Novo Associado
                        </Button>
                    </div>
                    <div className="flex-col w-full   rounded-lg   border-gray-700">
                        <Tabs theme={{ base: 'bg-white rounded-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-165px)] py-1', tablist: { tabitem: { base: "flex items-center justify-center enabled:text-black rounded-t-lg p-4 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 " } } }} aria-label="Tabs with icons" variant="underline" onActiveTabChange={e => setIndex(e)} >

                            <Tabs.Item  active={indexTab === 0} title="Dados Associado" icon={HiUserCircle}>
                                {indexTab === 0 && <DadosAssociado infoEmpresa={infoEmpresa} dadosassociado={dadosassociado ?? {}} />}
                            </Tabs.Item>

                            <Tabs.Item active={indexTab === 1} disabled={!permissoes.includes('ADM1.2')} title="Histórico/Mensalidade" icon={HiMiniWallet}>
                                {indexTab === 1 && <HistoricoMensalidade
                                    carregarDados={carregarDados}
                                    dados={{  closeModalPlano: data.closeModalPlano ?? false, id_associado: dadosassociado?.id_associado ?? 0, mensalidade: data.mensalidade ?? {}, mensalidadeAnt: data.mensalidadeAnt ?? {} }}
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
                                        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade ?? 0,
                                        situacao: dadosassociado?.contrato?.situacao ?? '',
                                    }}
                                    setarDados={closeModa}
                                    usuario={{ id: usuario?.id, nome: usuario?.nome ?? '' }}
                                />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 2}  title="Acordos" icon={FaHandshake}>

                               {indexTab===2 && <Acordos 
                               id_empresa={dadosassociado?.id_empresa??''}
                               mensalidades={dadosassociado?.mensalidade?.filter(mensalidade=>mensalidade.status!=='P')??[]} 
                               acordos={dadosassociado?.acordo??[]}
                               id_associado={dadosassociado?.id_associado}
                               id_contrato={dadosassociado?.contrato?.id_contrato}
                               id_contrato_global={dadosassociado?.contrato?.id_contrato_global}
                               id_global={dadosassociado?.id_global}
                              usuario={{id:usuario?.id??'',nome:usuario?.nome??''}}
                               />}

                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 3} disabled={!permissoes.includes('ADM1.3')} title="Dependentes" icon={HiUserGroup
                            }>
                                {indexTab === 3 && <Dependentes />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 4} title="Carteiras" icon={HiIdentification}>
                                {indexTab === 4 && <CarteirasDep
                                    adesao={dadosassociado?.contrato?.dt_adesao??new Date()}
                                    cpf={dadosassociado?.cpfcnpj??''}
                                    rg={dadosassociado?.rg??''}
                                    infoEmpresa={infoEmpresa}
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
                            <Tabs.Item active={indexTab === 5} disabled={!permissoes.includes('ADM1.5')} title="Óbitos" icon={HiMiniInbox
                            }>
                                {indexTab === 5 && <ObitosAssociado
                                    obitos={dadosassociado?.contrato?.obitos ?? []}
                                />}
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