import { ReactNode, createContext, useState } from 'react';
import { api } from "../services/apiClient"
import { destroyCookie, setCookie, parseCookies } from "nookies"
import Router from 'next/router';
import { decode } from 'jsonwebtoken'

type CidadesProps = {
    id_cidade: number,
    estado: number,
    uf: string,
    cidade: string
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
    data: Date
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
    exclusao_motivo: string
}
type MensalidadeProps = {

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
    supervisor: string

}
type AcordoProps = {
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string
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
    caixaMovimentacao: (fields: Partial<CaixaProps>) => void,
    mov: Partial<CaixaProps>,
    data: Partial<DadosCadastro>,
    dadosassociado: AssociadoProps | undefined,
    carregarDados: () => Promise<void>
    // user:()=>void
}

type SignInProps = {
    user: string,
    password: string,
}
type UserProps = {
    id: string,
    nome: string,
    cargo: string,
    dir: string

}

export const AuthContext = createContext({} as AuthContextData)
export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (err) {
        console.log("erro ao deslogar")
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUser] = useState<UserProps>()
    const isAuthenticated = !!usuario;
    const [dadosassociado, setDadosAssociado] = useState<AssociadoProps>()
    const [data, setData] = useState<Partial<DadosCadastro>>({})
    const [mov, setMov] = useState<Partial<CaixaProps>>({})
    async function sign({ user, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                usuario: user,
                password
            })

            const { id, token, cargo, dir, nome } = response.data
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 1, // expirar em 1 dia
                path: "/" // quais caminhos terão acesso ao cookie
            })
            setUser({ id, nome: nome.toUpperCase(), cargo, dir })
            // Passar o token para as proximas paginas
            api.defaults.headers["Authorization"] = `Bearer ${token}`
            //redirecionar o user para /dashboard
            Router.push("/admcontrato")

        } catch (err) {
            console.log("Erro ao acessar", err)

        }
    }
    function closeModa(fields: Partial<DadosCadastro>) {
        setData((prev: Partial<DadosCadastro>) => {
            if (prev) {
                return { ...prev, ...fields };
            } else {
                return { ...fields };
            }
        });
    }
    /* function user(){
        const cookies = parseCookies();
        if(cookies['@nextauth.token']){
            const token = cookies['@nextauth.token'];
            const decodeToken = decode(token);
            if(decodeToken && typeof decodeToken === 'object'){
                const {nome,sub,dir,cargo} = decodeToken;
                setUser({id:String(sub),nome:nome.toUpperCase(),cargo,dir})
            }
        }
     }*/

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
        const response = await api.post('/associado', {
            id_associado: Number(data.id_associado)
        })

        setDadosAssociado(response.data);
    }
    return (
        <AuthContext.Provider value={{ usuario, isAuthenticated, sign, signOut, data, closeModa, dadosassociado, carregarDados, caixaMovimentacao, mov }}>
            {children}
        </AuthContext.Provider>
    )
}