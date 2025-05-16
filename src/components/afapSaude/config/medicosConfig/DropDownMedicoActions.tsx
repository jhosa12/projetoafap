import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { MedicoProps } from "@/types/afapSaude";


interface DropDownProps {
    item: MedicoProps
    setOpenModal: (open: boolean) => void
    setarDadosMedico: (medico: Partial<MedicoProps>) => void
}

export const DropDownMedicoActions = ({item,setOpenModal,setarDadosMedico}: DropDownProps) => {
const [openDropdown, setOpenDropdown] = useState(false);



    return (
        <div className="absolute top-0 right-0 z-10 px-2 pt-2">
              <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button onClick={()=>setOpenDropdown(true)} variant="ghost" size="icon" className="h-7 w-7 bg-white">
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  <DropdownMenuItem
                    onClick={() => {
                      setarDadosMedico({
                        ...item,
                        tmpUrl: undefined,
                        exames: item.exames,
                      })
                      setOpenModal(true)
                      setOpenDropdown(false)
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
    )
}