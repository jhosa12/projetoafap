import { ModalEditarDados } from "@/components/admContrato/dadosAssociado/modalEditar/modalEditarDados";
import { AuthContext } from "@/contexts/AuthContext";
import { AssociadoProps } from "@/types/associado";
import { Badge, Button, ButtonGroup, Card, Dropdown } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { BiSave } from "react-icons/bi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TbWheelchair } from "react-icons/tb";
import { ModalAlterarPlano } from "./modalAlterarPlano";
import { ModalInativar } from "./modalEditar/modalInativar";
import { useReactToPrint } from "react-to-print";
import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import ContratoResumo from "@/Documents/associado/contratoResumido/ContratoResumo";
import pageStyle from "@/utils/pageStyle";
import DocumentTemplate from "@/Documents/associado/contratoAdesão/DocumentTemplate";
import Carteiras from "@/Documents/associado/carteiraAssociado/DocumentTemplate";
import { EmpresaProps } from "@/types/empresa";
import { CartaNovoAssociado } from "@/Documents/associado/cartaNovoAssociado/cartaDocument";
import { ProtocoloCancelamento } from "@/Documents/associado/protocoloCancelamento/ProtocoloCancelamento";

interface DataProps {
    dadosassociado: Partial<AssociadoProps>,
    infoEmpresa: EmpresaProps | null
}


