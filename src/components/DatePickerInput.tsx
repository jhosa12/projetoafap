import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import pt from "date-fns/locale/pt";



export function DatePickerInput({ value, onChange,disable = false,required=false}: { value: Date | null | undefined; onChange: (v: Date) => void,disable?: boolean,required?: boolean }) {
 

  return (
   <DatePicker
   required={required}
   disabled={disable}
        locale={pt}
      selected={value? new Date(value):new Date()}
      onChange={(date) => onChange(date as Date)}
        dateFormat="dd/MM/yyyy"
      className="h-8 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
    />
  );
}