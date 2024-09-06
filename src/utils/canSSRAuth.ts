//Pode usuarios logados --- acessar


import { AuthTokenError } from "@/services/errors/AuthTokenError";
import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies,destroyCookie } from "nookies";


interface Props{
    [key:string]:any
}

// função para pagina onde so usuarios logados podem acessar

export function canSRRAuth<P extends Props>(fn:GetServerSideProps<P>){
    
    return async(ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{
        
        const cookies =parseCookies(ctx);
        const token = cookies['@nextauth.token'];
        if(!token){
            return{
                redirect:{
                    destination:'/',
                    permanent:false
                }
            }
        }
        try{

            return await fn(ctx)
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx,'@nextauth.token');
                return{
                    redirect:{
                        destination:'/',
                        permanent:false
                    }
                }
            }
         
         
            throw err;
        }

         

    }
}