export function DadosAssociado({ dadosassociado, infoEmpresa }: DataProps) {
    const { usuario, closeModa, permissoes } = useContext(AuthContext)
   // const [openEdit, setModalEdit] = useState<boolean>(false)
   // const [verObs, setVerObs] = useState(false)
    const [observacao, setObservacao] = useState('');
   // const [openAltPlano, setOpenAltPlano] = useState<boolean>(false)
   // const [openInativar, setOpenInativar] = useState<boolean>(false)
    const [modal,setModal] =useState<{[key:string]:boolean}>({
        editar:false,
        observacao:false,
        altPlano:false,
        inativar:false
    })



    const [printState, setPrintState] = useState<{ [key: string]: boolean }>({
        carne: false,
        contrato: false,
        carteira: false,
        resumo: false,
        carta: false,
        cancelamento: false
    });


    const componentRefs = {
        contrato: useRef<DocumentTemplate>(null),
        carteira: useRef<Carteiras>(null),
        carne: useRef<ImpressaoCarne>(null),
        resumo: useRef<ContratoResumo>(null),
        carta: useRef<CartaNovoAssociado>(null),
        cancelamento: useRef<ProtocoloCancelamento>(null)
    };


    const handlePrint = (doc: string) => {
        setPrintState((prev) => ({ ...prev, [doc]: true }));
    };




    const imprimirCancelamento = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CANCELAMENTO",
        content: () => componentRefs.cancelamento.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, cancelamento: false })),
    });



    const imprimirContrato = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CONTRATO",
        content: () => componentRefs.contrato.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, contrato: false })),
    });

    const imprimirCarteira = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARTEIRA",
        content: () => componentRefs.carteira.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, carteira: false })),
    });

    const imprimirCarne = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARNÊ",
        content: () => componentRefs.carne.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, carne: false })),
    });

    const imprimirResumo = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "RESUMO",
        content: () => componentRefs.resumo.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, resumo: false })),
    });


    const imprimirCarta = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARTA",
        content: () => componentRefs.carta.current,
        onAfterPrint: () => setPrintState((prev) => ({ ...prev, carta: false })),
    });

    /* useEffect(() => {
       Object.keys(printState).forEach((doc) => {
         if (printState[doc]) {
           imprimirDocumento(doc, componentRefs[doc as keyof typeof componentRefs]);
         }
       });
     }, [printState]);*/

    useEffect(() => {
        if (printState.contrato) imprimirContrato();
        if (printState.carteira) imprimirCarteira();
        if (printState.carne) imprimirCarne();
        if (printState.resumo) imprimirResumo();
        if (printState.carta) imprimirCarta();
        if (printState.cancelamento) imprimirCancelamento();
    }, [printState]);


    function handleObservacao() {

        const novaObservacao = observacao.trim(); // Remove espaços em branco

        if (novaObservacao !== '') {
            const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
            closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
            setObservacao('')
        }
    }


    return (
        <div className={`flex flex-col h-[calc(100vh-190px)]  text-xs p-4  rounded-b-lg w-full `}>

            <div className="inline-flex w-full justify-between  gap-3 mb-3 pl-2 text-sm font-semibold tracking-tight text-black">
                <div className="inline-flex gap-3 items-center ">
                    {dadosassociado?.contrato?.id_contrato}-{dadosassociado?.nome}
                    <span>CATEGORIA:

                        <span className="pl-3 text-[#c5942b]">{dadosassociado?.contrato?.plano}</span>
                    </span>

                    <Badge size={'sm'} color={dadosassociado.contrato?.situacao === 'ATIVO' ? 'success' : `failure`}>{dadosassociado?.contrato?.situacao}</Badge>

                    {dadosassociado?.contrato?.convalescencia?.map(item => (
                        <>
                            {item.convalescenca_prod?.map((dados, index) => (!item.id_dependente || item.id_dependente === null) && item.status === 'ABERTO' && <button data-tooltip-id="my-tooltip" data-tooltip-content={dados?.descricao ?? ''} className="text-yellow-500">
                                <TbWheelchair size={20} />
                            </button>)}
                        </>
                    ))}

                </div>
                <ButtonGroup outline >
                    <Button className="text-black  " color={'gray'} size={'xs'} onClick={() => setModal({altPlano:true})}>Alterar Categoria</Button>
                    <Button className="text-black " disabled={!permissoes.includes('ADM1.1.3')} onClick={() => setModal({inativar:true})} color={'gray'} size={'xs'} >{dadosassociado?.contrato?.situacao === 'ATIVO' ? "Inativar Contrato" : "Ativar Contrato"}</Button>


                    <Dropdown label="" renderTrigger={() => <Button theme={{ color: { gray: "border border-gray-200 bg-white text-gray-900  enabled:hover:bg-gray-100 enabled:hover:text-cyan-700" }, pill: { off: 'rounded-r-lg' } }} className="text-black " color={'gray'} size={'xs'} >Imprimir Documentos</Button>} >
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('carta')}>
                            Carta
                        </Dropdown.Item>
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('contrato')}>
                            Contrato
                        </Dropdown.Item>
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('carne')}>
                            Carnê
                        </Dropdown.Item>
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('carteira')}>
                            Carteiras
                        </Dropdown.Item>
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('resumo')}>
                            Resumo de Contrato
                        </Dropdown.Item>
                        <Dropdown.Item className="text-xs" onClick={() => handlePrint('cancelamento')}>
                            Cancelamento
                        </Dropdown.Item>
                    </Dropdown>


                </ButtonGroup>

            </div>
            <div className="flex w-full flex-row gap-2">

                <Card onClick={() => {


                    setModal({editar:true})
                }} className="w-full text-black text-xs cursor-pointer">
                    <h2 className="text-sm font-semibold mb-4  text-black">Dados Titular </h2>

                    <div className="mb-1 inline-flex justify-between  gap-2  tracking-tight  ">
                        <p className="mb-1  ">Endereço: {dadosassociado?.endereco}</p>
                        <p className="mb-1  ">Nº: {dadosassociado?.numero}</p>
                        <p className="mb-1 ">Bairro: {dadosassociado?.bairro}</p>
                        <p className="mb-1 ">Cidade:{dadosassociado?.cidade}</p>
                    </div>
                    <div className="mb-1 flex flex-row justify-between gap-2  ">
                        <p >Ponto ref: {dadosassociado?.guia_rua}</p>
                        <span   >Celular1: {dadosassociado?.celular1} </span>
                        <p className="mb-1 ">Celular2:{dadosassociado?.celular2}</p>

                    </div>



                </Card>

                <Card onClick={() => {

                    setModal({editar:true})
                }} className="flex w-full text-black text-xs cursor-pointer">

                    <h2 className="text-sm font-semibold mb-4 ">Dados do Plano</h2>

                    <div className="mb-1 flex flex-row justify-between gap-2 ">

                        <p className="mb-1 ">Categoria: {dadosassociado?.contrato?.plano}</p>
                        <p className="mb-1 ">Valor: R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                        <p className="mb-1 ">Adesão:  {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado?.contrato?.dt_adesao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                        <p className="mb-1 ">Carência: {dadosassociado.contrato?.dt_carencia && new Date(dadosassociado?.contrato?.dt_carencia).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    </div>
                    <div className="mb-1 flex flex-row justify-between gap-2  tracking-tight  ">
                        <p className="  ">Origem: {dadosassociado?.contrato?.origem}</p>
                        <p className=" ">Consultor: {dadosassociado?.contrato?.consultor}</p>
                        <p className=" ">Cobrador: {dadosassociado?.contrato?.cobrador}</p>
                    </div>



                </Card >
            </div>

            <div>
                <div className="w-full  mt-2 border  rounded-lg  bg-gray-50 border-gray-300">
                    <div className="flex gap-2 items-center justify-end px-2 py-1 border-b border-gray-300">
                        <button onClick={() => setModal({observacao:!modal.observacao})} type="button" className="inline-flex items-center py-1 px-2  text-center text-gray-600 0 rounded-lg  hover:bg-blue-800">
                            {modal.observacao ? <IoMdEye data-tooltip-id="my-tooltip"
                                data-tooltip-content="Ocultar Observações" size={20} /> : <IoMdEyeOff data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Visualizar Observações" size={20} />}
                        </button>

                        <input value={observacao ?? ''} onChange={e => setObservacao(e.target.value ?? '')} placeholder="Digite aqui todas as observações em relação ao plano" type="text" className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-100 border-gray-300 placeholder-gray-600 text-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                        <Button size={'xs'} disabled={!permissoes.includes('ADM1.1.2')} onClick={() => handleObservacao()}>
                            <BiSave size={20} />
                        </Button>

                    </div>
                    <div className="px-4 py-2 rounded-b-lg bg-gray-100">

                        <textarea value={modal.observacao && dadosassociado.contrato?.anotacoes ? dadosassociado.contrato?.anotacoes : ''} disabled rows={3} className="w-full px-0 text-sm pl-2  border-0  focus:ring-0 bg-gray-100 text-gray-400 placeholder-gray-400" />
                    </div>

                </div>
            </div>

            {modal.editar && <ModalEditarDados dataForm={dadosassociado} setModalEdit={()=>setModal({editar:false})} openEdit={modal.editar} />}

            {modal.altPlano && <ModalAlterarPlano openModal={modal.altPlano} setOpenModal={()=>setModal({altPlano:false})} />}
            {modal.inativar && <ModalInativar openModal={modal.inativar} setModal={()=>setModal({inativar:false})} />}


            <div style={{ display: 'none' }}>
                {printState.contrato && <DocumentTemplate
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
                    infoEmpresa={infoEmpresa}
                    ref={componentRefs.contrato} />}

                {printState.carteira && <Carteiras
                    infoEmpresa={infoEmpresa}
                    adesao={dadosassociado.contrato?.dt_adesao ?? new Date()}
                    cpf={dadosassociado.cpfcnpj ?? ''}
                    rg={dadosassociado.rg ?? ""}

                    dependentes={dadosassociado?.dependentes ?? []}
                    plano={dadosassociado?.contrato?.plano ?? ''}
                    ref={componentRefs.carteira}
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

                {printState.carne && <ImpressaoCarne
                    infoEmpresa={infoEmpresa}
                    ref={componentRefs.carne}
                    arrayMensalidade={dadosassociado?.mensalidade?.filter(mensalidade => mensalidade.status !== 'P') ?? []}
                    dadosAssociado={
                        {
                            bairro: dadosassociado?.bairro ?? '',
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

                {printState.resumo && <ContratoResumo
                    infoEmpresa={infoEmpresa}
                    ref={componentRefs.resumo}
                    dados={dadosassociado ?? {}}
                />}

                {printState.carta && <CartaNovoAssociado
                    infoEmpresa={infoEmpresa}
                    ref={componentRefs.carta}
                    contrato={dadosassociado?.contrato?.id_contrato ?? 0}
                    titular={dadosassociado?.nome ?? ''}
                    
                />}

{printState.cancelamento && <ProtocoloCancelamento
                    infoEmpresa={infoEmpresa}
                    ref={componentRefs.cancelamento}
                    contrato={dadosassociado?.contrato?.id_contrato ?? 0}
                    titular={dadosassociado?.nome ?? ''}
                    bairro={dadosassociado?.bairro ?? ''}
                    cidade={dadosassociado?.cidade ?? ''}
                    endereco={dadosassociado?.endereco ?? ''}
                    cpf={dadosassociado?.cpfcnpj ?? ''}
                    usuario={usuario?.nome ?? ''}
                />}
            </div>
        </div>
    )
}