'use client'



import { useContext, useEffect, useState } from "react"
import { AuthContext} from '@/store/AuthContext';
import { io } from 'socket.io-client';
import { api } from "@/lib/axios/apiClient";
import { Header } from "./header";




  
export function MenuLateral({path}:{path?:string}){
   

  return (
 
   
<Header path={path}/>

  
 


  )  
}