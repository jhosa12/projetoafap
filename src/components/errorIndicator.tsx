import { FieldErrors, FieldValues } from "react-hook-form";





export const ErrorIndicator = <T extends FieldValues,> ({errors}:{errors:FieldErrors<T>})=>{


    return (
        <>
          {Object.keys(errors).length > 0 && (
            <ul className="bg-red-100 p-2 inline-flex w-full gap-2 flex-wrap rounded-sm border border-red-300">
              {Object.entries(errors).map(([field, error]) => {
                const msg = (error as { message?: string })?.message;
                return msg ? (
                  <li key={field} className="text-red-600 text-xs">
                    {msg}
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </>
    )
}