import { ReactNode,createContext,useState } from 'react';
import {api} from "../services/apiClient"
import {destroyCookie,setCookie,parseCookies} from "nookies"
import Router from 'next/router';

type DependentesProps={
    nome:string,
    data_nasc:Date,
    grau_parentesco:string,
    data_adesao:Date,
    carencia:Date,
    id_dependente:number
}
type MensalidadeProps={
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    close:boolean,
    status:string,
    usuario:string,
    id_mensalidade:number,
    valor_total:number,
    motivo_bonus: string,
    data_pgto:Date | string,
    referencia:string
}
type DadosCadastro={
    
    name:string,
    nasc:string,
    sexo:string,
    cep:string,
    endereco:string,
    numero:string,
    bairro:string, 
    referencia:string,
    cidade:string,
    uf:string,
    email:string,
    rg:string,
    cpf:string,
    closeModalPlano:boolean,
    closeModalCadastro:boolean
    arraydep:Array<Partial<DependentesProps>> ,
    naturalidade:string,
    celular1:string,
    celular2:string,
    telefone:string,
    contrato:Partial<ContratoProps>,
    origem:string,
    planos:Array<PlanosProps>
    id_associado:number,
    mensalidade:Partial<MensalidadeProps>
    mensalidadeAnt:Partial<MensalidadeProps>
    mensalidadeProx:Partial<MensalidadeProps>,
}
type PlanosProps={
    id_Plano:number,
    descricao:string,
    valor:string
}

type ContratoProps={
id_contrato:number,
plano:string,
id_plano:number,
valor_mensalidade:number,
dt_adesao:string,
dt_carencia:string,
situacao:string,
consultor:string,
cobrador:string,
data_vencimento:string,
n_parcelas:number,
origem:string,
supervisor:string

}

type AssociadoProps={
nome:string,
id_associado:number,
endereco:string,
bairro:string,
numero:number,
cidade:string,
guia_rua:string,
uf:string,
mensalidade:Array<MensalidadeProps>,
contrato:ContratoProps,
dependentes:Array<DependentesProps>
}
type AuthContextData = {
    usuario:UserProps | undefined,
    isAuthenticated:boolean,
    sign: (credentials:SignInProps)=>Promise<void>,
    signOut:()=>void,
    closeModa:(fields:Partial<DadosCadastro>)=>void,
    data:Partial<DadosCadastro>,
    dadosassociado:AssociadoProps | undefined,
    carregarDados:()=>Promise<void>
}

type SignInProps={
    nome:string,
    password:string,
}
type UserProps ={
    id:string,
    nome:string,
}

export const AuthContext = createContext({} as AuthContextData)
export function signOut(){
    try{
        destroyCookie(undefined,'@nextauth.token')
        Router.push('/')
    }catch(err){
console.log("erro ao deslogar")
    }
}

export function AuthProvider({children}:{children:ReactNode}){
    const [usuario,setUser] =useState<UserProps>()
    const isAuthenticated = !!usuario;
    const [dadosassociado,setDadosAssociado]=useState<AssociadoProps>()  
    const [data,setData] =useState<Partial<DadosCadastro>>({})
async function sign({nome,password}:SignInProps) {
    try{
        const response = await api.post('/session',{
            nome,
            password
        })
        
        const {id,token} = response.data
       setCookie(undefined,'@nextauth.token',token,{
        maxAge:60*60*24*30, // expirar em 1 mes
        path:"/" // quais caminhos terão acesso ao cookie
       })
       setUser({id,nome})
       // Passar o token para as proximas paginas
       api.defaults.headers["Authorization"] =`Bearer ${token}`
       //redirecionar o user para /dashboard
       Router.push("/testeside")

    }catch(err){
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


async function carregarDados(){
    const response = await api.post('/associado',{
             id_associado:Number(data.id_associado)
         });
     setDadosAssociado(response.data);
   }
  return(
    <AuthContext.Provider value={{usuario,isAuthenticated,sign,signOut,data,closeModa,dadosassociado,carregarDados}}>
        {children}
    </AuthContext.Provider>
  )
}