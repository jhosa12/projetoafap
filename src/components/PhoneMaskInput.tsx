import { useMaskito } from '@maskito/react';
import { Input } from './ui/input';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { withMaskitoRegister } from '@/utils/with-maskito-register';


const phoneMask = {
  mask: [
    '(', /\d/, /\d/, ')', ' ',
    /\d/, /\d/, /\d/, /\d/, /\d/,
    '-', /\d/, /\d/, /\d/, /\d/
  ],
};

export function PhoneMaskInput<T extends FieldValues,>({ controlName, register,className }: {  controlName:Path<T>,register:UseFormRegister<T>,className?:string}) {
  const inputRef = useMaskito({ options: phoneMask });


  const combinedClassName = [ "h-9",className].filter(Boolean).join(" ");

  return (
    <Input
    {...withMaskitoRegister(register(controlName), inputRef)}
    className={combinedClassName}
  />
  );
}
