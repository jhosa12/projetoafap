import { Textarea } from "flowbite-react"
import { FormEmpresaProps } from "./modalEmpresa"







export const TabContratoEmpresa = ({control,register,setValue,watch}:FormEmpresaProps) => {
    return(
        <div>
            <Textarea rows={18} {...register('cont_clausuras')}/>
        </div>
    )
}