import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/apiClient"
import { useContext, useState } from "react"
import { IoIosClose } from "react-icons/io"
import { MdDeleteForever } from "react-icons/md"
import { RiAddCircleFill } from "react-icons/ri"
import { TbAlertTriangle, TbWheelchair } from "react-icons/tb"
import { toast } from "react-toastify"
import { Tooltip } from "react-tooltip"
import { ModalDependentes } from "./modalDependentes"
import { ModalExcluirDep } from "./modalExcluir"




export function Dependentes(){
    const [checkDependente, setCheckDependente] = useState(false)
    const {closeModa,dadosassociado,data,usuario,setarDadosAssociado,permissoes} =useContext(AuthContext)
    const [modalExcluirDep, setModalExcDep] = useState(false)
    const [modalDep,setModalDep] = useState<boolean>(false)



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
            const novo = [...(dadosassociado?.dependentes??[])]
            const index = novo.findIndex(item=>item.id_dependente===data.dependente?.id_dependente)
            novo.splice(index,1)
            setarDadosAssociado({...dadosassociado,dependentes:novo})
         //   await carregarDados()
           setModalExcDep(false)
            

        } catch (err) {
            console.log(err)
        }


    }


    return(
        <div className="flex flex-col rounded-lg  max-h-[calc(100vh-200px)]  max-w-[calc(100vw-350px)]  p-4 shadow-md sm:rounded-lg">
                                <div className="flex w-full mb-2 gap-2">
                                    <label className="relative inline-flex w-[150px] justify-center  items-center mb-1 cursor-pointer">
                                        <input disabled={!permissoes.includes('ADM1.3.1')} checked={checkDependente} onChange={() => setCheckDependente(!checkDependente)} type="checkbox" value="2" className="sr-only peer" />
                                        <div className="w-9 h-5 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[9px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>

                                        <Tooltip className="z-30" id="id_dependente" />

                                        <span className="ms-2 text-sm font-medium whitespace-nowrap ">Exibir Excluidos</span>
                                    </label>
                                    <div className="inline-flex rounded-md shadow-sm mb-1" role="group" >
                                        <button disabled={!permissoes.includes('ADM1.3.2')} onClick={() => closeModa({ dependente: {  saveAdd: false } })} type="button" className=" disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed inline-flex items-center px-4 py-1  bg-gray-200 border-gray-400  gap-1 text-sm font-medium  border  rounded-s-lg   enable:hover:text-white hover:bg-gray-400  ">
                                            <RiAddCircleFill size={20} />
                                            Adicionar
                                        </button>
                                        <button type="button"  className=" disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed inline-flex items-center px-4 py-1  bg-gray-200 border-gray-400  gap-1 text-sm font-medium  border enable:hover:text-white hover:bg-gray-400  ">
                                            Settings
                                        </button>
                                        <button disabled={!permissoes.includes('ADM1.3.3')} onClick={() => setModalExcDep(true)} type="button"  className=" disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed inline-flex items-center px-4 py-1  bg-gray-200 border-gray-400  gap-1 text-sm font-medium  border  rounded-e-lg   enable:hover:text-white hover:bg-gray-400  ">
                                            <MdDeleteForever size={20} />
                                            Excluir
                                        </button>
                                   
                                    </div>
                                </div>
                                <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-600 ">
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
                                                <tr key={index} onClick={() => closeModa({ dependente: { id_dependente: item.id_dependente, nome: item.nome, excluido: item.excluido } })} className={`border-b ${item.id_dependente === data.dependente?.id_dependente ? "bg-gray-400" : "bg-gray-50"} border-gray-300  hover:bg-gray-300 text-red-500`}>
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
                                                        <button disabled={!permissoes.includes('ADM1.3.4')} onClick={(event) => {
                                                            event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                            setModalDep(true),
                                                            closeModa(
                                                                {
                                                                    dependente: {
                                                                        saveAdd: true,
                                                                      
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
                                                        {item?.convalescenca?.convalescenca_prod?.map((dados, index) => (
                                                            dados?.status === 'ABERTO' && <button data-tooltip-id="id_dependente" data-tooltip-content={dados?.descricao} className="text-yellow-500">
                                                                <TbWheelchair size={19} />
                                                            </button>

                                                        ))}
                                                    </td>
                                                </tr>) : !checkDependente && !item.excluido ? (
                                                    <tr key={index} onClick={() => closeModa({ dependente: { id_dependente: item.id_dependente, nome: item.nome, excluido: item.excluido } })} className={`border-b ${new Date(item.carencia) > new Date() ? "text-yellow-500" : ""} ${item.id_dependente === data.dependente?.id_dependente ? "bg-gray-400" : "bg-gray-50"} border-gray-300  hover:bg-gray-300`}>
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
                                                                <button disabled={!permissoes.includes('ADM1.3.4')} onClick={(event) => {
                                                                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                                                    setModalDep(true),
                                                                    closeModa(
                                                                        {
                                                                            dependente: {
                                                                                saveAdd: true,
                                                                               
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

                                <ModalDependentes openModal={modalDep} setModal={setModalDep}/>
                                <ModalExcluirDep excluirDep={excluirDep} openModal={modalExcluirDep} setOpenModal={setModalExcDep}/>
                            </div>
    )
}