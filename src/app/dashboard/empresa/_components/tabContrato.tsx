import { Textarea } from "@/components/ui/textarea"
import { FormEmpresaProps } from "./modalEmpresa"







export const TabContratoEmpresa = ({control,register,setValue,watch}:FormEmpresaProps) => {
    return(
        <div className="flex">
            <Textarea rows={25} {...register('cont_clausuras')}/>
        </div>
    )
}