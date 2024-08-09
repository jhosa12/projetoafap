import { IoIosClose } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import { ModalBusca } from '../../components/modal'
import Teste from '@/pages/teste/index';
import React, { useState, useContext, useEffect, useRef } from "react";
import { RiFileAddLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthContext"
import { toast } from "react-toastify";
import { ModalMensalidade } from "@/components/modalmensalidade";
import { RiAddCircleFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { api } from "@/services/apiClient";
import { TbAlertTriangle } from "react-icons/tb";
import { ModalDependentes } from "@/components/modalDependentes";
import { FaEdit } from "react-icons/fa";
import { ModalEditarDados } from "@/components/modalEditarDados";
import { Tooltip } from 'react-tooltip';
import { BiSave } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import 'react-tooltip/dist/react-tooltip.css';
import { ModalAcordos } from "@/components/modalAcordos";
import { FaHandshake } from "react-icons/fa";
import { canSRRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import PrintButtonContrato from "@/Documents/contratoAdesão/PrintButton";
import { TbWheelchair } from "react-icons/tb";
import PrintButton from "@/Documents/carteiraAssociado/PrintButton";
import CarteirasDep from "../../components/admContrato/carteirasDep";
import { IoPrint } from "react-icons/io5";
import { HistoricoMensalidade } from "@/components/admContrato/historicoMensalidade/historicoMensalidade";
import PrintButtonCarne from "@/Documents/carne/PrintButton";
import ObitosAssociado from "@/components/admContrato/obitos/obitos";




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
    close: boolean,
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

    const { usuario, data, closeModa, dadosassociado, carregarDados } = useContext(AuthContext)
    const [indexTab, setIndex] = useState<number>(2)
    const [checkDependente, setCheckDependente] = useState(false)
    const [excluirDependente, setExcluirDependente] = useState(false)
    const [openEdit, setOpenEdit] = useState<number>(0)
    const [observacao, setObservacao] = useState('');
    const [verObs, setVerObs] = useState(false)
    const [componenteMounted, setMounted] = useState(false)
    //   const [mensalidadeComGrupoE, setMensalidaGrupo] = useState<Array<MensalidadeProps>>([]);








    const limparDadosCadastro = () => {
        closeModa({
            closeModalCadastro: true,
            acordo: undefined,
            arraydep: [],
            bairro: undefined,
            celular1: undefined,
            celular2: undefined,
            cep: undefined,
            cidade: undefined,
            closeEditarAssociado: undefined,
            closeModalPlano: undefined,
            contrato: undefined,
            cpf: undefined,
            dependente: undefined,
            email: undefined,
            empresa: undefined,
            endereco: undefined,
            id_associado: undefined,
            mensalidade: undefined,
            mensalidadeAnt: undefined,
            mensalidadeProx: undefined,
            name: undefined,
            nasc: undefined,
            naturalidade: undefined,
            numero: undefined,
            origem: undefined,
            profissao: undefined,
            referencia: undefined,
            rg: undefined,
            sexo: undefined,
            telefone: undefined,
            uf: undefined
        })
    }

    function handleObservacao() {

        const novaObservacao = observacao.trim(); // Remove espaços em branco

        if (novaObservacao !== '') {
            const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
            closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
            setObservacao('')
        }
    }



    useEffect(() => {



        async function listaCadastro() {
            const response = await api.get('/listarDadosCadastro')
            closeModa({ ...data, cidades: response.data.cidades, planos: response.data.planos })

        }

        listaCadastro()
        closeModa({ ...data, acordo: { ...{} } })
        if (componenteMounted) { atualizarObs() }
        setMounted(true)
    }, [data.contrato?.anotacoes])
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

            await carregarDados()

        } catch (err) {
            console.log(err)
        }


    }
    function mensalidadeSet() {
        setIndex(2)
    }
    useEffect(() => {


        const carregarDadosAsync = async () => {
            try {
                if(data.id_associado){
                    await carregarDados();
                    setVerObs(false)
                }else return;
               
                // closeModa({contrato:{},dependente:{}})
                

            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }

        };
        componenteMounted && carregarDadosAsync();

        closeModa({ ...data, closeModalPlano: false })

        setIndex(2)



    }, [data.id_associado]);







    useEffect(() => {

        if (dadosassociado?.contrato?.situacao === 'INATIVO') {
            toast.error('CONTRATO INATIVO');
        }
        let x = 0;

        dadosassociado?.mensalidade?.map((item, index) => {
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



    async function excluirDep() {
        if (data.dependente?.excluido) {
            toast.info("Dependente ja excluido")
            return;
        }
        if (!data.dependente?.id_dependente) {
            toast.info("Selecione um dependente!")
            return;
        }
        if (!data.dependente?.exclusao_motivo) {
            toast.warning("Informe um motivo!")
            return;
        }
        try {
            await toast.promise(
                api.put('/excluirDependente', {
                    id_dependente: Number(data.dependente?.id_dependente),
                    excluido: true,
                    user_exclusao: usuario?.nome,
                    exclusao_motivo: data.dependente.exclusao_motivo
                }),
                {
                    pending: `Efetuando`,
                    success: `Dependente Exluido`,
                    error: `Erro ao Excluir`
                }
            )

            await carregarDados()
            setExcluirDependente(false)
            closeModa({ dependente: { close: false } })

        } catch (err) {
            console.log(err)
        }


    }

    return (
        <>

            <Head>
                <title>Administrar Contrato</title>

            </Head>
            <div className="flex flex-col w-full mr-2  justify-center">
                {data.closeModalPlano && (<ModalBusca />)}
                {data.closeModalCadastro && (<Teste />)}
                {data.mensalidade?.close && (<ModalMensalidade />)}
                {data.dependente?.close && <ModalDependentes />}
                {data.closeEditarAssociado && <ModalEditarDados openEdit={openEdit} />}


                <div className="flex  flex-col p-4  ">
                    <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 pb-1">
                        <button onClick={() => closeModa({ closeModalPlano: true, mensalidade: {} })} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                            <IoMdSearch size={20} />
                            Buscar Cliente
                        </button>
                        <button type="button" onClick={limparDadosCadastro} className="text-white gap-1  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center bg-[#c5942b] hover:bg-[#c5942ba9] focus:ring-blue-800">
                            Add Plano
                            <RiFileAddLine size={20} />
                        </button>


                    </div>
                    <div className="flex-col w-full border  rounded-lg shadow  border-gray-700">
                        <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">
                            <li className="me-2">
                                <button type="button" onClick={() => { setIndex(1) }} className={`inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 ${indexTab === 1 && "text-blue-500"} `}>Dados</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setIndex(2)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${indexTab === 2 && "text-blue-500"}`}>Histórico/Movimentação</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setIndex(3)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${indexTab === 3 && "text-blue-500"}`}>Dependentes</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setIndex(4)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${indexTab === 4 && "text-blue-500"}`}>Carteiras</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setIndex(5)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${indexTab === 5 && "text-blue-500"}`}>Óbitos</button>
                            </li>
                            <li className="me-2">
                                <button type="button" onClick={() => setIndex(6)} className={`inline-block p-4  hover:bg-gray-700 hover:text-gray-300 ${indexTab === 6 && "text-blue-500"}`}>Documentos</button>
                            </li>
                        </ul>
                        <div className="flex flex-col">

                            {indexTab === 1 && dadosassociado && (<div className={`p-4  rounded-lg md:p-8`}>

                                <h2 className="inline-flex gap-3 mb-3 text-xl font-extrabold tracking-tight text-white">
                                    {dadosassociado?.contrato?.id_contrato}-{dadosassociado?.nome}
                                    <span>PLANO:

                                        <span className="pl-3 text-[#c5942b]">{dadosassociado?.contrato?.plano}</span>
                                    </span>

                                    <span className={`inline-flex items-center  text-sm font-medium px-2.5 py-0.5 rounded-full ${dadosassociado?.contrato?.situacao === 'ATIVO' ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                                        <span className={`w-2 h-2 me-1 ${dadosassociado?.contrato?.situacao === 'ATIVO' ? "bg-green-500 " : "bg-red-500"}  rounded-full`}></span>
                                        {dadosassociado?.contrato?.situacao}
                                    </span>

                                    {dadosassociado?.contrato?.convalescencia?.map(item => (
                                        <>
                                            {item.convalescenca_prod.map((dados, index) => (!item.id_dependente || item.id_dependente === null) && item.status === 'ABERTO' && <button data-tooltip-id="my-tooltip" data-tooltip-content={dados?.descricao ?? ''} className="text-yellow-500">
                                                <TbWheelchair size={20} />
                                            </button>)}
                                        </>
                                    ))}

                                </h2>
                                <div className="flex w-full flex-row gap-2">

                                    <div className="flex relative flex-col w-1/2  p-4 text-sm  border  rounded-lg shadow bg-gray-800 border-gray-700">
                                        <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO TITULAR </h2>

                                        <h5 className="mb-1 inline-flex justify-between text-sm gap-2 font-semibold tracking-tight  text-white">
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ENDEREÇO: </span>{dadosassociado?.endereco}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">Nº: </span>{dadosassociado?.numero}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">BAIRRO: </span>{dadosassociado?.bairro}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CIDADE: </span>{dadosassociado?.cidade}</p>
                                        </h5>
                                        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">PONTO REF: </span>{dadosassociado?.guia_rua}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CELULAR1: </span>{dadosassociado?.celular1}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CELULAR2: </span>{dadosassociado?.celular2}</p>

                                        </h5>

                                        <button data-tooltip-id="my-tooltip"

                                            data-tooltip-content="Editar Dados do Cliente/Contrato" onClick={() => {


                                                const alt = usuario?.permissoes?.find(item => item.nome === 'ALTERAR DADOS TITULAR');
                                                if (alt?.val === false) {
                                                    toast.info('NÃO AUTORIZADO')
                                                    return;
                                                }



                                                setOpenEdit(1), closeModa({
                                                    closeEditarAssociado: true,
                                                    name: dadosassociado.nome,
                                                    nasc: dadosassociado.data_nasc && new Date(dadosassociado?.data_nasc),
                                                    bairro: dadosassociado.bairro,
                                                    celular1: dadosassociado.celular1,
                                                    celular2: dadosassociado.celular2,
                                                    telefone: dadosassociado.telefone,
                                                    cidade: dadosassociado.cidade,
                                                    cep: dadosassociado.cep,
                                                    cpf: dadosassociado.cpf,
                                                    endereco: dadosassociado.endereco,
                                                    email: dadosassociado.email,
                                                    id_associado: dadosassociado.id_associado,
                                                    contrato: {
                                                        id_contrato: dadosassociado?.contrato?.id_contrato,
                                                        cobrador: dadosassociado?.contrato?.cobrador,
                                                        consultor: dadosassociado?.contrato?.consultor,
                                                        data_vencimento: dadosassociado?.contrato?.data_vencimento,
                                                        dt_adesao: dadosassociado?.contrato?.dt_adesao,
                                                        dt_carencia: dadosassociado?.contrato?.dt_carencia,
                                                        id_plano: dadosassociado?.contrato?.id_plano,
                                                        origem: dadosassociado?.contrato?.origem,
                                                        plano: dadosassociado?.contrato?.plano,
                                                        situacao: dadosassociado?.contrato?.situacao,
                                                        supervisor: dadosassociado?.contrato?.supervisor,
                                                        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade
                                                    },
                                                    //  planos:usuario?.planos,
                                                    // cidades:usuario?.cidades,
                                                    numero: dadosassociado.numero,
                                                    profissao: dadosassociado.profissao,
                                                    rg: dadosassociado.rg,
                                                    referencia: dadosassociado.guia_rua,
                                                    uf: dadosassociado.uf
                                                })
                                            }} className="absolute -right-1 -top-1 text-blue-400 "><FaEdit size={16} /></button>
                                        <Tooltip className="z-30" id="my-tooltip" />
                                    </div>
                                    <div className="flex relative  w-1/2 text-white flex-col p-4 text-sm border  rounded-lg shadow bg-gray-800 border-gray-700">
                                        <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO PLANO</h2>

                                        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">

                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CATEGORIA: </span>{dadosassociado?.contrato?.plano}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">VALOR: </span>R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ADESÃO: </span> {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado?.contrato?.dt_adesao).toLocaleDateString()}</p>
                                            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CARÊNCIA: </span>{dadosassociado.contrato?.dt_carencia && new Date(dadosassociado?.contrato?.dt_carencia).toLocaleDateString()}</p>
                                        </h5>
                                        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
                                            <p className=" font-normal text-gray-400"><span className="text-white font-semibold">ORIGEM: </span>{dadosassociado?.contrato?.origem}</p>
                                            <p className=" font-normal text-red-600"><span className="text-white font-semibold">CONSULTOR: </span>{dadosassociado?.contrato?.consultor}</p>
                                            <p className=" font-normal text-red-600"><span className="text-white font-semibold">COBRADOR: </span>{dadosassociado?.contrato?.cobrador}</p>
                                        </h5>

                                        <button data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Editar Dados do Cliente/Contrato" onClick={() => {
                                                setOpenEdit(2), closeModa({
                                                    closeEditarAssociado: true,
                                                    name: dadosassociado.nome,
                                                    nasc: dadosassociado.data_nasc && new Date(dadosassociado.data_nasc),
                                                    bairro: dadosassociado.bairro,
                                                    celular1: dadosassociado.celular1,
                                                    celular2: dadosassociado.celular2,
                                                    telefone: dadosassociado.telefone,
                                                    cidade: dadosassociado.cidade,
                                                    cep: dadosassociado.cep,
                                                    cpf: dadosassociado.cpf,
                                                    endereco: dadosassociado.endereco,
                                                    email: dadosassociado.email,
                                                    id_associado: dadosassociado.id_associado,
                                                    contrato: {
                                                        id_contrato: dadosassociado?.contrato?.id_contrato,
                                                        cobrador: dadosassociado?.contrato?.cobrador,
                                                        consultor: dadosassociado?.contrato?.consultor,
                                                        data_vencimento: dadosassociado?.contrato?.data_vencimento,
                                                        dt_adesao: dadosassociado?.contrato?.dt_adesao,
                                                        dt_carencia: dadosassociado?.contrato?.dt_carencia,
                                                        id_plano: dadosassociado?.contrato?.id_plano,
                                                        origem: dadosassociado?.contrato?.origem,
                                                        plano: dadosassociado?.contrato?.plano,
                                                        situacao: dadosassociado?.contrato?.situacao,
                                                        supervisor: dadosassociado?.contrato?.supervisor,
                                                        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade
                                                    },

                                                    numero: dadosassociado.numero,
                                                    profissao: dadosassociado.profissao,
                                                    rg: dadosassociado.rg,
                                                    referencia: dadosassociado.guia_rua,
                                                    uf: dadosassociado.uf
                                                })
                                            }} className="absolute -right-1 -top-1  text-blue-400"><FaEdit size={16} /></button>
                                    </div>
                                </div>

                                <div>
                                    <div className="w-full  mt-2 border  rounded-lg  bg-gray-700 border-gray-600">
                                        <div className="flex gap-2 items-center justify-end px-2 py-1 border-b border-gray-600">
                                            <button onClick={() => setVerObs(!verObs)} type="button" className="inline-flex items-center py-1 px-2  text-center text-white 0 rounded-lg  hover:bg-blue-800">
                                                {verObs ? <IoMdEye data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Ocultar Observações" size={20} /> : <IoMdEyeOff data-tooltip-id="my-tooltip"
                                                        data-tooltip-content="Visualizar Observações" size={20} />}
                                            </button>

                                            <input value={observacao ?? ''} onChange={e => setObservacao(e.target.value ?? '')} placeholder="Digite aqui todas as observações em relação ao plano" type="text" className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                                            <button onClick={() => handleObservacao()} type="button" className="inline-flex items-center py-1 px-2  text-center text-white bg-blue-700 rounded-lg  hover:bg-blue-800">
                                                <BiSave size={22} />
                                            </button>

                                        </div>
                                        <div className="px-4 py-2 rounded-b-lg bg-gray-800">

                                            <textarea value={verObs ? dadosassociado.contrato?.anotacoes : ''} disabled rows={4} className="w-full px-0 text-sm pl-2  border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            )}

                            {indexTab === 2 && (<HistoricoMensalidade
                                carregarDados={carregarDados}
                                dados={{ acordo: data.acordo ?? {}, closeModalPlano: data.closeModalPlano ?? false, id_associado: dadosassociado?.id_associado ?? 0, mensalidade: data.mensalidade ?? {}, mensalidadeAnt: data.mensalidadeAnt ?? {} }}
                                dadosAssociado={{
                                    nome: dadosassociado?.nome ?? '',
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


                            />)}
                            {indexTab === 3 && (<div className="flex flex-col rounded-lg  max-h-[calc(100vh-200px)]  max-w-[calc(100vw-350px)]  p-4 shadow-md sm:rounded-lg">
                                <div className="flex w-full mb-2 gap-2">
                                    <label className="relative inline-flex w-[150px] justify-center  items-center mb-1 cursor-pointer">
                                        <input checked={checkDependente} onChange={() => setCheckDependente(!checkDependente)} type="checkbox" value="2" className="sr-only peer" />
                                        <div className="w-9 h-5 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[9px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>

                                        <Tooltip className="z-30" id="id_dependente" />

                                        <span className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">Exibir Excluidos</span>
                                    </label>
                                    <div className="inline-flex rounded-md shadow-sm mb-1" role="group" >
                                        <button onClick={() => closeModa({ dependente: { close: true, saveAdd: false } })} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                                            <RiAddCircleFill size={20} />
                                            Adicionar
                                        </button>
                                        <button type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                                            Settings
                                        </button>
                                        <button onClick={() => setExcluirDependente(!excluirDependente)} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                                            <MdDeleteForever size={20} />
                                            Excluir
                                        </button>
                                        {excluirDependente ? (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                            <div className="flex items-center justify-center p-2 w-full h-full">
                                                <div className="relative rounded-lg shadow bg-gray-800">
                                                    <button type="button" onClick={() => setExcluirDependente(!excluirDependente)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                                        <button type="button" onClick={() => closeModa({ closeModalPlano: false })} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                                            <IoIosClose size={30} />
                                                        </button>
                                                    </button>
                                                    <div className="p-4 md:p-5 text-center">
                                                        <div className="flex w-full justify-center items-center">
                                                            <TbAlertTriangle className='text-gray-400' size={60} />
                                                        </div>
                                                        <h3 className="mb-3 text-lg font-normal  text-gray-400">{`Realmente deseja deletar ${data.dependente?.nome} ?`}</h3>
                                                        <input placeholder="Informe o motivo da exclusão" autoComplete='off' value={data.dependente?.exclusao_motivo} onChange={e => closeModa({ dependente: { ...data.dependente, exclusao_motivo: e.target.value } })} type="text" required className="block uppercase w-full mb-2 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                                                        <button onClick={excluirDep} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                                            Sim, tenho certeza
                                                        </button>
                                                        <button onClick={() => setExcluirDependente(!excluirDependente)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>) : ''}
                                    </div>
                                </div>
                                <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400 ">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                                        {!checkDependente ? (<tr>
                                            <th scope="col" className=" px-2 py-1">
                                                NOME
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                ADESÃO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                CARÊNCIA
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                NASC.
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                PARENTESCO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                CELULAR
                                            </th>
                                            <th scope="col" className="px-4 py-1">
                                                <span className="">Ações</span>
                                            </th>
                                        </tr>) : (
                                            <tr>
                                                <th scope="col" className=" px-6 py-1">
                                                    NOME
                                                </th>
                                                <th scope="col" className="px-6 py-1">
                                                    ADESÃO
                                                </th>
                                                <th scope="col" className="px-6 py-1">
                                                    CARÊNCIA
                                                </th>
                                                <th scope="col" className="px-6 py-1">
                                                    NASC.
                                                </th>
                                                <th scope="col" className="px-6 py-1">
                                                    PARENTESCO
                                                </th>

                                                <th scope="col" className="px-6 py-1">
                                                    DATA EXCLUSÃO
                                                </th>
                                                <th scope="col" className="px-6 py-1">
                                                    USUÁRIO
                                                </th>
                                                <th scope="col" className="px-4 py-1">
                                                    <span className="">Ações</span>
                                                </th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {dadosassociado?.dependentes?.map((item, index) => (
                                            checkDependente && item.excluido ? (
                                                <tr key={index} onClick={() => closeModa({ dependente: { id_dependente: item.id_dependente, nome: item.nome, excluido: item.excluido } })} className={`border-b ${item.id_dependente === data.dependente?.id_dependente ? "bg-gray-600" : "bg-gray-800"} border-gray-700  hover:bg-gray-600 text-red-500`}>
                                                    <th scope="row" className="px-6 py-1 font-medium  whitespace-nowrap">
                                                        {item.nome}
                                                    </th>
                                                    <td className="px-6 py-1">
                                                        {new Date(item.data_adesao).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-1">
                                                        {item?.carencia ? new Date(item.carencia).toLocaleDateString() : ''}
                                                    </td>
                                                    <td className="px-6 py-1">
                                                        {item?.data_nasc ? new Date(item.data_nasc).toLocaleDateString() : ''}
                                                    </td>
                                                    <td className="px-6 py-1">
                                                        {item.grau_parentesco}
                                                    </td>
                                                    <td className="px-6 py-1">
                                                        {new Date(item.dt_exclusao).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-1">
                                                        {item.user_exclusao}
                                                    </td>


                                                    <td className="px-4 py-1 text-right">
                                                        <button onClick={(event) => {
                                                            event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                            closeModa(
                                                                {
                                                                    dependente: {
                                                                        saveAdd: true,
                                                                        close: true,
                                                                        carencia: item.carencia,
                                                                        data_adesao: item.data_adesao,
                                                                        data_nasc: item.data_nasc,
                                                                        grau_parentesco: item.grau_parentesco,
                                                                        id_dependente: item.id_dependente,
                                                                        nome: item.nome,
                                                                        excluido: item.excluido,
                                                                        exclusao_motivo: item.exclusao_motivo
                                                                    }
                                                                })
                                                        }} className="font-medium  text-blue-500 hover:underline">Edit</button>
                                                        {item.convalescenca.convalescenca_prod.map((dados, index) => (
                                                            dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" data-tooltip-content={dados?.descricao} className="text-yellow-500">
                                                                <TbWheelchair size={19} />
                                                            </button>

                                                        ))}
                                                    </td>
                                                </tr>) : !checkDependente && !item.excluido ? (
                                                    <tr key={index} onClick={() => closeModa({ dependente: { id_dependente: item.id_dependente, nome: item.nome, excluido: item.excluido } })} className={`border-b ${new Date(item.carencia) > new Date() ? "text-yellow-500" : "text-white"} ${item.id_dependente === data.dependente?.id_dependente ? "bg-gray-600" : "bg-gray-800"} border-gray-700  hover:bg-gray-600`}>
                                                        <th scope="row" className="px-2 py-1 font-medium   whitespace-nowrap w-full">
                                                            {item.nome}
                                                        </th>
                                                        <td className="px-8 py-1 w-full">
                                                            {new Date(item.data_adesao).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-10 py-1 w-full">
                                                            {item?.carencia ? new Date(item.carencia).toLocaleDateString() : ''}
                                                        </td>
                                                        <td className="px-8 py-1 w-full">
                                                            {item?.data_nasc ? new Date(item.data_nasc).toLocaleDateString() : ''}
                                                        </td> 
                                                        <td className="px-12 py-1 w-full">
                                                            {item.grau_parentesco}
                                                        </td>

                                                        <td className="px-6 py-1 w-full">
                                                            {item.celular}
                                                        </td>
                                                        <td className="px-3 py-1 w-full">
                                                            <div className="inline-flex gap-3">
                                                                <button onClick={(event) => {
                                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                                    closeModa(
                                                                        {
                                                                            dependente: {
                                                                                saveAdd: true,
                                                                                close: true,
                                                                                carencia: item.carencia,
                                                                                data_adesao: item.data_adesao,
                                                                                data_nasc: item.data_nasc,
                                                                                grau_parentesco: item.grau_parentesco,
                                                                                id_dependente: item.id_dependente,
                                                                                excluido: item.excluido,
                                                                                nome: item.nome,

                                                                            }
                                                                        })
                                                                }} className="font-medium  text-blue-500 hover:underline">Edit</button>

                                                                {item?.convalescenca?.convalescenca_prod?.map((dados, index) => (
                                                                    dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" data-tooltip-content={dados?.descricao} className="text-yellow-500">
                                                                        <TbWheelchair size={19} />
                                                                    </button>

                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : ''

                                        ))}

                                    </tbody>

                                </table>
                            </div>)}

                            {
                                indexTab === 6 && <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                                    <div className="flex flex-row text-white gap-6 w-full">
                                        <PrintButtonContrato />
                                        <PrintButton />
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
                            }

                            {
                                indexTab === 4 && (<CarteirasDep
                                     titular={dadosassociado?.nome??''}
                                      dependentes={dadosassociado?.dependentes ?? []} 
                                      contrato={dadosassociado?.contrato?.id_contrato ?? 0}
                                       plano={dadosassociado?.contrato?.plano ?? ''}
                                       bairro={dadosassociado?.bairro??''}
                                       celular={dadosassociado?.celular1??''}
                                       cidade={dadosassociado?.cidade??''}
                                       endereco={dadosassociado?.endereco??''}
                                       numero={dadosassociado?.numero??null}
                                       uf={dadosassociado?.uf??''}
                                       />)
                            }

                            {indexTab === 5 && (<ObitosAssociado
                                obitos={dadosassociado?.contrato?.obitos ?? []}
                            />)}




                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export const getServerSideProps = canSRRAuth(async (ctx) => {
    return {
        props: {}
    }
})