import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import pt from "date-fns/locale/pt";


export function DatePickerInput({
  value,
  onChange,
  disable = false,
  className,
   dateFormat='dd/MM/yyyy',
   required=false,  
  ...rest
 
}: {
  value: Date | null | undefined;
  onChange: (v: Date | undefined) => void;
  disable?: boolean;
  className?: string;
  dateFormat?: string;
  required?:boolean

}) {


const combinedClassName = [ "h-8 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200",className].filter(Boolean).join(" ");

  return (
    <DatePicker
      showIcon
      isClearable={true}
     {...rest}
      disabled={disable}
      locale={pt}
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date as Date)}
      dateFormat={dateFormat}
      className={combinedClassName}
    />
  );
}
