import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient"
import Link from "next/link";
import { useContext, useEffect, useState } from "react"
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiAddCircleFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";

interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
}
interface ObitoProps {
    id_obitos:number,
    id_contrato: number,
    id_contrato_st: string,
    id_titular: number,
    plano: string,
    atendente: string,
    tipo_atendimento: string,
    situacao_contrato: string,
    dec_obito_num: string,
    falecido: string,
    nome_falecido: string,
    data_nascimento: Date,
    religiao: string,
    naturalidade: string,
    uf_naturalidade: string,
    profissao: string,
    nacionalidade: string,
    nome_pai: string,
    nome_mae: string,
    pai_vivo: string,
    mae_vivo: string,
    endereco_pais: string,
    endereco_mae: string,
    profissao_pai: string,
    profissao_mae: string,
    estadocivil_pai: string,
    estadocivil_mae: string,
    estado_civil: string,
    caracterista_corporal: string,
    cor: string,
    sexo: string,
    rg: string
    cpf: string,
    conjuge: string,
    t_eleitor_perg: string,
    t_eleitor: string,
    zona_seccao: string,
    secao: string,
    cidade_eleitor: string,
    cemiterio: string,
    endereco_cemiterio: string,
    end_rua: string,
    end_numero: string,
    end_bairro: string,
    end_cidade: string,
    end_uf: string,
    end_telefone: string,
    end_celular: string
    end_data_falecimento: Date,
    end_local_falecimento: string,
    end_hora_falecimento: Date,
    end_hora_informaram: Date,
    end_decl_obito: string,
    dc_laudo_med: string,
    dc_nome_medico: string,
    dc_crm: string
    rd_nome: string,
    rd_endereco: string,
    rd_numero: string,
    rd_complemento: string,
    rd_bairro: string,
    rd_cidade: string,
    rd_uf: string,
    rd_telefone: string,
    rd_celular: string,
    rd_parentesco: string,
    rd_rg: string,
    rd_profissao: string,
    custo: number
    vl_avista: number,
    vl_aprazo: number,
    vl_comissao: number,
    vl_total: number,
    saldo: number,
    cpf_cnpj: string,
    vl_servicos: number,
    vl_recebimentos: number,
    vl_saldo: number,
    vl_produtos: number,
    dt_sepultamento: Date,
    hr_sepultamento: Date,
    jazigo: string,
    local_velorio: string,
    dt_velorio: Date,
    hr_velorio: string,
    numero_velorio: string,
    bairro_velorio: string,
    complemento: string,
    cidade_velorio: string,
    uf_velorio: string,
    dt_retorno: Date,
    hr_retorno: Date,
    copeira: string,
    enfermeira: string,
    veiculo_retirada: string,
    veiculo_cortejo: string,
    ct_nome: string,
    ct_livro: string,
    ct_folha: string,
    ct_termo: string,
    ct_comarca: string,
    ct_dtreg: Date,
    ct_end: string
    ct_bairro: string,
    ct_munic: string,
    ct_tel: string,
    ct_compet: string,
    deixa_bens: string,
    deixa_testamento: string,
    nb_aposentado: string,
    certidao_casado: string,
    status: string,
    obito_itens:Array<ArrayProdutoProps>
    listacheckida: Array<CheckListProps>,
    listacheckvolta: Array<CheckListProps>,
}

interface ArrayProdutoProps {
    id_estoque:number|null
    id_produto:number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}


