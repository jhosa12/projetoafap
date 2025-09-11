'use client'

import { CheckCircle2, Search } from "lucide-react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

interface GenericoBuscaProps<T> {

  trigger: React.ReactNode
  data: T[]
  buscaKeys: (keyof T)[]
  placeHolder?: string
  onSelect: (item: T) => void
  renderItem: (item: T) => React.ReactNode
  idKey: keyof T; // Chave única para identificar os itens (ex: 'id', 'sku')
  selectedItem?: T | null; // O item atualmente selecionado

}

export function GenericoBusca<T>({
  trigger,
  data,
  buscaKeys,
  onSelect,
  renderItem,
  idKey, // Nova prop
  selectedItem, // Nova prop
  placeHolder = "Busque aqui...",
}: GenericoBuscaProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [buscaTermo, setBuscaTermo] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<T[]>(data);

  // Efeito para filtrar os dados sempre que o termo de busca ou os dados originais mudarem
  React.useEffect(() => {
    if (buscaTermo === "") {
      // Se a busca estiver vazia, mostramos os 5 primeiros itens ou todos se forem menos que 5.
      setFilteredData(data.slice(0, 5));
      return;
    }

    const lowercasedFilter = buscaTermo.toLowerCase();

    const filtered = data.filter((item) => {
      // Verifica se o termo de busca existe em alguma das chaves especificadas
      return buscaKeys.some((key) => {
        const value = item[key];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedFilter)
        );
      });

    })
    setFilteredData(filtered);

  }, [buscaTermo, data, buscaKeys])


  // Limpa a busca ao fechar o dialog
  React.useEffect(() => {
    if (!open) {
      setBuscaTermo("");
    }
  }, [open]);

  const handleSelect = (item: T) => {
    onSelect(item);
    setOpen(false); // Fecha a dialog após a seleção
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Busca Genérica</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeHolder}
            className="pl-8"
            value={buscaTermo}
            onChange={(e) => setBuscaTermo(e.target.value)}
          />
        </div>
        <div className="flex-grow overflow-y-auto mt-4">
          {filteredData.length > 0 ? (
            <ul className="space-y-2">
              {filteredData.map((item, index) => {
                // Verificamos se o item atual é o selecionado
                const isSelected = selectedItem && item[idKey] === selectedItem[idKey];

                return (
                  <li
                    key={index}
                    onClick={() => handleSelect(item)}
                    // Usamos a função 'cn' para aplicar classes condicionalmente
                    className={cn(
                      "p-3 rounded-md hover:bg-accent cursor-pointer flex items-center justify-between transition-colors",
                      isSelected && "bg-accent font-semibold" // Estilo para item selecionado
                    )}
                  >
                    {renderItem(item)}
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary" /> // Ícone para o item selecionado
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              Nenhum resultado encontrado.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

}