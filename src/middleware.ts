import { NextRequest, NextResponse } from "next/server";
import { api } from "./lib/axios/apiClient";


export default async function middleware(req:NextRequest) {
    const token = req.cookies.get('@nextauth.token')?.value;
   // const protectRoutes = ['/admcontrato']


   const autorizated =await isValidate(token)
    if(req.nextUrl.pathname !== '/' && !autorizated) {
        return NextResponse.redirect(new URL('/', req.url))
    }
}

export const config = {
matcher: ['/dashboard/:path*'],
}


const isValidate = async (token:string|undefined) =>{

    if(!token){
        return false
    }

    try {
 

     const response =   await api.get('/me', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
      
        return true
        
    } catch (error) {
        return false
    }

}