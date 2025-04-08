
import { api } from "@/lib/axios/apiClient"
import {  useEffect, useRef, useState } from "react"
import { MdDeleteForever, MdEdit } from "react-icons/md"
import { RiAddCircleFill } from "react-icons/ri"
import {  TbWheelchair } from "react-icons/tb"
import { Tooltip } from "react-tooltip"
import { ModalDependentes } from "../../../modals/admContrato/dependentes/modalDependentes"
import { ModalExcluirDep } from "../../../modals/admContrato/dependentes/modalExcluir"
import DeclaracaoExclusao from "@/Documents/dependentes/DeclaracaoExclusao"
import { IoPrint } from "react-icons/io5"
import { useReactToPrint } from "react-to-print"
import { AssociadoProps, DependentesProps } from "@/types/associado"
import pageStyle from "@/utils/pageStyle"
import { Button, ButtonGroup, Table } from "flowbite-react"
import { toast } from "sonner"
import { EmpresaProps } from "@/types/empresa"
import { UserProps } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"


interface DadosProps {
    dadosassociado:Partial<AssociadoProps>,
    setarDadosAssociado: (dados:Partial<AssociadoProps>)=>void,
    infoEmpresa:EmpresaProps|null,
    usuario:UserProps,
    permissoes:Array<string>
}


