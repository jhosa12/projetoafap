import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { roboto_Mono } from "@/fonts/fonts"
import { NodoConta } from "@/utils/listaContas"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from "lucide-react"
import { useActionsPlanoContas } from "../../_hooks/plano-contas/useActionsPlanoContas"

export const GrupoItem = ({ item, onEditar, onExcluir }:
  {
    item: NodoConta,
    onEditar: (item: NodoConta) => void,
    onExcluir: (id: string) => void
  }) => {

  const { deletarPlanoConta } = useActionsPlanoContas()

  return (
    <>
      <AccordionItem value={item.id} >
        <AccordionTrigger className={`${roboto_Mono.className} flex flex-row-reverse justify-end items-center gap-2 text-[11px] uppercase`}>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEditar(item)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExcluir(item.id)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {item.id}-{item.descricao}
        </AccordionTrigger>
        <AccordionContent>
          {item.subcontas && item.subcontas.length > 0 ? (
            <Accordion type="single" collapsible className="pl-8">
              {item.subcontas.map((subgrupo, index) => (
                <GrupoItem key={subgrupo.id} item={subgrupo} onEditar={onEditar} onExcluir={onExcluir} />
              ))}
            </Accordion>
          ) : <p className="text-[10px] italic">Nenhum subgrupo</p>
          }
        </AccordionContent>
      </AccordionItem >
    </>

  )
}