import { ReactNode, createContext, useState } from 'react';
import { api } from "../services/apiClient"
import { destroyCookie, setCookie, parseCookies } from "nookies"
import Router from 'next/router';
import { decode } from 'jsonwebtoken'
import { toast } from 'react-toastify';


type CidadesProps = {
    id_cidade: number,
    estado: number,
    uf: string,
    cidade: string
}
interface PermissoesProps{
    nome:string,
    val:boolean,
    tela:string
}

type CaixaProps = {
    num_seq: number | null,
    conta: string,
    conta_n: string,
    descricao: string,
    historico: string,
    ccustos_desc: string,
    valor: number | null,
    usuario: string,
    data: Date,
    id_grupo:number|null,
    tipo: string,
    datalanc: Date,
    notafiscal: string
}


type DependentesProps = {
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
    convalescenca:{
        convalescenca_prod:Partial<{
            id_conv:number,
            id_produto:number,
            descricao:string,
            unidade:string,
            grupo:string,
            data:Date,
            data_dev:Date,
            quantidade:number,
            valor:number,
            descontos:number,
            total:number,
            hora:Date,
            cortesia:string,
            retornavel :string,
            status :string
        }>,
    }
}
type MensalidadeProps = {
    id_usuario:number,
    id_contrato:number,
    estorno_dt:Date,
    estorno_user:string,
    dt_exclusao:Date,
  exclusao_motivo:string,
  user_exclusao:string,
  associado:string,
  n_doc:string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number,
    id_acordo: number

}
type DadosCadastro = {

    name: string,
    nasc: string,
    sexo: string,
    cep: string,
    endereco: string,
    numero: number,
    bairro: string,
    referencia: string,
    cidade: string,
    uf: string,
    email: string,
    rg: string,
    cpf: string,
    closeModalPlano: boolean,
    closeModalCadastro: boolean
    arraydep: Array<Partial<DependentesProps>>,
    dependente: Partial<DependentesProps>,
    naturalidade: string,
    celular1: string,
    celular2: string,
    telefone: string,
    contrato: Partial<ContratoProps>,
    origem: string,
    profissao: string,
    planos: Array<Partial<PlanosProps>>
    cidades: Array<Partial<CidadesProps>>
    id_associado: number,
    mensalidade: Partial<MensalidadeProps>
    mensalidadeAnt: Partial<MensalidadeProps>
    mensalidadeProx: Partial<MensalidadeProps>,
    closeEditarAssociado: boolean,
    acordo: Partial<AcordoProps>
}
type PlanosProps = {
    id_plano: number,
    descricao: string,
    valor: number
}

type ContratoProps = {
    id_contrato: number,
    plano: string,
    id_plano: number,
    valor_mensalidade: number,
    dt_adesao: Date,
    dt_carencia: Date,
    situacao: string,
    anotacoes: string,
    consultor: string,
    cobrador: string,
    data_vencimento: Date,
    n_parcelas: number,
    origem: string,
    supervisor: string,
    convalescencia:Array<ConvProps>,
    categoria_inativo:string,
    motivo_inativo:string,
    dt_cancelamento:true,
                

    



}
type AcordoProps = {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo:string
    closeAcordo: boolean,
    id_acordo: number,
    visibilidade: boolean
}

type AssociadoProps = {
    nome: string,
    data_nasc: Date,
    sexo: string,
    celular1: string, celular2: string, telefone: string,
    id_associado: number,
    endereco: string,
    bairro: string,
    numero: number,
    cidade: string,
    cep: string,
    cpf: string, rg: string
    email: string,
    profissao: string,
    guia_rua: string,
    uf: string,
    mensalidade: Array<MensalidadeProps>,
    contrato: ContratoProps,
    dependentes: Array<DependentesProps>
    acordo: Array<AcordoProps>
   
}
type AuthContextData = {
    usuario: UserProps | undefined,
    isAuthenticated: boolean,
    sign: (credentials: SignInProps) => Promise<void>,
    signOut: () => void,
    closeModa: (fields: Partial<DadosCadastro>) => void,
    setarServico: (fields:Partial<ObitoProps>) =>void,
    servico:Partial<ObitoProps>,
    caixaMovimentacao: (fields: Partial<CaixaProps>) => void,
    mov: Partial<CaixaProps>,
    data: Partial<DadosCadastro>,
    dadosassociado: AssociadoProps | undefined,
    carregarDados: () => Promise<void>,
    setarListaConv:(fields:Partial<ConvProps>)=>void,
    listaConv:Partial<ConvProps>,
     user:()=>void
}

