
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "@/lib/axios/errors/AuthTokenError"
import { signOut } from "@/store/AuthContext";


export function setupAPIClient(ctx = undefined) {

    
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
        Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })
    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response?.status === 401) {
            //qualquer erro 401 (não autorizado) devemos deslogar o usuario
            if (typeof window !== undefined) {
                signOut()
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error);
    })
    return api
}


