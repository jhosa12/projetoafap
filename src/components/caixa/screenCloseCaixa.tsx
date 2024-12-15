import { HiCheckCircle } from "react-icons/hi2";
import { MdSdCardAlert } from "react-icons/md";
import { RiAlertFill } from "react-icons/ri";





export function ScreenCloseCaixa() {


    return(
        <div className="flex flex-col gap-4 justify-center bg-white items-center h-[calc(100vh-120px)]">
          <HiCheckCircle color="green" size={110} />
          <h1 className="text-2xl font-bold">CAIXA FECHADO</h1> 
        </div>
    )
}