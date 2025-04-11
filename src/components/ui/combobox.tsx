



"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxProps {
  items: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  searchPlaceholder = "Buscar...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover  open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="max-w-100 w-full" asChild  >
        <Button variant="outline" role="combobox" aria-expanded={open}  className=" justify-between text-xs truncate">
        <span className="truncate">{value ? items.find((item) => item.value === value)?.label : placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent  onClick={(e) => e.stopPropagation()} className=" p-0">
        <Command className="max-h-64" >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList >
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup >
              {items.map((item) => (
                <CommandItem
                className="text-xs"
                  key={item.value}
                  value={String(item.value)}
                  onSelect={() => {
                    onChange(item.value === value ? null : item.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
