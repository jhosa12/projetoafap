//Pode usuarios não logados --- acessar

import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

interface Props {
    [key: string]: any;
}
//função para paginas que so podem ser acesssadas por visitantes

export function canSSRGuest<P  extends Props>(fn:GetServerSideProps<P>){
    return async (ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{

        const cookies = parseCookies(ctx)
        //Se o cara tentar a pagina tendo ja um login salvo redirecionamos

        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination:'/testeside',
                    permanent:false
                }
            }
        }



        return await fn(ctx)
    }

}