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
import { openSync } from "fs";



interface ActionsCaixaProps {
  setSelectRelatorio: (relatorio: string) => void;
  data: any;
  id_empresa: string
  infoEmpresa: EmpresaProps|null

}


export default function ActionsCaixa({data,setSelectRelatorio,id_empresa,infoEmpresa}: ActionsCaixaProps) {
    const [open,setOpen] = useState(false)
    const {verify} =useVerifyPermission()
    return(
        
         <DropdownMenu  defaultOpen={false} open={open} onOpenChange={setOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"outline"}
                          disabled={
                            verify("ADM2.1.1")
                          }
                          color={"success"}
                          size={"sm"}
                        >
                          <IoMdOptions />
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent  >
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem
                          asChild
                          disabled={
                            verify("ADM2.1.1") 
                          }
                        ></DropdownMenuItem> */}
                         
                          <DropdownMenuItem asChild onClick={() => {setSelectRelatorio("ANALITICO")}}>
                            <ModalSelectCaixa infoEmpresa={infoEmpresa} id_empresa={id_empresa} />
                          </DropdownMenuItem>





                        {/* <DropdownMenuSub>
                      
                         <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => setSelectRelatorio("ANALITICO")}
                              >
                                Analitico
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setSelectRelatorio("SINTETICO")}
                              >
                                Sintético
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal> 
                        </DropdownMenuSub> */}
        
                        <DropdownMenuItem
                        //onClick={() => setModal({ fecharCaixa: true })}
                        >
                          Fechar Caixa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
    )
}