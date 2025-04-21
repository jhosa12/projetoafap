import { FieldErrors, FieldValues } from "react-hook-form";





export const ErrorIndicator = <T extends FieldValues,> ({errors}:{errors:FieldErrors<T>})=>{

  const extractMessages = (errObj:FieldErrors):string[] =>{
    const messages:string[] = [];
    for (const key in errObj) {
      const error = errObj[key];
      if (error) {
        if('message' in error && typeof error.message === 'string') {
          messages.push(error.message)
      }else if(typeof error === 'object') {
        messages.push(...extractMessages(error as FieldErrors))
    }
  }
}

return messages
}

const messages = extractMessages(errors)


    return (
      <>
      {messages.length > 0 && (
        <ul className="bg-red-100 p-2 inline-flex w-full gap-2 flex-wrap rounded-sm border border-red-300">
          {messages.map((msg, index) => (
            <li key={index} className="text-red-600 text-xs">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </>
    )
}