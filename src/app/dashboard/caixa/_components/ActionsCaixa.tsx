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
import { Button } from "../../../../components/ui/button";
import { IoMdOptions } from "react-icons/io";
import useVerifyPermission from "@/hooks/useVerifyPermission";
import ModalSelectCaixa from "./ModalSelectCaixa";
import { EmpresaProps } from "@/types/empresa";
import { PlanoContasProps } from "../../financeiro/_types/plano-contas";
import { ResponseCaixaProps } from "../_types/types";





interface ActionsCaixaProps {

  data: Partial<ResponseCaixaProps>|undefined;
  id_empresa: string
  infoEmpresa: EmpresaProps | null
  planoContas: Array<PlanoContasProps>

}


export default function ActionsCaixa({ data, id_empresa, infoEmpresa, planoContas }: ActionsCaixaProps) {
  const [open, setOpen] = useState(false)
  const { verify } = useVerifyPermission()
  return (

    <DropdownMenu defaultOpen={false} open={open} onOpenChange={setOpen}>
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

        <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
          <ModalSelectCaixa planoContas={planoContas} infoEmpresa={infoEmpresa} id_empresa={id_empresa} />
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