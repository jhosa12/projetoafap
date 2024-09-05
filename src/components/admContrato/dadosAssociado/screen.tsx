import { ModalEditarDados } from "@/components/modalEditarDados";
import { AssociadoProps, AuthContext } from "@/contexts/AuthContext";
import { Card } from "flowbite-react";
import { useContext, useState } from "react";
import { BiSave } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TbWheelchair } from "react-icons/tb";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";




interface DataProps{
    dadosassociado:Partial<AssociadoProps>
}


export function DadosAssociado({dadosassociado}:DataProps){
         const {usuario,closeModa,data}= useContext(AuthContext)
         const [openEdit, setOpenEdit] = useState<number>(0)
         const [verObs, setVerObs] = useState(false)
         const [observacao, setObservacao] = useState('');


         function handleObservacao() {

            const novaObservacao = observacao.trim(); // Remove espaços em branco
    
            if (novaObservacao !== '') {
                const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
                closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
                setObservacao('')
            }
        }
    return(
        <div className={`p-4  rounded-b-lg `}>

                                <h2 className="inline-flex gap-3 mb-3 text-xl font-semibold tracking-tight text-gray-600">
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

                                   <Card className="w-full text-gray-600 text-sm">
                                        <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO TITULAR </h2>

                                        <h5 className="mb-1 inline-flex justify-between  gap-2 font-semibold tracking-tight  ">
                                            <p className="mb-1 "><span  className="font-semibold">ENDEREÇO: </span>{dadosassociado?.endereco}</p>
                                            <p className="mb-1  "><span  className="font-semibold">Nº: </span>{dadosassociado?.numero}</p>
                                            <p className="mb-1 "><span  className="font-semibold">BAIRRO: </span>{dadosassociado?.bairro}</p>
                                            <p className="mb-1 "><span  className="font-semibold">CIDADE: </span>{dadosassociado?.cidade}</p>
                                        </h5>
                                        <h5 className="mb-1 flex flex-row justify-between gap-2 ">
                                            <p ><span  className="font-semibold">PONTO REF: </span>{dadosassociado?.guia_rua}</p>
                                            <p><span  className="font-semibold" >CELULAR1: </span>{dadosassociado?.celular1}</p>
                                            <p className="mb-1 "><span className="font-semibold" >CELULAR2: </span>{dadosassociado?.celular2}</p>

                                        </h5>

                                        <button data-tooltip-id="my-tooltip"

                                            data-tooltip-content="Editar Dados do Cliente/Contrato" onClick={() => {

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
                                        </Card>

                                    <Card className="flex w-full text-gray-600 text-sm">
                                   
                                        <h2 className="text-sm font-semibold mb-4 ">DADOS  DO PLANO</h2>

                                        <h5 className="mb-1 flex flex-row justify-between gap-2">

                                            <p className="mb-1 "><span className=" font-semibold">CATEGORIA: </span>{dadosassociado?.contrato?.plano}</p>
                                            <p className="mb-1 "><span className=" font-semibold">VALOR: </span>R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                                            <p className="mb-1 "><span className=" font-semibold">ADESÃO: </span> {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado?.contrato?.dt_adesao).toLocaleDateString()}</p>
                                            <p className="mb-1 "><span className=" font-semibold">CARÊNCIA: </span>{dadosassociado.contrato?.dt_carencia && new Date(dadosassociado?.contrato?.dt_carencia).toLocaleDateString()}</p>
                                        </h5>
                                        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  ">
                                            <p className="  "><span className=" font-semibold">ORIGEM: </span>{dadosassociado?.contrato?.origem}</p>
                                            <p className=" "><span className=" font-semibold">CONSULTOR: </span>{dadosassociado?.contrato?.consultor}</p>
                                            <p className=" "><span className=" font-semibold">COBRADOR: </span>{dadosassociado?.contrato?.cobrador}</p>
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
                                            <button onClick={() => handleObservacao()} type="button" className="inline-flex items-center py-1 px-2  text-center text-gray-400 bg-blue-700 rounded-lg  hover:bg-blue-800">
                                                <BiSave size={22} />
                                            </button>

                                        </div>
                                        <div className="px-4 py-2 rounded-b-lg bg-gray-100">

                                            <textarea value={verObs ? dadosassociado.contrato?.anotacoes : ''} disabled rows={4} className="w-full px-0 text-sm pl-2  border-0  focus:ring-0 bg-gray-100 text-gray-400 placeholder-gray-400" />
                                        </div>

                                    </div>
                                </div>

                                {data.closeEditarAssociado && <ModalEditarDados openEdit={openEdit} />}
                            </div>
    )
}