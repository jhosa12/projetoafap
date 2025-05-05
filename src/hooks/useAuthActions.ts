'use client'
import { api } from "@/lib/axios/apiClient";
import { SignInProps, UserProps } from "@/types/user";
import { decode } from "jsonwebtoken";
import {useRouter} from 'next/navigation';
import { destroyCookie, setCookie } from "nookies";
import { useCallback, useState } from "react";
import { toast } from "sonner";



interface DecodedToken {
  permissoes?: string | string[];
  [key: string]: any; // Para outros campos inesperados
}


export function useAuthActions():{signIn: (credentials: SignInProps) => Promise<void>,signOut: () => void,usuario:UserProps|undefined,permissoes:Array<string>} {
    const [usuario,setUsuario] = useState<UserProps|undefined>();
    const [permissoes,setPermissoes] =useState<Array<string>>([])
    const router = useRouter()
   

    const signIn = useCallback(async({user,password}:SignInProps)=>{
        try {
            const response = await api.post('/session',{usuario:user.trim(),password:password.trim()})
            const {id,tokenAuth,cargo,dir,nome,image} = response.data;

               // Armazena imagem em localStorage (se necessário)
     /* if (typeof window !== 'undefined') {
        localStorage.setItem('@user.image', image);
      }*/

          const decodedToken = decode(tokenAuth);  
          const {permissoes} = decodedToken as DecodedToken;

          const parsedPermissoes = typeof permissoes === 'string' ? JSON.parse(permissoes) : permissoes ?? [];
          setPermissoes(parsedPermissoes);
        

          setCookie(undefined,'@nextauth.token',tokenAuth, {
            maxAge: 60 * 60 * 24 * 1, // 1 dia
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            //httpOnly: true
          });
          api.defaults.headers['Authorization'] = `Bearer ${tokenAuth}`;
          setUsuario({ nome: nome.toUpperCase(), cargo, dir, image: image ?? '' });
          router.push("/dashboard/admcontrato");

        } catch (error) {
            toast.error('Erro ao logar');
        }
    },[])

    const signOut = useCallback(() => {
        try {
          router.push('/');
          destroyCookie(undefined, '@nextauth.token');
          delete api.defaults.headers['Authorization'];
          setUsuario(undefined);
          setPermissoes([]);
         
        } catch (error) {
          toast.error('Erro ao deslogar');
        }
      }, []);

return {signIn,signOut,usuario,permissoes}

}