'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { roboto_Mono } from "@/fonts/fonts"
import { NodoConta } from "@/utils/listaContas"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react"

export const GrupoItem = ({ item, onEditar, onExcluir }:
  {
    item: NodoConta,
    onEditar: (item: NodoConta) => void,
    onExcluir: (item: NodoConta) => void
  }) => {

  return (
    <>
      <AccordionItem value={item.id} >

        <div className="flex justify-start items-center">

          <AccordionTrigger className={`${roboto_Mono.className} flex flex-row-reverse justify-end items-center gap-2 text-[11px] uppercase`}>
            {item.id}-{item.descricao}
          </AccordionTrigger>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditar(item)}>
                <Pencil /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExcluir(item)}
                className="text-red-600 "
              >
                <Trash2 /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

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