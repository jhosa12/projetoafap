import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient"
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
import { Button, Table } from "flowbite-react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi2";

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
                    <h1 className="flex w-full  text-gray-50 font-semibold text-2xl ">Histórico de O.S's</h1>
                   
                    <Button color={'light'} size={'sm'} as={Link} href="/servicos/gerarOS">

 <RiAddCircleFill  className="mr-2" size={20}/>
    Adicionar

 </Button>
 


                </div>
                <div className="flex p-1 w-full justify-center overflow-x-auto max-h-[calc(100vh-150px)]">{/*DIV DA TABELA*/}
                    <Table
                        hoverable theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-gray-700" } } }}>
                        <Table.Head>
                         
                                <Table.HeadCell >
                                    Tipo
                                </Table.HeadCell>

                                <Table.HeadCell >
                                    Data Fal.
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    Contrato
                                </Table.HeadCell>
                                <Table.HeadCell >
                                    Nome Decl.
                                </Table.HeadCell>
                              
                                <Table.HeadCell >
                                    Nome Falecido
                                </Table.HeadCell>
                                <Table.HeadCell >
                                   Situação Cont.
                                </Table.HeadCell>
                                <Table.HeadCell >
                                   Falecido
                                </Table.HeadCell>
                                <Table.HeadCell >
                                   Data Nasc.
                                </Table.HeadCell>
                            
                                <Table.HeadCell >
                                   STATUS
                                </Table.HeadCell>
                                <Table.HeadCell >
                                   Ações
                                </Table.HeadCell>
                         
                        </Table.Head>
                        <Table.Body>
                            {listaServicos?.map((item, index) => {
                                return (
                                <Table.Row onClick={()=>setarServico({id_obitos:item.id_obitos})} key={index} >
                                    <Table.Cell >
                                        {item.tipo_atendimento}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(item.end_data_falecimento).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.id_contrato}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap" >
                                        {item.rd_nome}
                                    </Table.Cell>
                                   
                                    <Table.Cell className="whitespace-nowrap" >
                                        {item.nome_falecido}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.id_contrato_st}
                                    </Table.Cell>
                                    <Table.Cell >
                                        {item.falecido}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(item.data_nascimento).toLocaleDateString()}
                                    </Table.Cell>
                                   
                                    <Table.Cell className={` font-semibold ${item.status ==='PENDENTE'?"text-red-600":"text-green-600"} `}>
                                        {item.status}
                                    </Table.Cell>
                                    <Table.Cell className="inline-flex space-x-3" >
                               
                 
                                        <Link
                                           onClick={()=>setarServico({...item})}
                                             data-tooltip-id="toolId"
                                              data-tooltip-content={'Editar Dados'} 
                                             className="hover:text-blue-500"
                                              href='/servicos/gerarOS'>
                                                <HiPencil size={18} />
                                            </Link>
                                            
                                            <button data-tooltip-id="toolId" data-tooltip-content={'Excluir'} 
                                            className="hover:text-red-500"
                                            onClick={()=>{}}>
                                            <HiOutlineTrash size={20} />
                                            </button>
                                            
                                    
                                    
                                    </Table.Cell>
                                </Table.Row>)
                            })}

                        </Table.Body>
                    </Table>
                </div>

            </div>
        </>

    )
}