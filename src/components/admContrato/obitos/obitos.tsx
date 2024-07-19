
import DocumentTemplate from "@/Documents/carteiraAssociado/DocumentTemplate";
import { IoPrint } from "react-icons/io5";
import {useReactToPrint} from "react-to-print";

interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
}
interface ArrayProdutoProps {
    id_ob_itens:number|null
    id_produto: number | null,
    id_estoque:number|null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface ObitoProps {
    id_obitos: number,
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
    listacheckida: Array<CheckListProps>,
    listacheckvolta: Array<CheckListProps>,
    obito_itens: Array<Partial<ArrayProdutoProps>>
}




interface DadosProps{
    obitos:Array<Partial<ObitoProps>>,
   
  }









export default function ObitosAssociado({obitos}:DadosProps){
   
    
    
    return (
        <div className="flex flex-col w-full p-2">
            <div className="flex p-2">
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>{}} type="checkbox" checked />
            <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">CARTEIRA TITULAR</label>
            </div>
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>{}} type="checkbox" checked />
            <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS DEPENDENTES</label>
            </div>
            <button onClick={()=>{}} className="flex p-1 rounded-lg justify-center bg-gray-500 gap-1 items-center text-xs z-40 text-white"><IoPrint size={18}/> PRINT</button>
            </div>
            <div className="flex max-h-[calc(100vh-250px)]" id="DIV DA TABELA">
            <table
                                    className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                    <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
                                       <tr>
                                            <th scope="col" className=" px-2 py-1">
                                                FALECIDO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                NOME
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                DATA NASC.
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                DATA FALECIMENTO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                HORA FALECIMENTO
                                            </th>
                                            <th scope="col" className="px-12 py-1">
                                                LOCAL FALECIMENTO
                                            </th>
                                            <th scope="col" className="px-4 py-1">
                                                <span className="">Ações</span>
                                            </th>
                                        </tr>
                                      </thead> 
                                      <tbody>
                                        {obitos.map((item,index)=>(
                                            <tr  className={`cursor-pointer hover:bg-gray-500 text-white border-b  bg-gray-800 border-gray-700`}>
                                            <th scope="row" className="px-2 py-1 font-medium  whitespace-nowrap">{item.falecido}</th>
                                            <td className="px-12 py-1">
                                            {item.nome_falecido}
                                        </td>
                                            <td className="px-12 py-1">
                                                        {item.data_nascimento
                                                         && new Date(item.data_nascimento).toLocaleDateString()}
                                                    </td>
                                          
                                        <td className="px-12 py-1">
                                        {item.end_data_falecimento
                                                         && new Date(item.end_data_falecimento).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-12 py-1">
                                                        {item.end_hora_falecimento && new Date(item.end_hora_falecimento).toLocaleTimeString()}
                                                    </td>
                                                    <td className="px-12 py-1">
                                        {item.end_local_falecimento}
                                                    </td>
                                                    <td className="px-12 py-1">

                                                    { 
                                                             <button onClick={(event)=>{event.stopPropagation()}} className="object-contain z-40 text-blue-500"><IoPrint size={18}/></button>
                                                     
                                                     }
                                                     
                                                    </td>
                                                   
                                                  

                                        </tr>
                                        ))}
                                      </tbody>
                                      </table>
                                      <div className="hidden">
        

            </div>

            </div>

        
        
    
 


        </div>
    )
}