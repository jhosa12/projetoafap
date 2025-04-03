import { Button, Label, Popover } from "flowbite-react"
import { IoCalendar } from "react-icons/io5"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useContext, useState } from "react";
import { api } from "@/lib/axios/apiClient";

import { AuthContext } from "@/store/AuthContext";
import { IoIosTime } from 'react-icons/io';
import { MensalidadeProps } from "@/types/financeiro";
import { toast } from "sonner";
interface DataProps{
   
    id_global:number|null,
    mensalidades:Array<Partial<MensalidadeProps>>
    id_usuario?:string
    setSelecionadas:Function
}


export function PopoverReagendamento({id_global,mensalidades,id_usuario,setSelecionadas}:DataProps) {
    const [date, setDate] = useState(new Date());
    const {setarDadosAssociado} = useContext(AuthContext)

  

    const handleReagendar = async()=>{
        if(mensalidades.length===0){
            toast.info("Selecione uma ou mais mensalidades")
            return
        }

        if(!id_global){
            return
        }
       
          toast.promise(
                api.put('/mensalidade/reagendamento', {
                    data:date,
                    mensalidades:mensalidades?.map(mensalidade=>mensalidade.id_mensalidade_global),
                    id_global,
                    usuario:id_usuario
                }),
                {
                    error: 'Erro na Requisição',
                    loading: 'Realizando Reagendamento',
                    success:(response)=> {
                        setSelecionadas([])
                        setarDadosAssociado({mensalidade:response.data})
                        
                        return 'Reagendamento realizado com sucesso'}
                }
            )
       
    
    }





    return ( 
<Popover content={(   <div className="flex flex-col p-2 gap-2" >
    <div className="flex flex-col">
        <Label className="text-xs">Reagendar para</Label>
        <DatePicker className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  "  dateFormat={"dd/MM/yyyy"} onChange={e => { e && setDate(e) }} selected={date} locale={pt} />
        
    </div>

    <Button onClick={handleReagendar} as={'button'} size="xs">Aplicar</Button>

</div>)}   >
<Button  className="rounded-none border-s-0 border-y" color="light" size="xs">
<IoIosTime className="mr-1 h-4 w-4"/>
Reagendar
</Button>
</Popover>
    )
}