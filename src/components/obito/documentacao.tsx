import { useReactToPrint } from "react-to-print"
import OrdemServico from "@/Documents/obito/OrdemServico"
import { useRef } from "react"
import AutTanato from "@/Documents/obito/Tanato"





interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
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

interface DadosProps{
    servico:Partial<ObitoProps>
}



export default function DocumentacaoOS({servico}:DadosProps) {
    const componentRefOs = useRef<OrdemServico>(null);
    const componentRefTanato =useRef<AutTanato>(null)


    const imprimirOS = useReactToPrint({
        content:()=>componentRefOs.current
    })
    const imprimirTanato =useReactToPrint({
        content:()=>componentRefTanato.current
    })
  return (
    <div className='inline-flex w-full text-white p-2 gap-6'>
        <button onClick={()=>imprimirOS()} className='bg-blue-500 rounded-lg p-1'>FICHA DE ATENDIMENTO</button>
        <button onClick={()=>imprimirTanato()} className='bg-green-500 rounded-lg p-1'>TANATO</button>










        <div className="hidden">
            <OrdemServico
            atendente={servico.atendente??''}
            bairro_dec={servico.rd_bairro??''}
            bairro_falecido={servico.end_bairro??''}
            cemiterio={servico.cemiterio??''}
            cidade_dec={servico.rd_cidade??''}
            cidade_falecido={servico.end_cidade??''}
            contrato={Number(servico.id_contrato)}
            cpf_dec={servico.cpf_cnpj??''}
            crm={servico.dc_crm??''}
            data_falecimento={servico.end_data_falecimento}
            data_nasc_falecido={servico.data_nascimento}
            data_sepultamento={servico.dt_sepultamento}
            endereco_dec={servico.rd_endereco}
            endereco_falecido={servico.end_rua}
            estado_civil={servico.estado_civil}
            falecido={servico.falecido}
            hora_falecimento={servico.end_hora_falecimento}
            hora_sepultamento={servico.hr_sepultamento}
            inumado={servico.jazigo}
            laudo_medico={servico.dc_laudo_med}
            local_falecimento={servico.end_local_falecimento}
            medico={servico.dc_nome_medico}
            naturalidade_falecido={servico.naturalidade}
            nome_dec={servico.rd_nome}
            nome_falecido={servico.nome_falecido}
            nome_mae={servico.nome_mae}
            nome_pai={servico.nome_pai}
            numero_dec={Number(servico.rd_numero)}
            numero_falecido={Number(servico.end_numero)}
            observacoes={servico.caracterista_corporal}
            plano={servico.plano}
            profissao={servico.profissao}
            religiao={servico.religiao}
            situacao={servico.situacao_contrato}
            tipo_atendimento={servico.tipo_atendimento}
            uf_dec={servico.rd_uf}
            uf_falecido={servico.end_uf}
            
            ref={componentRefOs}
            />
        </div>
    </div>
  )
}
