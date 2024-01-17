import { ReactNode,createContext,useState } from 'react';
import {api} from "../services/apiClient"
import {destroyCookie,setCookie,parseCookies} from "nookies"
import Router from 'next/router';
type DependentesProps={
    nome:string,
    nasc:string,
    parentesco:string,
    adesao:string,
    carencia:string
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
    arraydep:Array<DependentesProps> ,
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
    dtcarencia:string
    
}

const INITIAL_DATA:DadosCadastro ={
    name:'',
    nasc:'',
    sexo:'',
    cep:'',
    endereço:'',
    numero:'',
    bairro:'', 
    referencia:'',
    cidade:'',
    uf:'',
    email:'',
    rg:'',
    cpf:'',
    closeModalPlano:false,
    closeModalCadastro:false,
    arraydep:[],
    naturalidade:'',
    celular1:'',
    celular2:'',
    telefone:'',
    contrato:0,
    origem:'',
    plano:'',
    valor:'',
    cobrador:'',
    consultor:'',
    supervisor:'',
    np:0,
    dtvenc:'',
    dtadesao:'',
    dtcarencia:''
  }

type AuthContextData = {
    usuario:UserProps | undefined,
    isAuthenticated:boolean,
    sign: (credentials:SignInProps)=>Promise<void>,
    signOut:()=>void,
    closeModa:(fields:Partial<DadosCadastro>)=>void,
    data:DadosCadastro
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
    const [data,setData] =useState(INITIAL_DATA)
async function sign({nome,password}:SignInProps) {
    try{
        const response = await api.post('/session',{
            nome,
            password
        })
        console.log(response.data)
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
function closeModa(fields: Partial<DadosCadastro>){
   setData(prev=>{
     return{...prev,...fields}
    })
    
}
  return(
    <AuthContext.Provider value={{usuario,isAuthenticated,sign,signOut,data,closeModa}}>
        {children}
    </AuthContext.Provider>
  )
}