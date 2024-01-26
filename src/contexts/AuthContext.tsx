import { ReactNode,createContext,useState } from 'react';
import {api} from "../services/apiClient"
import {destroyCookie,setCookie,parseCookies} from "nookies"
import Router from 'next/router';
import produce from 'immer';
type DependentesProps={
    nome:string,
    data_nasc:string,
    grau_parentesco:string,
    data_adesao:string,
    carencia:string,
    id_dependente:number
}
type MensalidadeProps={
    np:number,
    vencimento:string,
    cobranca:string,
    valor:number,
    close:boolean,
    status:string,
    baixada_por:string,
    agendada_por:string,
    id_mensalidade:number,
    valor_total:number,
   
    

}
type DadosCadastro={
    
    name:string,
    nasc:string,
    sexo:string,
    cep:string,
    endereço:string,
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
    contrato:number,
    origem:string,
    plano:string,
    valor:string,
    cobrador:string,
    consultor:string,
    supervisor:string,
    np:number,
    dtvenc:string,
    dtadesao:string,
    dtcarencia:string,
    id_associado:number,
    mensalidade:Partial<MensalidadeProps>
    mensalidadeAnt:Partial<FormData>
    mensalidadeProx:Partial<FormData>,
    
    
}


  type FormData={
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    valor_total:number
    status:string,
    usuario:string,
    data_pgto:Date,
    id_mensalidade:number
}
type ContratoProps={
id_contrato:number,
plano:string,
valor_mensalidade:number,
dt_adesao:string,
dt_carencia:string,
situacao:string
}


type AssociadoProps={
nome:string,
endereco:string,
bairro:string,
numero:number,
cidade:string,
guia_rua:string,
uf:string,
mensalidade:Array<FormData>,

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
    const [data,setData] =useState<Partial<DadosCadastro>>({
        arraydep:[],
        bairro:'',
        celular1:'',
        email:'',
        mensalidade:{ agendada_por:'',baixada_por:'',close:false,cobranca:'',id_mensalidade:0,np:0,status:'',valor:0,valor_total:0,vencimento:''},
        cep:'',
        cidade:'',
        closeModalCadastro:false,
        closeModalPlano:false,
        cobrador:'',
        consultor:'',
        contrato:0,
        cpf:'',
        dtadesao:'',
        dtcarencia:'',
        dtvenc:'',
        endereço:'',
        id_associado:0,
        mensalidadeAnt:{},
        name:'',
        nasc:'',
        naturalidade:'',
        np:0,
        numero:'',
        origem:'',
        plano:'',
        referencia:'',
        rg:'',
        sexo:'',
        supervisor:'',
        telefone:'',
        uf:'',
        valor:'',
       
    })
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