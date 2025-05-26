import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "./ui/button"
import { LucideIcon, Printer } from "lucide-react"
import pageStyle from "@/utils/pageStyle"

interface PrintProps{
    children: React.ReactNode
    documentTitle?: string
    iconButton?:() =>JSX.Element
    sizeButton?:"default" | "sm" | "lg" | "icon" | null | undefined
    textButton:string
    
}

export default function PrintDocComponent({children,documentTitle,sizeButton='sm',textButton,iconButton}:PrintProps){

    const ref = useRef<HTMLDivElement|null>(null)

    const print = useReactToPrint({
        pageStyle:pageStyle,
        content: () => ref.current,
        documentTitle:documentTitle??"Documento",
        onAfterPrint: () =>{},
    })
    


    return (
        <>

             <Button size={sizeButton}  variant={"outline"} onClick={print}>
                {iconButton?(iconButton()):<Printer  />}
                {textButton}
             </Button>

<div className="hidden" >
       <div ref={ref}>
          {children}
        </div>
</div>
           
           

        </>
    )
}