import { AuthTokenError } from "@/services/errors/AuthTokenError";
import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies,destroyCookie } from "nookies";

//; função para páginas que só usuarios logados podem ter acesso
export function canSSRAuth<P extends {[key:string]:any}>(fn:GetServerSideProps<P>){
    return async(ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];
        if(!token){
            return{
                redirect:{
                  destination: '/',
                  permanent:false,
                }
            }
        }
        
       try{
        return await fn(ctx);
       } catch(err){
        if(err instanceof AuthTokenError){
            destroyCookie(ctx,'@nextauth.token');
            return{
                redirect:{
                    destination:'/',
                    permanent:false
                }
            }
        }
        return {
            notFound: true
        };
       }
       

}}