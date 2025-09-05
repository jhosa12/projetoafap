import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import pt from "date-fns/locale/pt";
import { inter } from "@/fonts/fonts";




interface Props extends Omit<ReactDatePickerProps, "onChange"|"selected"| "value"> {
  value: Date | null | undefined;
  onChange: (v: Date | undefined) => void;
  disable?: boolean;
  className?: string;
  dateFormat?: string;
  required?:boolean
}


export function DatePickerInput({
  
  value,
  onChange,
  disable = false,
  className,
   dateFormat='dd/MM/yyyy',
   required=false,  
  ...rest
 
}: Props) {


const combinedClassName = [ "h-8 w-full rounded-sm shadow-sm px-2 border text-sm border-gray-400",className].filter(Boolean).join(" ");



  return (
    <DatePicker
    {...rest}
    required={required}
    popperClassName="z-50"
      showIcon
      isClearable={true}
      disabled={disable}
      locale={pt}
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date as Date)}
      dateFormat={dateFormat}
      className={combinedClassName}
    />
  );
}
