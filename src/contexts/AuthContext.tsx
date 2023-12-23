import { ReactNode,createContext,useState } from 'react';
import {api} from "../services/apiClient"
import {destroyCookie,setCookie,parseCookies} from "nookies"
import Router from 'next/router';

type AuthContextData = {
    usuario:UserProps | undefined,
    isAuthenticated:boolean,
    sign: (credentials:SignInProps)=>Promise<void>,
    signOut:()=>void,
}

type SignInProps={
    user:string,
    password:string,
}
type UserProps ={
    id:string,
    user:string,
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
async function sign({user,password}:SignInProps) {
    try{
        const response = await api.post('/session',{
            user,
            password
        })
        const {id,token} = response.data
       setCookie(undefined,'@nextauth.token',token,{
        maxAge:60*60*24*30, // expirar em 1 mes
        path:"/" // quais caminhos terão acesso ao cookie
       })
       setUser({id,user})
       // Passar o token para as proximas paginas
       api.defaults.headers["Authorization"] =`Bearer ${token}`
       //redirecionar o user para /dashboard
       Router.push("/testeside")

    }catch(err){
console.log("Erro ao acessar", err)

    }
}
  return(
    <AuthContext.Provider value={{usuario,isAuthenticated,sign,signOut}}>
        {children}
    </AuthContext.Provider>
  )
}