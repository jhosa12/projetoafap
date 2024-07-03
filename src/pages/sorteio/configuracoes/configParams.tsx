
import DatePicker from "react-datepicker"


export default function ConfigParams(){
    return(
     <div className="flex flex-col bg-slate-600 text-white w-full p-2 rounded-lg">
        <div className="inline-flex  border-b-2 gap-2 items-center">
            <h1 className="font-semibold p-2">PERÍODO DE ADESÃO:</h1>
            <div className="flex items-center px-2 py-1">
            <input onChange={() =>{}} type="checkbox" checked />
            <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODO PERÍODO</label>
            </div>
            <DatePicker className="flex bg-gray-500 text-white rounded-sm  px-2" onChange={()=>{}}/>
                <span className="text-xs">até</span>
            <DatePicker className="flex bg-gray-500 text-white rounded-sm  px-2" onChange={()=>{}}/>
        </div>
        <div className="inline-flex  gap-2 items-center">
            <h1 className="font-semibold p-2">QUANTIDADE MÁXIMA DE MENSALIDADES VENCIDAS:</h1>
            <input className="bg-gray-500 rounded-sm px-2" onChange={() =>{}} type="number"  />
        </div>
     </div>
    )
}