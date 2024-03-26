





interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
}
interface ObitoProps{
    id_contrato: number,
    id_contrato_st: string,
    id_titular: number,
    plano: string,
    atendente: string,
    tipo_atendimento: string,
    situacao_contrato: string,
    dec_obito_num:string,
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
    status:string,
    listacheckida: Array<CheckListProps>,
    listacheckvolta:Array<CheckListProps>,
}


export default function ListarObitos(){

    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Histórico de O.S's</h1>
                    </div>
                <div>{/*DIV DA TABELA*/}
                <table
                                className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                                    <tr>
                                        <th scope="col" className=" px-2 py-1">
                                           Tipo
                                        </th>

                                        <th scope="col" className="px-4 py-1">
                                            Data Falecimento
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                           Contrato
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Nome Declarante
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            CPF/CNPJ
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Nome Falecido
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            <span >Situação Contrato</span>
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            <span >Falecido</span>
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            <span >Data Nascimento</span>
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            <span >Valor Total</span>
                                        </th>
                                    </tr>
                                </thead>
                              

                          

                            </table>



                </div>

                    </div>
        </>

    )
}