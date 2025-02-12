import { ModalEditarDados } from "@/components/admContrato/dadosAssociado/modalEditar/modalEditarDados";
import {  AuthContext } from "@/contexts/AuthContext";
import { AssociadoProps } from "@/types/associado";
import { Badge, Button, ButtonGroup, Card, Dropdown } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { BiSave } from "react-icons/bi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TbWheelchair } from "react-icons/tb";
import { ModalAlterarPlano } from "./modalAlterarPlano";
import { ModalInativar } from "./modalEditar/modalInativar";
import { useReactToPrint } from "react-to-print";
import ImpressaoCarne from "@/Documents/mensalidade/ImpressaoCarne";
import ContratoResumo from "@/Documents/contratoResumido/ContratoResumo";
import pageStyle from "@/utils/pageStyle";
import DocumentTemplate from "@/Documents/contratoAdesão/DocumentTemplate";
import Carteiras from "@/Documents/carteiraAssociado/DocumentTemplate";
import { EmpresaProps } from "@/types/empresa";





interface DataProps{
    dadosassociado:Partial<AssociadoProps>,
    infoEmpresa:EmpresaProps|null
}


export function DadosAssociado({dadosassociado,infoEmpresa}:DataProps){
         const {usuario,closeModa,permissoes,setarDadosAssociado}= useContext(AuthContext)
        const [openEdit,setModalEdit]=useState<boolean>(false)
         const [verObs, setVerObs] = useState(false)
         const [observacao, setObservacao] = useState('');
         const [openAltPlano,setOpenAltPlano] = useState<boolean>(false)
         const [openInativar,setOpenInativar] = useState<boolean>(false)
         const componentContrato = useRef<DocumentTemplate>(null)
         const componentCarteira = useRef<Carteiras>(null)
         const componentCarne = useRef<ImpressaoCarne>(null)
         const componentResumo = useRef<ContratoResumo>(null)
         const [printCarne, setPrintCarne] = useState(false)
         const [printContrato, setPrintContrato] = useState(false)
         const [printCarteira, setPrintCarteira] = useState(false)
         const [printResumo, setPrintResumo] = useState(false)


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

         
             useEffect(()=>{
                 printCarne && imprimirCarne()
                 printContrato && imprimirContrato()
                 printCarteira && imprimirCarteira()
                 printResumo && imprimirResumo()
             },[printCarne,printContrato,printCarteira,printResumo])

         function handleObservacao() {

            const novaObservacao = observacao.trim(); // Remove espaços em branco
    
            if (novaObservacao !== '') {
                const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
                closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
                setObservacao('')
            }
        }

     






    return(
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
<ButtonGroup  outline >
    <Button className="text-black  " color={'gray'} size={'xs'} onClick={()=>setOpenAltPlano(true)}>Alterar Categoria</Button>
   <Button  className="text-black " disabled={!permissoes.includes('ADM1.1.3')}  onClick={()=>setOpenInativar(true)} color={'gray'} size={'xs'} >{dadosassociado?.contrato?.situacao === 'ATIVO' ? "Inativar Contrato" : "Ativar Contrato"}</Button>

 
    <Dropdown label="" renderTrigger={()=><Button theme={{color:{gray:"border border-gray-200 bg-white text-gray-900  enabled:hover:bg-gray-100 enabled:hover:text-cyan-700"},pill:{off:'rounded-r-lg'}}} className="text-black " color={'gray'} size={'xs'} >Imprimir Documentos</Button>} >
    <Dropdown.Item className="text-xs" onClick={()=>setPrintContrato(true)}>Contrato</Dropdown.Item>
      <Dropdown.Item className="text-xs" onClick={()=>setPrintCarne(true)}>Carnê</Dropdown.Item>
      <Dropdown.Item className="text-xs"  onClick={()=>setPrintCarteira(true)}>Carteiras</Dropdown.Item>  
      <Dropdown.Item className="text-xs" onClick={()=>setPrintResumo(true)}>Resumo de Contrato</Dropdown.Item>                               
    </Dropdown>
  
    
</ButtonGroup>

                                </div>
                                <div className="flex w-full flex-row gap-2">

                                   <Card onClick={() => {


setModalEdit(true)
}}  className="w-full text-black text-xs cursor-pointer">
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
                                               
                                                setModalEdit(true)
                                            }} className="flex w-full text-black text-xs cursor-pointer">
                                   
                                        <h2 className="text-sm font-semibold mb-4 ">Dados do Plano</h2>

                                        <div className="mb-1 flex flex-row justify-between gap-2 ">

                                            <p className="mb-1 ">Categoria: {dadosassociado?.contrato?.plano}</p>
                                            <p className="mb-1 ">Valor: R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                                            <p className="mb-1 ">Adesão:  {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado?.contrato?.dt_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>
                                            <p className="mb-1 ">Carência: {dadosassociado.contrato?.dt_carencia && new Date(dadosassociado?.contrato?.dt_carencia).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>
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
                                            <button onClick={() => setVerObs(!verObs)} type="button" className="inline-flex items-center py-1 px-2  text-center text-gray-600 0 rounded-lg  hover:bg-blue-800">
                                                {verObs ? <IoMdEye data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Ocultar Observações" size={20} /> : <IoMdEyeOff data-tooltip-id="my-tooltip"
                                                        data-tooltip-content="Visualizar Observações" size={20} />}
                                            </button>

                                            <input value={observacao ?? ''} onChange={e => setObservacao(e.target.value ?? '')} placeholder="Digite aqui todas as observações em relação ao plano" type="text" className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-100 border-gray-300 placeholder-gray-600 text-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                                            <Button size={'xs'} disabled={!permissoes.includes('ADM1.1.2')} onClick={() => handleObservacao()}>
                                                <BiSave size={20} />
                                            </Button>

                                        </div>
                                        <div className="px-4 py-2 rounded-b-lg bg-gray-100">

                                            <textarea value={verObs && dadosassociado.contrato?.anotacoes ? dadosassociado.contrato?.anotacoes : ''} disabled rows={3} className="w-full px-0 text-sm pl-2  border-0  focus:ring-0 bg-gray-100 text-gray-400 placeholder-gray-400" />
                                        </div>

                                    </div>
                                </div>

                                {openEdit && <ModalEditarDados dataForm={dadosassociado} setModalEdit={setModalEdit} openEdit={openEdit} />}

                               {openAltPlano && <ModalAlterarPlano   openModal={openAltPlano} setOpenModal={setOpenAltPlano}/>}
                               {openInativar && <ModalInativar openModal={openInativar} setModal={setOpenInativar} />}






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
            infoEmpresa={infoEmpresa}
        ref={componentContrato} />}

       { printCarteira && <Carteiras
       infoEmpresa={infoEmpresa}
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
            infoEmpresa={infoEmpresa}
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
                            </div>
    )
}