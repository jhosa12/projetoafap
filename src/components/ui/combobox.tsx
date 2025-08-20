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
  className?: string;
  classNameInput?: string;
  disabled?: boolean,
  modal?:boolean
}

export function Combobox({ items, value, onChange, placeholder='Selecione um item', searchPlaceholder,className='w-full',disabled=false,modal=false,classNameInput }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedItem = items.find(item => item.value === value);
  return (
    <PopoverRoot modal={modal}  open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild className={`w-full ${classNameInput}`}>
        <Button className=" justify-between text-xs truncate border-gray-400" variant="outline" role="combobox" aria-expanded={open}>
        <span className="truncate">{selectedItem ? selectedItem?.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Note que aqui é o Radix.Content, sem Portal */}
      <PopoverContent
      onFocusOutside={e=>e.preventDefault()}
        sideOffset={4}
        //onInteractOutside={e => e.preventDefault()}
       // onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        className="p-0 pt-1  z-20"
      >
        <Command  className={`shadow-sm border border-gray-200 ${className}`}>
          <CommandInput   className="h-8 border-0 focus:ring-0 focus:border-0 focus:outline-none"  placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                className="text-xs"
                  key={item.value}
                  value={item.label}
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
