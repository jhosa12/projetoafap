import { FechamentoProps } from "@/pages/caixa";
import { Button } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi2";


interface Props {
  fechamento:FechamentoProps
}



export function ScreenCloseCaixa({fechamento}:Props) {


    return(
        <div className="flex flex-col gap-4 justify-center bg-white items-center h-[calc(100vh-120px)]">
          <HiCheckCircle color="green" size={110} />
          <h1 className="text-2xl font-bold">CAIXA FECHADO</h1>
          <Button theme={{color:{light:"border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100"}}} color="light" size="lg">IMPRIMIR</Button>
        </div>
    )
}