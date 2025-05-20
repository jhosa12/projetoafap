import handleWhatsAppClick from "@/utils/openWhats"
import { BsWhatsapp } from "react-icons/bs"



interface ButtonWhatsAppProps{
    fone?: string
}


export const ButtonWhatsApp = ({fone}:ButtonWhatsAppProps) =>{
    return(
        <BsWhatsapp onClick={e=>{e.stopPropagation();handleWhatsAppClick({
            phone:fone ??'',
         
        })}} size={20} />
    )
}