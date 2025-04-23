import { useMaskito } from "@maskito/react";
import { Input } from "@/components/ui/input";
import { maskitoTransform } from "@maskito/core";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { withMaskitoRegister } from "@/utils/with-maskito-register";



const options = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
 
}
export function CPFInput<T extends FieldValues,>({
 
  className,
  register,
  controlName,
  required = false
}: {
 
  className?: string;
  register:UseFormRegister<T>,
  controlName:Path<T>,
  required?:boolean
}) {

 const ref = useMaskito({
    options: options,
  });


  // Combina a classe padrão com qualquer classe passada via props
  const combinedClassName = [ "h-9",className].filter(Boolean).join(" ");

  return (
    <Input
     
      {...withMaskitoRegister(register(controlName,required ? {required:'CPF é Obrigatório'} : {}), ref)}
      className={combinedClassName}
    />
  );
}
