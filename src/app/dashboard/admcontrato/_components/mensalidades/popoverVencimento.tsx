import { Label, Popover } from "flowbite-react"
import { IoCalendar } from "react-icons/io5"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useContext, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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



        toast.promise(
            api.put('/mensalidade/alterarVencimento',{
                data_venc:date,
                id_global
            }),
            {
                error: 'Erro ao alterar vencimento',
                loading: 'Alterando vencimento',
                success:(response) => {
                    
                    setarDadosAssociado({mensalidade:response.data})
                    
                    
                    return 'Vencimento alterado com sucesso'}
            }
        )

     
        
  
}





    return ( 
<Popover content={(   <div className="flex flex-col p-2 gap-2" >
    <div className="flex flex-col">
        <Label className="text-xs">Alterar Apartir de</Label>
        <DatePicker className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  "  dateFormat={"dd/MM/yyyy"} onChange={e => { e && setDate(e) }} selected={date} locale={pt} />
        
    </div>

    <Button variant={'outline'} onClick={handleAlterarVencimento} type="button" size="sm">Aplicar</Button>

</div>)}   >
<Button  variant={'outline'} color="light" size="sm">
<IoCalendar className="mr-1 h-4 w-4"/>
Alterar Vencimento
</Button>
</Popover>
    )
}