export function Dependentes({dadosassociado,infoEmpresa,setarDadosAssociado,usuario,permissoes}:DadosProps){
    const [checkDependente, setCheckDependente] = useState(false)
    const [dadosDep,setDadosDep] = useState<Partial<DependentesProps>>({} )
    const componentRef = useRef<DeclaracaoExclusao>(null)
    const [modal,setModal] = useState<{[key:string]:boolean}>({
        dependente:false,
        excluir:false,
        print:false
    })


    const imprimirDeclaracao =useReactToPrint({
        pageStyle:pageStyle,
        documentTitle:'DECLARAÇÃO DE EXCLUSÃO DEPENDENTE',
        content:()=>componentRef.current,
        onBeforeGetContent:()=>setModal({print:false})

   })

   useEffect(()=>{
    if (modal.print && dadosDep) {
        imprimirDeclaracao();  // Chama a impressão apenas quando os dados são atualizados
        //setIsReadyToPrint(false);  // Reseta o estado
       
    }

   },[modal.print])

   const handlePrintClick = (item:DependentesProps) => {
    setDadosDep(item)
    //setIsReadyToPrint(true)
    setModal({print:true})
       
   }




    async function excluirDep(motivo:string) {
        if (dadosDep.excluido) {
            toast.info("Dependente ja excluido")
            return;
        }
        if (!dadosDep.id_dependente) {
            toast.info("Selecione um dependente!")
            return;
        }
        if (!motivo) {
            toast.warning("Informe um motivo!")
            return;
        }
      
            toast.promise(
                api.put('/excluirDependente', {
                    id_dependente_global: dadosDep.id_dependente_global,
                    id_dependente: Number(dadosDep.id_dependente),
                    excluido: true,
                    user_exclusao: usuario?.nome,
                    exclusao_motivo: motivo
                }),
                {
                    loading: `Efetuando`,
                    success: ()=>{
                        const novo = [...(dadosassociado?.dependentes??[])]
                        const index = novo.findIndex(item=>item.id_dependente_global===dadosDep.id_dependente_global)
                        novo.splice(index,1)
                        setarDadosAssociado({...dadosassociado,dependentes:novo})
                     //   await carregarDados()
            
                      // setModalExcDep(false)
                       setModal({excluir:false})

                       
                        return `Dependente Exluido`},
                    error: `Erro ao Excluir`
                }
            )
        
    }


    return(
        <div className="flex flex-col   max-h-[calc(100vh-200px)]  w-full  p-2 ">
                                <div className="flex w-full mb-2 gap-2">
                                <div className="flex items-center">
                    <Checkbox
                        checked={checkDependente}
                        onCheckedChange={() => setCheckDependente(!checkDependente)}
                        disabled={!permissoes.includes("ADM1.2.10")}
                        className="h-4 w-4" // Tamanho reduzido
                    />
                    <span className="ml-2 text-xs font-medium">Exibir Excluídos</span>
                </div>
        
                                     <ButtonGroup>

                                             <Button disabled={!permissoes.includes('ADM1.3.2')} onClick={() => {
                                                 setDadosDep({}),
                                                setModal({dependente:true})}} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Adicionar</Button>
                                                    <Button disabled={!permissoes.includes('ADM1.3.2')} onClick={() => {
                                                       
                                                        setModal({dependente:true})
                                                        }} type="button" color='light' size='xs'><MdEdit className='mr-1 h-4 w-4' />Editar</Button>
                                
                                                    <Button disabled={!permissoes.includes('ADM1.3.3')} onClick={() =>setModal({excluir:true}) } type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
                                                </ButtonGroup>
                            
                                </div>
                                <Table  theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 text-black py-1 text-xs" } },head: { cell: { base: "px-4 text-black py-1 text-xs" } } }} >
                                            <Table.Head>
                                                <Table.HeadCell  >
                                                    NOME
                                                </Table.HeadCell>
                                                <Table.HeadCell  >
                                                    ADESÃO
                                                </Table.HeadCell>
                                                <Table.HeadCell  >
                                                    CARÊNCIA
                                                </Table.HeadCell>
                                                <Table.HeadCell  >
                                                    NASC.
                                                </Table.HeadCell>
                                                <Table.HeadCell  >
                                                    PARENTESCO
                                                </Table.HeadCell>

                                                <Table.HeadCell  >
                                                    DATA EXCLUSÃO
                                                </Table.HeadCell>
                                                <Table.HeadCell  >
                                                    USUÁRIO
                                                </Table.HeadCell>
                                                <Table.HeadCell >
                                                    <span className="">Ações</span>
                                                </Table.HeadCell>
                                            </Table.Head>
                                    <Table.Body >
                                             {dadosassociado?.dependentes?.filter(item=>!checkDependente?item.excluido===false||item.excluido===null:item.excluido===true).map((item,index) => (   <Table.Row key={index} onClick={() =>setDadosDep(item)} className={`border-b ${item.id_dependente === dadosDep?.id_dependente ? "bg-gray-300" : ""} border-gray-300  hover:bg-gray-300 text-red-500`}>
                                                    <Table.Cell>
                                                        {item.nome}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {new Date(item.data_adesao).toLocaleDateString()}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item?.carencia && new Date(item.carencia).toLocaleDateString()}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item?.data_nasc && new Date(item.data_nasc).toLocaleDateString() }
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item.grau_parentesco}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item.dt_exclusao && new Date(item.dt_exclusao).toLocaleDateString()}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item.user_exclusao}
                                                    </Table.Cell>


                                                    <Table.Cell className="inline-flex text-right items-center gap-4">
                                                       
                                                       
                                                       <button onClick={e=>{e.stopPropagation(),handlePrintClick(item)}} className="text-gray-500 hover:text-blue-600">
                                                            <IoPrint size={19}/>
                                                       </button>
                                                       
                                                       
                                                        {item?.convalescenca?.convalescenca_prod?.map((dados, index) => (
                                                            dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" data-tooltip-content={dados?.descricao} className="text-yellow-500">
                                                                <TbWheelchair size={19} />
                                                            </button>
                                                        ))}
                                                    </Table.Cell>
                                                </Table.Row>))}
                                      

                                    </Table.Body>

                                </Table>

                                <div className="inline-flex gap-2 text-xs">
                                    <span>TOTAL: {dadosassociado?.dependentes?.filter(item=>!checkDependente?item.excluido===false||item.excluido===null:item.excluido===true).length}</span>


                                    <span>LIMITE: {dadosassociado?.contrato?.planos?.limite_dep}</span>
                                </div>
                               







                              {modal.dependente &&  <ModalDependentes data={dadosDep??{}} openModal={modal.dependente} setModal={()=>setModal({dependente:false})}/>}
                                <ModalExcluirDep nome={dadosDep?.nome??''} excluirDep={excluirDep} openModal={modal.excluir} setOpenModal={()=>setModal({excluir:false})}/>

                                <div style={{ display: 'none' }}>
                                  { modal.print && <DeclaracaoExclusao 
                                    logoUrl={infoEmpresa?.logoUrl ?? ''}
                                    data_nasc={dadosDep?.data_nasc??null}
                                    bairro={dadosassociado?.bairro ?? ''}
                                    cidade={dadosassociado?.cidade ?? ''}
                                    endereco={dadosassociado?.endereco ?? ''}
                                    uf={dadosassociado?.uf ?? ''}
                                    numero={dadosassociado?.numero ?? null}
                                    grau_parentesco={dadosDep.grau_parentesco ?? ''}
                                    nome={dadosDep?.nome??''}
                                    cpf={dadosassociado?.cpfcnpj ?? ''}
                                    titular={dadosassociado?.nome ?? ''}
                                    contrato={dadosassociado?.contrato?.id_contrato_global ?? null}
                                    ref={componentRef}
                                        />}
                                </div>
                            </div>
    )
}