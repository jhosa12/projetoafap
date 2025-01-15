import { Button, Label, Popover, TextInput } from "flowbite-react"
import { useState } from "react"
import { IoIosTime } from 'react-icons/io';
import { MdAutorenew } from "react-icons/md";

interface DataProps{

    handleFunction:Function
    n_Parcelas:number|null
    setParcelas:(n:number)=>void
}


export function PopoverRenovar({handleFunction,n_Parcelas,setParcelas}:DataProps) {
    const [date, setDate] = useState(new Date());


  







    return ( 
<Popover content={(   <div className="flex flex-col p-2 gap-2 -z-20" >
    <div className="flex flex-col">
        <Label className="text-xs">Número de parcelas</Label>
       <TextInput value={n_Parcelas?n_Parcelas:'' } onChange={e=>setParcelas(Number(e.target.value))} type="number" sizing="sm"/>
        
    </div>

    <Button onClick={()=>handleFunction} as={'button'} size="xs">Aplicar</Button>

</div>)}   >
<Button theme={{pill:{on:"rounded-r-lg"},color:{
        light:"border border-gray-300 bg-white text-gray-900 focus:rind-none focus:ring-0 enabled:hover:bg-gray-100"
    }}} pill className=" border-s-0 " color="light" size="xs">
<MdAutorenew className="mr-1 h-4 w-4"/>
RENOVAR
</Button>
</Popover>
    )
}