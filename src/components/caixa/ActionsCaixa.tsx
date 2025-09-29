import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "../ui/button";
import { IoMdOptions } from "react-icons/io";
import useVerifyPermission from "@/hooks/useVerifyPermission";
import ModalSelectCaixa from "./ModalSelectCaixa";
import { EmpresaProps } from "@/types/empresa";




interface ActionsCaixaProps {

  data: any;
  id_empresa: string
  infoEmpresa: EmpresaProps|null

}


export default function ActionsCaixa({data,id_empresa,infoEmpresa}: ActionsCaixaProps) {
    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const {verify} = useVerifyPermission()
    return (
        <>
            <DropdownMenu  open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"outline"}
                        disabled={verify("ADM2.1.1")}
                        color={"success"}
                        size={"sm"}
                    >
                        <IoMdOptions className="mr-2 h-4 w-4" />
                        Ações
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent  align="end" className="w-[160px]">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => {
                        setOpen(false);
                        setShowModal(true);
                    }}>
                        Relatório de Caixa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Fechar Caixa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <ModalSelectCaixa 
                open={showModal} 
                onOpenChange={setShowModal}
                infoEmpresa={infoEmpresa} 
                id_empresa={id_empresa} 
            />
        </>
    )}