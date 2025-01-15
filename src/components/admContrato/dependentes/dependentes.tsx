import { AuthContext} from "@/contexts/AuthContext"
import { api } from "@/services/apiClient"
import { useContext, useEffect, useRef, useState } from "react"
import { IoIosClose } from "react-icons/io"
import { MdDeleteForever } from "react-icons/md"
import { RiAddCircleFill } from "react-icons/ri"
import {  TbWheelchair } from "react-icons/tb"
import { toast } from "react-toastify"
import { Tooltip } from "react-tooltip"
import { ModalDependentes } from "./modalDependentes"
import { ModalExcluirDep } from "./modalExcluir"
import DeclaracaoExclusao from "@/Documents/dependentes/DeclaracaoExclusao"
import { IoPrint } from "react-icons/io5"
import { useReactToPrint } from "react-to-print"
import { DependentesProps } from "@/types/associado"
import pageStyle from "@/utils/pageStyle"
import { Button, ButtonGroup } from "flowbite-react"




export function Dependentes(){
    const [checkDependente, setCheckDependente] = useState(false)
    const {closeModa,dadosassociado,data,usuario,setarDadosAssociado,permissoes} =useContext(AuthContext)
    const [modalExcluirDep, setModalExcDep] = useState(false)
    const [modalDep,setModalDep] = useState<boolean>(false)
    const [dadosDep,setDadosDep] = useState<DependentesProps>({} as DependentesProps)
    const componentRef = useRef<DeclaracaoExclusao>(null)
    const [isReadyToPrint,setIsReadyToPrint] = useState(false)


    const imprimirDeclaracao =useReactToPrint({
        pageStyle:pageStyle,
        documentTitle:'DECLARAÇÃO DE EXCLUSÃO DEPENDENTE',
        content:()=>componentRef.current

   })

   useEffect(()=>{
    if (isReadyToPrint && dadosDep) {
        imprimirDeclaracao();  // Chama a impressão apenas quando os dados são atualizados
        setIsReadyToPrint(false);  // Reseta o estado
    }

   },[isReadyToPrint,imprimirDeclaracao])

   const handlePrintClick = (item:DependentesProps) => {
    setDadosDep(item)
    setIsReadyToPrint(true)
       
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
        try {
            await toast.promise(
                api.put('/excluirDependente', {
                    id_dependente_global: dadosDep.id_dependente_global,
                    id_dependente: Number(dadosDep.id_dependente),
                    excluido: true,
                    user_exclusao: usuario?.nome,
                    exclusao_motivo: motivo
                }),
                {
                    pending: `Efetuando`,
                    success: `Dependente Exluido`,
                    error: `Erro ao Excluir`
                }
            )
            const novo = [...(dadosassociado?.dependentes??[])]
            const index = novo.findIndex(item=>item.id_dependente_global===dadosDep.id_dependente_global)
            novo.splice(index,1)
            setarDadosAssociado({...dadosassociado,dependentes:novo})
         //   await carregarDados()
           setModalExcDep(false)
            

        } catch (err) {
            console.log(err)
        }


    }


    return(
        <div className="flex flex-col   max-h-[calc(100vh-200px)]  w-full  p-2 ">
                                <div className="flex w-full mb-2 gap-2">

                                <label className="relative inline-flex w-[130px] justify-center  items-center mb-1 cursor-pointer">
                    <input disabled={!permissoes.includes('ADM1.3.1')} checked={checkDependente} onChange={() => setCheckDependente(!checkDependente)} type="checkbox" value="2" className="sr-only peer disabled:cursor-not-allowed" />
                    <div className="  w-7 h-4 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[8px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
                    <Tooltip className="z-30" id="id_dependente" />
                    <span className="ms-3 text-xs font-medium">Exibir Excluidos</span>
                </label>
        
                                     <ButtonGroup>
                                                    <Button disabled={!permissoes.includes('ADM1.3.2')} onClick={() => setModalDep(true)} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Adicionar</Button>
                                
                                                    <Button disabled={!permissoes.includes('ADM1.3.3')} onClick={() => setModalExcDep(true)} type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
                                                </ButtonGroup>
                            
                                </div>
                                <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse  text-gray-600 ">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-100 text-gray-600">
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
                                                <tr key={index} onClick={() => closeModa({ dependente: { id_dependente: item.id_dependente, nome: item.nome, excluido: item.excluido } })} className={`border-b ${item.id_dependente === data.dependente?.id_dependente ? "bg-gray-300" : "bg-gray-50"} border-gray-300  hover:bg-gray-300 text-red-500`}>
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


                                                    <td className="inline-flex px-4 py-1 text-right items-center gap-4">
                                                       
                                                       
                                                       <button onClick={e=>{e.stopPropagation(),handlePrintClick(item)}} className="text-gray-500 hover:text-blue-600">
                                                            <IoPrint size={19}/>
                                                       </button>
                                                       
                                                       
                                                        {item?.convalescenca?.convalescenca_prod?.map((dados, index) => (
                                                            dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" data-tooltip-content={dados?.descricao} className="text-yellow-500">
                                                                <TbWheelchair size={19} />
                                                            </button>

                                                        ))}
                                                    </td>
                                                </tr>) : !checkDependente && !item.excluido ? (
                                                    <tr key={index} onClick={() => setDadosDep(item)} className={` font-semibold border-b text-black ${item.id_dependente === dadosDep.id_dependente ? "bg-blue-200" : "bg-gray-50"} border-gray-300  hover:bg-gray-300`}>
                                                        <td scope="row" className="px-2 py-1  whitespace-nowrap w-full">
                                                            {item.nome}
                                                        </td>
                                                        <td className="px-8 py-1 w-full">
                                                            {new Date(item.data_adesao).toLocaleDateString()}
                                                        </td>
                                                        <td className={`px-10 py-1 w-full ${new Date(item.carencia) > new Date() ? "text-yellow-400" : ""}`}>
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
                                                                <button disabled={!permissoes.includes('ADM1.3.4')} onClick={(event) => {
                                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                                    setModalDep(true),
                                                                   setDadosDep(item)
                                                                }} className="font-medium  text-blue-500 hover:underline">Edit</button>

                                                                {item?.convalescenca?.convalescenca_prod?.map((dados, index) => (
                                                                    dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" 
                                                                    key={index} data-tooltip-content={dados?.descricao} className="text-yellow-500">
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

                                <ModalDependentes data={dadosDep} openModal={modalDep} setModal={setModalDep}/>
                                <ModalExcluirDep nome={dadosDep?.nome} excluirDep={excluirDep} openModal={modalExcluirDep} setOpenModal={setModalExcDep}/>

                                <div style={{ display: 'none' }}>
                                    <DeclaracaoExclusao 
                                    data_nasc={dadosDep?.data_nasc}
                                    bairro={dadosassociado?.bairro ?? ''}
                                    cidade={dadosassociado?.cidade ?? ''}
                                    endereco={dadosassociado?.endereco ?? ''}
                                    uf={dadosassociado?.uf ?? ''}
                                    numero={dadosassociado?.numero ?? null}
                                    grau_parentesco={dadosDep.grau_parentesco ?? ''}
                                    nome={dadosDep?.nome}
                                    cpf={dadosassociado?.cpfcnpj ?? ''}
                                    titular={dadosassociado?.nome ?? ''}
                                    contrato={dadosassociado?.contrato?.id_contrato_global ?? null}
                                    ref={componentRef}
                                        />
                                </div>
                            </div>
    )
}