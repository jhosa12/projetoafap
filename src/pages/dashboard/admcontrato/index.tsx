
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import { ModalBusca } from '../../../components/modals/modalBusca'
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../store/AuthContext"
import { toast } from "react-toastify";
import { api } from "@/lib/axios/apiClient";
import 'react-tooltip/dist/react-tooltip.css';
import CarteirasDep from "../../../components/tabs/admContrato/carteiras/carteirasDep";
import { HistoricoMensalidade } from "@/components/tabs/admContrato/historicoMensalidade/historicoMensalidade";
import ObitosAssociado from "@/components/tabs/admContrato/obitos/obitos";
import { Modal, Spinner, Tabs } from "flowbite-react";
import { HiIdentification, HiMiniInbox, HiMiniWallet, HiUserCircle, HiUserGroup } from "react-icons/hi2";
import { DadosAssociado } from "@/components/tabs/admContrato/dadosAssociado/screen";
import { Dependentes } from "@/components/tabs/admContrato/dependentes/dependentes";
import ModalCadastro from "@/components/modals/admContrato/cadastro/modalCadastro";
import { FaHandshake } from "react-icons/fa";
import { VerificarSituacao } from "@/utils/admContrato/verificarSituacao";
import { Acordos } from "@/components/tabs/admContrato/acordos/screen";
import { Button } from "@/components/ui/button"
import { AssociadoProps } from "@/types/associado";


export default function AdmContrato() {

    const { usuario, data, closeModa, dadosassociado, carregarDados, permissoes, limparDados, loading, infoEmpresa } = useContext(AuthContext)
    const [indexTab, setIndex] = useState<number>(0)
    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        busca: false,
        cadastro: false
    })

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

      
           
      
        if (dadosassociado?.id_global){
            VerificarSituacao({
                situacao: dadosassociado?.contrato?.situacao ?? '',
                mensalidades: dadosassociado?.mensalidade ?? [],
                convalescencia: dadosassociado?.contrato?.convalescencia ?? [],
                carencia: dadosassociado?.contrato?.dt_carencia ?? null
            })
        }
       
        


    }, [dadosassociado?.id_global]);

    
    useEffect(() => {
        return () => {
            limparDados();
        };
    }, []); 



    return (
        
            <div className={`flex flex-col w-full mr-2  justify-center`}>

            {loading && <Modal size={'sm'} popup show={loading}>
                <Modal.Body>
                    <div className=" flex flex-col pt-6 w-full justify-center items-center">
                        <Spinner size={'lg'} color={'warning'} />
                        <span>Localizando dados....</span>
                    </div>

                </Modal.Body>
            </Modal>
            }
                {modal.busca && (<ModalBusca visible={modal.busca} setVisible={() => setModal({ busca: false })} />)}
                {modal.cadastro && (<ModalCadastro onClose={() => setModal({ cadastro: false })} isOpen={modal.cadastro} />)}


              
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 px-2 pb-1">
                        <Button variant={'outline'} size={'sm'} onClick={() => setModal({ busca: true })} type="button" >
                            <IoMdSearch size={18} />
                            Buscar Cliente
                        </Button>
                        <Button variant={'outline'} size={'sm'} type="button" onClick={() => setModal({ cadastro: true })} >
                            <IoMdAdd size={18} />
                            Novo Associado
                        </Button>

                    </div>
                    <div className="flex-col w-full  rounded-lg   border-gray-700">
                        <Tabs theme={{ base: 'block w-full', tabpanel: 'w-full py-1', tablist: {base:' inline-flex w-full', tabitem: { base: "flex items-center justify-center enabled:text-black rounded-t-lg p-2 text-xs font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 " } } }} aria-label="Tabs with icons" variant="underline" onActiveTabChange={e => setIndex(e)} >

                            <Tabs.Item  active={indexTab === 0} title="Dados Associado" icon={HiUserCircle}>
                                {indexTab === 0 && <DadosAssociado infoEmpresa={infoEmpresa} dadosassociado={dadosassociado ?? {} as Partial<AssociadoProps>} />}
                            </Tabs.Item>

                            <Tabs.Item active={indexTab === 1} disabled={!permissoes.includes('ADM1.2')} title="Histórico/Mensalidade" icon={HiMiniWallet}>
                                {indexTab === 1 && <HistoricoMensalidade
                                    carregarDados={carregarDados}
                                    dados={{ closeModalPlano: data.closeModalPlano ?? false, id_associado: dadosassociado?.id_associado ?? 0, mensalidade: data.mensalidade ?? {}, mensalidadeAnt: data.mensalidadeAnt ?? {} }}
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
                            <Tabs.Item active={indexTab === 2} title="Acordos" icon={FaHandshake}>

                                {indexTab === 2 && <Acordos
                                    id_empresa={dadosassociado?.id_empresa ?? ''}
                                    mensalidades={dadosassociado?.mensalidade?.filter(mensalidade => mensalidade.status !== 'P') ?? []}
                                    acordos={dadosassociado?.acordo ?? []}
                                    id_associado={dadosassociado?.id_associado}
                                    id_contrato={dadosassociado?.contrato?.id_contrato}
                                    id_contrato_global={dadosassociado?.contrato?.id_contrato_global}
                                    id_global={dadosassociado?.id_global}
                                    usuario={{ id: usuario?.id ?? '', nome: usuario?.nome ?? '' }}
                                />}

                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 3} disabled={!permissoes.includes('ADM1.3')} title="Dependentes" icon={HiUserGroup
                            }>
                                {indexTab === 3 && <Dependentes />}
                            </Tabs.Item>
                            <Tabs.Item active={indexTab === 4} title="Carteiras" icon={HiIdentification}>
                                {indexTab === 4 && <CarteirasDep
                                    adesao={dadosassociado?.contrato?.dt_adesao ?? new Date()}
                                    cpf={dadosassociado?.cpfcnpj ?? ''}
                                    rg={dadosassociado?.rg ?? ''}
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
                
                    </div>
                </div>
         
      
    )
}




/*export const getServerSideProps = canSRRAuth(async (ctx) => {
    return {
        props: {}
    }
})*/