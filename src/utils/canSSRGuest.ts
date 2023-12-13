import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";


//função para paginas que só podem ser acessadas por visitantes

export function canSSRGuest<P extends { [key: string]: any; }>(fn:GetServerSideProps<P>){
return async (ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{
    
    const cookies = parseCookies(ctx);
    if(cookies['@nextauth.token']){
        return{
            redirect:{
                destination:'/barralateral',
                permanent:false,
            }
        }
    }
    
    return await fn(ctx);
}

}