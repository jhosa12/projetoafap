
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
    value:string|undefined
    onChange:(e:string)=>void
    className?:string
    label?:boolean
}


export default function SelectStatusCobranca({value,onChange,className,label=true}:Props){
    return(
        <div className="flex flex-col gap-2">
                   {label && <Label className="text-xs">Status Reagendamento</Label>}
                 
                   
                       <Select required value={value} onValueChange={e => onChange(e)}>
                         <SelectTrigger className={className}>
                           <SelectValue placeholder="Status Reagendamento" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="R">REAGENDADOS</SelectItem>
                           <SelectItem value="RAV">REAGENDADOS A VENCER (RAV)</SelectItem>
                           <SelectItem value="RV">REAGENDADOS VENCIDOS (RV)</SelectItem>
                           <SelectItem value="A/R">ABERTOS E REAGENDADOS</SelectItem>
                           <SelectItem value="A">ABERTOS</SelectItem>
                           <SelectItem value="AV">ABERTOS VENCIDOS</SelectItem>
                           <SelectItem value="AAV">ABERTOS A VENCER</SelectItem>
                           <SelectItem value="A/RV">ABERTOS E REAGENDADOS VENCIDOS</SelectItem>
                           <SelectItem value="A/RAV">ABERTOS E REAGENDADOS A VENCER</SelectItem>
                         </SelectContent>
                       </Select>
                 
         
                 </div>
    )
}