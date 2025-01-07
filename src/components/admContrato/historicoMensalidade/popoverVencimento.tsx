import { Button, Label, Popover } from "flowbite-react"
import { IoCalendar } from "react-icons/io5"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useContext, useState } from "react";
import { MensalidadeProps } from "@/types/financeiro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { SetAssociadoProps } from "./historicoMensalidade";
import { AuthContext } from "@/contexts/AuthContext";

interface DataProps{
    
    id_global:number|null,
   
}


export function PopoverVencimento({id_global}:DataProps) {
    const [date, setDate] = useState(new Date());
    const {setarDadosAssociado} = useContext(AuthContext)

  

const handleAlterarVencimento = async() => {

    if(!id_global){
       
        return
    }


    try {
        const response = await toast.promise(
            api.put('/mensalidade/alterarVencimento',{
                data_venc:date,
                id_global
            }),
            {
                error: 'Erro ao alterar vencimento',
                pending: 'Alterando vencimento',
                success: 'Vencimento alterado com sucesso'
            }
        )

      setarDadosAssociado({mensalidade:response.data})
        
    } catch (error) {
        console.log(error)
    }   
}





    return ( 
<Popover content={(   <div className="flex flex-col p-2 gap-2" >
    <div className="flex flex-col">
        <Label className="text-xs">Alterar Apartir de</Label>
        <DatePicker className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  "  dateFormat={"dd/MM/yyyy"} onChange={e => { e && setDate(e) }} selected={date} locale={pt} />
        
    </div>

    <Button onClick={handleAlterarVencimento} as={'button'} size="xs">Aplicar</Button>

</div>)}   >
<Button  className="rounded-none border-s-0 border-y" color="light" size="xs">
<IoCalendar className="mr-1 h-4 w-4"/>
Alterar Vencimento
</Button>
</Popover>
    )
}