import { ModalEditarDados } from "@/components/admContrato/dadosAssociado/modalEditar/modalEditarDados";
import {  AuthContext } from "@/contexts/AuthContext";
import { AssociadoProps } from "@/types/associado";
import { Badge, Button, ButtonGroup, Card } from "flowbite-react";
import { useContext, useState } from "react";
import { BiSave } from "react-icons/bi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TbWheelchair } from "react-icons/tb";
import { ModalAlterarPlano } from "./modalAlterarPlano";
import { ModalInativar } from "./modalEditar/modalInativar";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";





interface DataProps{
    dadosassociado:Partial<AssociadoProps>
}


export function DadosAssociado({dadosassociado}:DataProps){
         const {usuario,closeModa,permissoes,setarDadosAssociado}= useContext(AuthContext)
        const [openEdit,setModalEdit]=useState<boolean>(false)
         const [verObs, setVerObs] = useState(false)
         const [observacao, setObservacao] = useState('');
         const [openAltPlano,setOpenAltPlano] = useState<boolean>(false)
         const [openInativar,setOpenInativar] = useState<boolean>(false)


         function handleObservacao() {

            const novaObservacao = observacao.trim(); // Remove espaços em branco
    
            if (novaObservacao !== '') {
                const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
                closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
                setObservacao('')
            }
        }

     






    return(
        <div className={`p-4  rounded-b-lg w-full `}>

                                <div className="inline-flex w-full justify-between  gap-3 mb-3 pl-2 text-xl font-semibold tracking-tight text-black">
                                    <div className="inline-flex gap-3 items-center ">
                                    {dadosassociado?.contrato?.id_contrato}-{dadosassociado?.nome}
                                    <span>CATEGORIA:

                                        <span className="pl-3 text-[#c5942b]">{dadosassociado?.contrato?.plano}</span>
                                    </span>

                                   <Badge size={'sm'} color={dadosassociado.contrato?.situacao === 'ATIVO' ? 'success' : `failure`}>{dadosassociado?.contrato?.situacao}</Badge>

                                    {dadosassociado?.contrato?.convalescencia?.map(item => (
                                        <>
                                            {item.convalescenca_prod.map((dados, index) => (!item.id_dependente || item.id_dependente === null) && item.status === 'ABERTO' && <button data-tooltip-id="my-tooltip" data-tooltip-content={dados?.descricao ?? ''} className="text-yellow-500">
                                                <TbWheelchair size={20} />
                                            </button>)}
                                        </>
                                    ))}

</div>
<ButtonGroup outline >
    <Button color={'gray'} size={'sm'} onClick={()=>setOpenAltPlano(true)}>ALTERAR CATEGORIA</Button>
   <Button  disabled={!permissoes.includes('ADM1.1.3')}  onClick={()=>setOpenInativar(true)} color={'gray'} size={'sm'} >{dadosassociado?.contrato?.situacao === 'ATIVO' ? "INATIVAR CONTRATO" : "ATIVAR CONTRATO"}</Button>
    
</ButtonGroup>

                                </div>
                                <div className="flex w-full flex-row gap-2">

                                   <Card onClick={() => {


setModalEdit(true)
}}  className="w-full text-black text-sm cursor-pointer">
                                        <h2 className="text-sm font-semibold mb-4  text-black">DADOS  DO TITULAR </h2>

                                        <div className="mb-1 inline-flex justify-between  gap-2 font-semibold tracking-tight  ">
                                            <p className="mb-1  ">ENDEREÇO: {dadosassociado?.endereco}</p>
                                            <p className="mb-1  ">Nº: {dadosassociado?.numero}</p>
                                            <p className="mb-1 ">BAIRRO: {dadosassociado?.bairro}</p>
                                            <p className="mb-1 ">CIDADE:{dadosassociado?.cidade}</p>
                                        </div>
                                        <div className="mb-1 flex flex-row justify-between gap-2 font-semibold ">
                                            <p >PONTO REF: {dadosassociado?.guia_rua}</p>
                                            <p><span  className="font-semibold" >CELULAR1: </span>{dadosassociado?.celular1}</p>
                                            <p className="mb-1 ">CELULAR2:{dadosassociado?.celular2}</p>

                                        </div>

                                    
                                      
                                        </Card>

                                    <Card onClick={() => {
                                               
                                                setModalEdit(true)
                                            }} className="flex w-full text-black text-sm cursor-pointer">
                                   
                                        <h2 className="text-sm font-semibold mb-4 ">DADOS  DO PLANO</h2>

                                        <div className="mb-1 flex flex-row justify-between gap-2 font-semibold">

                                            <p className="mb-1 ">CATEGORIA: {dadosassociado?.contrato?.plano}</p>
                                            <p className="mb-1 ">VALOR: R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                                            <p className="mb-1 ">ADESÃO:  {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado?.contrato?.dt_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>
                                            <p className="mb-1 ">CARÊNCIA: {dadosassociado.contrato?.dt_carencia && new Date(dadosassociado?.contrato?.dt_carencia).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>
                                        </div>
                                        <div className="mb-1 flex flex-row justify-between gap-2  tracking-tight font-semibold  ">
                                            <p className="  ">ORIGEM: {dadosassociado?.contrato?.origem}</p>
                                            <p className=" ">CONSULTOR: {dadosassociado?.contrato?.consultor}</p>
                                            <p className=" ">COBRADOR: {dadosassociado?.contrato?.cobrador}</p>
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

                                            <textarea value={verObs ? dadosassociado.contrato?.anotacoes : ''} disabled rows={4} className="w-full px-0 text-sm pl-2  border-0  focus:ring-0 bg-gray-100 text-gray-400 placeholder-gray-400" />
                                        </div>

                                    </div>
                                </div>

                                {openEdit && <ModalEditarDados dataForm={dadosassociado} setModalEdit={setModalEdit} openEdit={openEdit} />}

                                <ModalAlterarPlano   openModal={openAltPlano} setOpenModal={setOpenAltPlano}/>
                               {openInativar && <ModalInativar openModal={openInativar} setModal={setOpenInativar} />}
                            </div>
    )
}