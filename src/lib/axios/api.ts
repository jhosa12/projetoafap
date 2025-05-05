
import axios, { AxiosError } from "axios";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "@/lib/axios/errors/AuthTokenError"
import { signOut } from "@/store/AuthContext";


export function setupAPIClient(ctx = undefined) {

    
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: {
        Authorization: `Bearer ${cookies['@nextauth.token']}`
        
        }
    })
    api.interceptors.response.use(response => {
        return response;
    }, async(error: AxiosError) => {
        if (error.response?.status === 401) {
            // try {
               
            //     const response = await axios.post( `${process.env.NEXT_PUBLIC_API_URL}/refreshToken`, {},{withCredentials: true})
            //    // console.log(response.data.accessToken)
            //     const newAccessToken = response.data.accessToken;
            //     api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
            //     if(error.config){
            //         error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            //         return api(error.config);
            //     }
            // } catch (refreshTokenError) {
            //    // console.log(refreshTokenError)
            
           
            //     if (typeof window !== 'undefined') {
            //         try {
            //             await axios.post( `${process.env.NEXT_PUBLIC_API_URL}/revokeRefresh`, {},{withCredentials: true})
            //            } catch (error) {
            //             console.warn('Erro ao revogar token:', error);
            //            }
            //            destroyCookie(undefined, '@nextauth.token');
            //            delete api.defaults.headers['Authorization'];
            //         window.location.href = '/'; // client-side redirect
                       
            //     } else {
            //         return Promise.reject(new AuthTokenError())
            //     }
            // }
            //qualquer erro 401 (não autorizado) devemos deslogar o usuario
          if (typeof window !== undefined) { //OCULTAR COM REFRESH TOKEN
                destroyCookie(undefined, '@nextauth.token');
                delete api.defaults.headers['Authorization'];
                signOut()
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error);
    })
    return api
}