export default function ListarObitos() {
    const {servico,setarServico,usuario,signOut} =useContext(AuthContext)
    const [listaServicos, setServicos] = useState<Array<ObitoProps>>([])
    const[excluirObito,setExcluirObito]=useState(false)




    async function deletarObito() {

        if(!servico.id_obitos){
            toast.warn("Selecione o registro");
            return;
        }
        await toast.promise(
            api.delete("/obitos/deletar",{
                data:{
                    id_obitos:servico.id_obitos
                }
              
            }
           
            ),
           
            {
              error:'Erro ao excluir',
              pending:'Deletando.....',
              success:'Deletado com sucesso!'  
            }
        )
      await  listar()
        setExcluirObito(false)
        
    }


    useEffect(() => {
        const user = !!usuario
        if(!user){ 
           signOut()
       }
       
        try {
            listar()

        } catch (err) {
            console.log(err)
        }


    }, [usuario])

    async function listar() {

        const response = await api.get("/obitos/listarServicos")
        console.log(response.data)
        setServicos(response.data)

    }
    return (
        <>
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Histórico de O.S's</h1>
                    <div className="inline-flex rounded-md shadow-sm mb-1" role="group" >
  <Link href="/servicos/gerarOS" onClick={()=>setarServico({id_obitos:undefined,atendente:undefined,bairro_velorio:undefined,caracterista_corporal:undefined,cemiterio:undefined,certidao_casado:undefined,cidade_eleitor:undefined,cidade_velorio:undefined,
  complemento:undefined,conjuge:undefined,copeira:undefined,cpf:undefined,cpf_cnpj:undefined,ct_bairro:undefined,ct_comarca:undefined,ct_compet:undefined,ct_dtreg:undefined,ct_end:undefined,
  ct_folha:undefined,ct_livro:undefined,ct_munic:undefined,ct_nome:undefined,ct_tel:undefined,ct_termo:undefined,custo:0,data_nascimento:undefined,dc_crm:"",dc_laudo_med:undefined,
  dc_nome_medico:undefined,dec_obito_num:undefined,deixa_bens:undefined,deixa_testamento:undefined,dt_retorno:undefined,dt_sepultamento:undefined,dt_velorio:undefined,
  end_bairro:undefined,end_celular:undefined,end_cidade:undefined,end_data_falecimento:undefined,end_decl_obito:undefined,end_hora_falecimento:undefined,end_hora_informaram:undefined,
  end_local_falecimento:undefined,end_numero:undefined,end_rua:undefined,end_telefone:undefined,end_uf:undefined,endereco_cemiterio:undefined,endereco_mae:undefined,endereco_pais:undefined,enfermeira:undefined,estado_civil:undefined,estadocivil_mae:undefined,estadocivil_pai:undefined,
  falecido:undefined,hr_retorno:undefined,hr_sepultamento:undefined,hr_velorio:undefined,id_contrato:undefined,id_contrato_st:undefined,id_titular:undefined,jazigo:undefined,local_velorio:undefined,mae_vivo:undefined,nacionalidade:undefined,naturalidade:undefined,nb_aposentado:undefined,nome_falecido:undefined,nome_mae:undefined,nome_pai:undefined,numero_velorio:undefined,
  obito_itens:undefined,pai_vivo:undefined,plano:undefined,profissao:undefined,profissao_mae:undefined,profissao_pai:undefined,rd_bairro:undefined,rd_celular:undefined,rd_cidade:undefined,rd_complemento:undefined,rd_endereco:undefined,rd_nome:undefined,rd_numero:undefined,
  rd_parentesco:undefined,rd_profissao:undefined,rd_rg:undefined,rd_telefone:undefined,rd_uf:undefined,religiao:undefined,rg:undefined,saldo:undefined,secao:undefined,sexo:undefined,situacao_contrato:undefined,status:undefined,t_eleitor:undefined,t_eleitor_perg:undefined,tipo_atendimento:undefined,
  uf_naturalidade:undefined,uf_velorio:undefined,veiculo_cortejo:undefined,veiculo_retirada:undefined,vl_aprazo:undefined,vl_avista:undefined,vl_comissao:undefined,vl_produtos:undefined,vl_recebimentos:undefined,
   vl_saldo:undefined,vl_servicos:undefined,vl_total:undefined,zona_seccao:undefined    
  })} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
 <RiAddCircleFill size={20}/>
    Adicionar
  </Link>
  <button type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
    Settings
  </button>
  <button onClick={()=>setExcluirObito(!excluirObito)} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   <MdDeleteForever size={20}/>
    Excluir
  </button>
  {excluirObito?( <div  className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="flex items-center justify-center p-2 w-full h-full">
        <div className="relative rounded-lg shadow bg-gray-800">
            <button type="button" onClick={()=>setExcluirObito(!excluirObito)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
             <button  type="button" onClick={()=>{}} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
                </button>
            </button>
            <div className="p-4 md:p-5 text-center">
                <div className="flex w-full justify-center items-center">
                  <TbAlertTriangle className='text-gray-400' size={60}/>
                </div>
                <h3 className="mb-3 text-lg font-normal  text-gray-400">{`Realmente deseja deletar?`}</h3>
               
                <button onClick={()=>deletarObito()} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                    Sim, tenho certeza
                </button>
                <button onClick={()=>setExcluirObito(!excluirObito)}  type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
            </div>
        </div>
    </div>
</div>):''}
</div>
                </div>
                <div className="flex p-1 w-full max-h-[calc(100vh-150px)] justify-center">{/*DIV DA TABELA*/}
                    <table
                        className="block  w-full overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                        <thead className="sticky top-0 text-xs  uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th scope="col" className=" px-4 py-1 whitespace-nowrap">
                                    Tipo
                                </th>

                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    Data Fal.
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    Contrato
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    Nome Decl.
                                </th>
                              
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    Nome Falecido
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >Situação Cont.</span>
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >Falecido</span>
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >Data Nasc.</span>
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >Valor Total</span>
                                </th> 
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >STATUS</span>
                                </th>
                                <th scope="col" className="px-2 py-1 whitespace-nowrap">
                                    <span >Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaServicos?.map((item, index) => {
                                return (
                                <tr onClick={()=>setarServico({id_obitos:item.id_obitos})} key={index} className={`border-b  border-gray-700 ${item.id_obitos===servico.id_obitos?"bg-gray-600":"bg-gray-800"} hover:bg-gray-600 text-center`}>
                                    <td className="px-2 py-1">
                                        {item.tipo_atendimento}
                                    </td>
                                    <td className="px-2 py-1">
                                        {new Date(item.end_data_falecimento).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.id_contrato}
                                    </td>
                                    <td className="px-2 py-1 whitespace-nowrap w-full text-start ">
                                        {item.rd_nome}
                                    </td>
                                   
                                    <td className="px-2 py-1 whitespace-nowrap w-full text-start">
                                        {item.nome_falecido}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.id_contrato_st}
                                    </td>
                                    <td className="px-2 py-1  ">
                                        {item.falecido}
                                    </td>
                                    <td className="px-2 py-1">
                                        {new Date(item.data_nascimento).toLocaleDateString()}
                                    </td>
                                    <td className="px-2 py-1">
                                        {item.vl_total && `R$${item.vl_total}`}
                                    </td>
                                    <td className={`px-2 py-1 font-semibold ${item.status ==='PENDENTE'?"text-red-600":"text-green-600"} `}>
                                        {item.status}
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                    <div className="flex flex-row w-full gap-2">
                                        <Link
                                           onClick={()=>setarServico({...item})}
                                             data-tooltip-id="toolId"
                                              data-tooltip-content={'Editar Dados'} 
                                              className="text-yellow-500 hover:bg-yellow-500 p-1 rounded-lg hover:text-white"
                                              href='/servicos/gerarOS'>
                                                <LuFolderEdit size={18} />
                                            </Link>
                                            
                                            <button data-tooltip-id="toolId" data-tooltip-content={'Excluir'} onClick={()=>{}} className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white">
                                                <MdDeleteOutline size={18} />
                                            </button>
                                            
                                        </div>
                                    
                                    </td>
                                </tr>)
                            })}

                        </tbody>
                    </table>
                </div>

            </div>
        </>

    )
}