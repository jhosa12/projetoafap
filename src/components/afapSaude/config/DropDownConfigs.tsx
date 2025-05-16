import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { HiAdjustments } from "react-icons/hi";




export default function DropDownConfigs() {
    const [open,setOpen] = useState(false);

    return (

        <DropdownMenu>
            <DropdownMenuTrigger  asChild>
                <button className="flex items-center justify-center gap-2 text-sm font-medium" onClick={() => setOpen(true)}>
                     <HiAdjustments size={10} className="h-4 w-4" />
                    Configurações Adicionais
                    </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setOpen(false)}>
                    Especialidades
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setOpen(false)}>
                   Descontos
                </DropdownMenuItem>
          
            </DropdownMenuContent>



        </DropdownMenu>
    )
}