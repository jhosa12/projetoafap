import { ErrorMessage, FieldValuesFromFieldErrors } from "@hookform/error-message"
import { FieldErrors, FieldName, FieldValues, Path } from "react-hook-form"

interface ErrorProps<T extends FieldValues>{
  errors:FieldErrors<T>
  name:FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>
  message?:string
}


export const MyErrorMessage = <T extends FieldValues>({errors,name,message}:ErrorProps<T>) =>{




    return(
        <ErrorMessage
        render={(err)=>
            <span className="text-red-600 text-xs">{message?message:err.message}</span>
        }
        errors={errors} name={name} message={message}
        
        />
    )
}