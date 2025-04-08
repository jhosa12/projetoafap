import { ModalEditarDados } from "@/components/modals/admContrato/dadosAssociado/modalEditarDados";
import { AuthContext } from "@/store/AuthContext";
import { AssociadoProps } from "@/types/associado";
import { Badge, Button, ButtonGroup, Card, Dropdown } from "flowbite-react";
import { useContext, useState } from "react";
import { BiSave } from "react-icons/bi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TbWheelchair } from "react-icons/tb";
import { ModalAlterarPlano } from "../../../modals/admContrato/dadosAssociado/modalAlterarPlano";
import { ModalInativar } from "../../../modals/admContrato/dadosAssociado/modalInativar";
import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import ContratoResumo from "@/Documents/associado/contratoResumido/ContratoResumo";
import DocumentTemplate from "@/Documents/associado/contratoAdesão/DocumentTemplate";
import Carteiras from "@/Documents/associado/carteiraAssociado/CarteiraAssociado";
import { EmpresaProps } from "@/types/empresa";
import { CartaNovoAssociado } from "@/Documents/associado/cartaNovoAssociado/cartaDocument";
import { ProtocoloCancelamento } from "@/Documents/associado/protocoloCancelamento/ProtocoloCancelamento";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { usePrintDocsAssociado } from "@/hooks/usePrintDocsAssociado";
import { UserProps } from "@/types/user";

interface DataProps {
    dadosassociado: Partial<AssociadoProps> | AssociadoProps,
    infoEmpresa: EmpresaProps | null
    usuario:UserProps,
    setarDadosAssociado:(dados:Partial<AssociadoProps>)=>void,
    permissoes:Array<string>
}

export function DadosAssociado({ dadosassociado, infoEmpresa,setarDadosAssociado,usuario,permissoes }: DataProps) {
    const [observacao, setObservacao] = useState('');
    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        editar: false,
        observacao: false,
    })





    /*  function handleObservacao() {
  
          const novaObservacao = observacao.trim(); // Remove espaços em branco
  
          if (novaObservacao !== '') {
              const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
              closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' ' + `[${usuario?.nome + ' ' + 'em' + ' ' + new Date().toLocaleDateString()}]` + '\n' } });
              setObservacao('')
          }
     
  }*/

    return (
        <div className={`flex flex-col w-full text-xs p-4 rounded-b-lg overflow-x-hidden`}>

            {modal.editar && <ModalEditarDados dataForm={dadosassociado} setModalEdit={() => setModal({ editar: false })} openEdit={modal.editar} />}
                
            {dadosassociado.contrato?.situacao === 'INATIVO' && <span className="text-[10px] text-red-500 font-medium">MOTIVO INATIVO:{dadosassociado.contrato?.dt_cancelamento && new Date(dadosassociado.contrato?.dt_cancelamento).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' })}  - {dadosassociado.contrato?.motivo_inativo}</span>}
            <div className="flex w-full flex-col sm:flex-row gap-2">

            <Card 
                    onClick={() => setModal({ editar: true })}
                    className="w-full sm:w-1/2 uppercase text-xs cursor-pointer transition-transform duration-150 hover:shadow-xl hover:scale-105"
                >
                    <h2 className="text-sm font-bold mb-3 text-black border-b pb-1">Dados Pessoais</h2>
                    <div className="space-y-1">
                        <p><span className="font-medium">Endereço:</span> {dadosassociado?.endereco}</p>
                        <p><span className="font-medium">Número:</span> {dadosassociado?.numero}</p>
                        <p><span className="font-medium">Bairro:</span> {dadosassociado?.bairro}</p>
                        <p><span className="font-medium">Cidade:</span> {dadosassociado?.cidade}</p>
                    </div>
                    <div className="mt-3 space-y-1">
                        <p><span className="font-medium">Ponto de Referência:</span> {dadosassociado?.guia_rua}</p>
                        <p><span className="font-medium">Celular1:</span> {dadosassociado?.celular1}</p>
                        <p><span className="font-medium">Celular2:</span> {dadosassociado?.celular2}</p>
                    </div>
                </Card>

                <Card 
                    onClick={() => setModal({ editar: true })}
                    className="w-full uppercase sm:w-1/2 text-xs cursor-pointer transition-transform duration-150 hover:shadow-xl hover:scale-105"
                >
                    <h2 className="text-sm font-bold mb-3 text-black border-b pb-1">Dados do Plano</h2>
                    <div className="space-y-1">
                        <p><span className="font-medium">Categoria:</span> {dadosassociado?.contrato?.plano}</p>
                        <p><span className="font-medium">Valor:</span> R$ {dadosassociado?.contrato?.valor_mensalidade}</p>
                        <p>
                            <span className="font-medium">Adesão:</span> 
                            {dadosassociado.contrato?.dt_adesao && new Date(dadosassociado.contrato.dt_adesao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </p>
                        <p>
                            <span className="font-medium">Carência:</span> 
                            {dadosassociado.contrato?.dt_carencia && new Date(dadosassociado.contrato.dt_carencia).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </p>
                    </div>
                    <div className="mt-3 space-y-1">
                        <p><span className="font-medium">Origem:</span> {dadosassociado?.contrato?.origem}</p>
                        <p><span className="font-medium">Consultor:</span> {dadosassociado?.contrato?.consultor}</p>
                        <p><span className="font-medium">Cobrador:</span> {dadosassociado?.contrato?.cobrador}</p>
                    </div>
                </Card>
            </div>

            <div>
                <div className="w-full  mt-2 border  rounded-lg  bg-gray-50 border-gray-300">
                    <div className="flex flex-wrap  gap-2 items-center  px-2 py-1 border-b border-gray-300">
                        <button onClick={() => setModal({ observacao: !modal.observacao })} type="button" className="inline-flex items-center py-1 px-2  text-center text-gray-600 0 rounded-lg  hover:bg-blue-800">
                            {modal.observacao ? <IoMdEye data-tooltip-id="my-tooltip"
                                data-tooltip-content="Ocultar Observações" size={20} /> : <IoMdEyeOff data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Visualizar Observações" size={20} />}
                        </button>

                        <input value={observacao ?? ''} onChange={e => setObservacao(e.target.value ?? '')} placeholder="Digite aqui todas as observações em relação ao plano" type="text" className="flex-grow min-w-0 rounded-sm bg-gray-100 text-gray-600 placeholder-gray-600 border border-gray-300 px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500" />
                        <Button size={'xs'} disabled={!permissoes.includes('ADM1.1.2')} onClick={() => { }
                            //handleObservacao()

                        }>
                            <BiSave size={20} />
                        </Button>

                    </div>
                    <div className="px-4 py-2 rounded-b-lg bg-gray-100">

                        <textarea value={modal.observacao && dadosassociado.contrato?.anotacoes ? dadosassociado.contrato?.anotacoes : ''} disabled rows={3} className="w-full px-0 text-sm pl-2  border-0  focus:ring-0 bg-gray-100 text-gray-400 placeholder-gray-400" />
                    </div>

                </div>
            </div>

            <ul className="flex flex-wrap gap-2 text-[11px] uppercase font-medium text-center border-b border-gray-300">
                <li>Ultimas Impressões{"->"}</li>
                {dadosassociado?.contrato?.impressoes?.map((item, index) => (
                    <li key={index}>{item.arquivo}: {item.date && new Date(item.date).toLocaleDateString('pt-BR')}-{item.user}</li>
                ))}
            </ul>


        </div>
    )
}