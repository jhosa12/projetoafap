
import {NextRequest}  from "next/server"
import { decode } from 'jsonwebtoken'

const getUserFromToken = (req:NextRequest) => {
   
    const token = req.cookies.get('@nextauth.token')?.value;
    let user = null;
     if(token){
        let image;
        if (typeof window !== 'undefined') {
            image = localStorage.getItem('@user.image');
        }
        const decodeToken = decode(token);
        if (decodeToken && typeof decodeToken === 'object') {
            const { nome, sub, dir, cargo, permissoes } = decodeToken;
            user = {
                id: String(sub), nome: nome.toUpperCase(), cargo, dir, image: `data:image/jpeg;base64,${image}`
            }
            
        }
     }
     return user
};


export {getUserFromToken}