type SignInProps = {
    user: string,
    password: string,
}
type UserProps = {
    id: string,
    nome: string,
    cargo: string,
    dir: string,
   image:string,
   permissoes:Array<PermissoesProps>

}
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
    listacheckida: Array<CheckListProps>,
    listacheckvolta: Array<CheckListProps>,
    obito_itens:Array<Partial<ArrayProdutoProps>>
}


interface ArrayProdutoProps {
    id_produto:number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}
interface ConvProps {
    editar:boolean
    id_conv: number | null,
    id_contrato: number|null,
    id_associado: number|null,
    id_dependente:number|null,
    id_contrato_st:string,
    tipo_entrada: string,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number|null,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number|null,
    descontos: number|null,
    total: number|null,
    logradouro_r: string,
    numero_r: number|null,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string,
    convalescenca_prod:Partial<{
        id_conv:number,
        id_produto:number,
        descricao:string,
        unidade:string,
        grupo:string,
        data:Date,
        data_dev:Date,
        quantidade:number,
        valor:number,
        descontos:number,
        total:number,
        hora:Date,
        cortesia:string,
        retornavel :string,
        status :string
    }>,
    contrato:{
        situacao:string,
        carencia:string,
        associado:{
            nome:string
        }

    }

}

export const AuthContext = createContext({} as AuthContextData)
export  function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (err) {
        console.log("erro ao deslogar")
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUser] = useState<UserProps>()
    const isAuthenticated = !!usuario;
    const [listaConv,setLista] = useState<Partial<ConvProps>>({convalescenca_prod:{}})
    const [dadosassociado, setDadosAssociado] = useState<AssociadoProps>()
    const [data, setData] = useState<Partial<DadosCadastro>>({})
    const [mov, setMov] = useState<Partial<CaixaProps>>({})
    const [servico,setServico] = useState<Partial<ObitoProps>>({hr_sepultamento:new Date(),end_hora_falecimento:new Date(),end_hora_informaram:new Date()})
    
    
    
    
    
    
    async function sign({ user, password }: SignInProps) {
        let response
        try {
            response = await api.post('/session', {
                usuario: user,
                password
            })
                console.log(response.data)
            const { id, token, cargo, dir, nome,image,permissoes } = response.data
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 1, // expirar em 1 dia
                path: "/" // quais caminhos terão acesso ao cookie
            })
            setUser({ id, nome: nome.toUpperCase(), cargo, dir,image,permissoes })
            
            // Passar o token para as proximas paginas
            api.defaults.headers["Authorization"] = `Bearer ${token}`
            //redirecionar o user para /dashboard
            Router.push("/admcontrato")

        } catch (err) {
//toast.error(err.response.data.error)
toast.error('Erro no Login')
console.log(err)


        }
    }




    function closeModa(fields:Partial<DadosCadastro>) {
        setData((prev:Partial<DadosCadastro>) => {
            if (prev) {
                return { ...prev, ...fields };
            } else {
                return { ...fields };
            }
        });
    }

    function setarServico(fields: Partial<ObitoProps>) {
        setServico((prev: Partial<ObitoProps>) => {
            if (prev) {
                return { ...prev, ...fields };
            } else {
                return { ...fields };
            }
        });
    }


    function setarListaConv(fields:Partial<ConvProps>){

        setLista((prev:Partial<ConvProps>)=>{
            if(prev){
                return {...prev,...fields};
            }
            else{
                return {...fields};
            }

        })

    }
     function user(){
        const cookies = parseCookies();
        try {
            if(cookies['@nextauth.token']){
                const token = cookies['@nextauth.token'];
                const decodeToken = decode(token);
                if(decodeToken && typeof decodeToken === 'object'){
                    const {nome,sub,dir,cargo,permissoes} = decodeToken;
                    setUser({id:String(sub),nome:nome.toUpperCase(),cargo,dir,image:'',permissoes})
                }
            }
            
        } catch (error) {
            toast.error('Erro ao captar Usuário')
            
        }
     
     }

    function caixaMovimentacao(fields: Partial<CaixaProps>) {
        setMov((prev: Partial<CaixaProps>) => {
            if (prev) {
                return { ...prev, ...fields };
            } else {
                return { ...fields };
            }
        });
    }


    async function carregarDados() {
        try {
            const response = await api.post('/associado', {
                id_associado: Number(data.id_associado)
            })
           
            setDadosAssociado(response.data);
            console.log(response.data)
            
        } catch (error) {
            toast.error('Erro na requisição')
        }
     
    }
    return (
        <AuthContext.Provider value={{user, usuario, isAuthenticated, sign, signOut, data, closeModa, dadosassociado, carregarDados, caixaMovimentacao, mov,setarServico,servico,listaConv,setarListaConv }}>
            {children}
        </AuthContext.Provider>
    )
}