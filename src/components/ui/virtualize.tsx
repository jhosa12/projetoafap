import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

// Exemplo de array com cidades (use o seu real)
interface VirtualProps{
  control: any,
  name: string
  cidades: string[]
}

export function CidadeSelectVirtualizada({ control, name,cidades }: VirtualProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Filtro simples pelo nome da cidade
  const cidadesFiltradas = cidades?.filter((cidade) =>
    cidade.toLowerCase().includes(query.toLowerCase())
  );

  // Referência ao container de rolagem
  const parentRef = useRef(null);

  // Setup da virtualização
  const rowVirtualizer = useVirtualizer({
    count: cidadesFiltradas?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30, // altura média de um item
    overscan: 10,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("w-full justify-between text-left text-xs", !field.value && "text-muted-foreground")}
            >
              {field.value || "Selecione uma cidade"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar cidade..."
                className="text-xs"
                onValueChange={(value) => setQuery(value)}
              />
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>

              <div
                ref={parentRef}
                className="h-60 overflow-y-auto"
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: "relative",
                  }}
                >
                  {rowVirtualizer?.getVirtualItems()?.map((virtualRow) => {
                    const cidade = cidadesFiltradas[virtualRow.index];
                    return (
                      <CommandItem
                        key={cidade}
                        onSelect={() => {
                          field.onChange(cidade);
                          setOpen(false);
                        }}
                        className="text-xs"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {cidade}
                      </CommandItem>
                    );
                  })}
                </div>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
