import { useContext, useEffect, useState } from "react"
import { AuthContext} from '@/contexts/AuthContext';
import { io } from 'socket.io-client';
import { api } from "@/services/apiClient";
import { Header } from "./header/header";




  
export function MenuLateral(){
   
    const [isOpen,setIsOpen]=useState(false);
    const {usuario,getDadosFixos,empresas,permissoes,selectEmp,setSelectEmp}= useContext(AuthContext);
  
    const[notifyCount,setCount] = useState<number>();
    
    

 useEffect(() => {
    
    getDadosFixos();
    const socket = io("https://www.testeapiafap.shop", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    if (usuario) {
      socket.on('connect', () => {
        socket.emit('userId', usuario?.id.toString());
      });

      socket.on('nova-tarefa', (tarefa) => {
        if (tarefa) setCount(tarefa);
      });
    }

    return () => {
      socket.off('nova-tarefa');
    };
  }, [usuario?.id]);



async function contagem() {
 const cont = await api.post("/notification/contagem",{
   id_destino:String(usuario?.id)
 })
 setCount(cont.data)
}

  return (
 
   
<Header/>

  
 


  )  
}