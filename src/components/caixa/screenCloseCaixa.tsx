import FechamentoResumo from "@/Documents/caixa/FechamentoCaixa";
import { FechamentoProps } from "@/pages/caixa";
import pageStyle from "@/utils/pageStyle";
import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiCheckCircle } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";


interface Props {
  fechamento:FechamentoProps
}



export function ScreenCloseCaixa({fechamento}:Props) {


  const currentPage = useRef<FechamentoResumo>(null)
     const [printFecha, setPrintFecha] = useState(false)

  const imprimir =useReactToPrint({
    pageStyle: pageStyle,
    content: () => currentPage.current,
    onAfterPrint: () => {
      
    }
  })


  useEffect(()=>{
    if(printFecha){
      imprimir()
      setPrintFecha(false)
    }
  },[printFecha])







    return(
        <div className="flex flex-col gap-4 justify-center bg-white items-center h-[calc(100vh-120px)]">
        <div style={{display:"none"}} >
          <FechamentoResumo fechamento={fechamento} endDate={new Date()} startDate={new Date()} usuario="Joaquim"  ref={currentPage}  />
        </div>
          <HiCheckCircle color="green" size={110} />
          <h1 className="text-2xl font-bold">CAIXA FECHADO</h1>
          <Button onClick={()=>setPrintFecha(true)} theme={{color:{light:"border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100"}}} color="light" size="lg">IMPRIMIR</Button>
        </div>
    )
}