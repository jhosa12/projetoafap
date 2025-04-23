"use client";

// importe os primitives em vez do wrapper ShadCN:
import {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
  Content as PopoverContent,
} from "@radix-ui/react-popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface ComboboxProps {
  items: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function Combobox({ items, value, onChange, placeholder='Selecione um item', searchPlaceholder }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverRoot open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className=" w-full">
        <Button className=" justify-between text-xs truncate" variant="outline" role="combobox" aria-expanded={open}>
        <span className="truncate">{value ? value: placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Note que aqui é o Radix.Content, sem Portal */}
      <PopoverContent
        sideOffset={4}
        onOpenAutoFocus={e => e.preventDefault()}
        className="p-0 pt-1  z-20"
      >
        <Command className="max-h-64">
          <CommandInput className="h-8" autoFocus placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                className="text-xs"
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value === value ? null : item.value);
                    setOpen(false);
                  }}
                >
                  <Check className={value === item.value ? "opacity-100" : "opacity-0"} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </PopoverRoot>
  );
}
