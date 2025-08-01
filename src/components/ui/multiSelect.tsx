import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
  Content as PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
  disabled?: boolean;
  emptyMessage?: string;
  maxDisplayItems?: number;
}

export function MultiSelects({
  options,
  selected=[],
  onChange,
  placeholder = "Select options...",
  className,
  badgeClassName,
  disabled = false,
  emptyMessage = "No options found.",
  maxDisplayItems = 3,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleUnselect = (value: string) => {
    onChange(selected?.filter((item) => item !== value));
  };

  const handleClearAll = () => {
    onChange([]);
    setSearchValue("");
  };

  const handleSelect = (value: string) => {
    const option = options.find((opt) => opt.value === value);
    if (option?.disabled) return;

    onChange(
      selected.some((item) => item === value)
        ? selected?.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const selectedOptions = options.filter((option) =>
    selected?.includes(option.value)
  );

  const displayedItems = selectedOptions.slice(0, maxDisplayItems);
  const remainingCount = selectedOptions.length - maxDisplayItems;

  return (
    <PopoverRoot  open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full min-h-10 justify-between",
              selected?.length > 0 ? "h-auto" : "",
              className
            )}
            onClick={() => setOpen(!open)}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selectedOptions.length > 0 ? (
                <>
                  {displayedItems.map((option,index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={cn(
                        "mr-1 mb-1 py-1 px-2  bg-blue-100 text-blue-800 hover:bg-blue-200",
                        badgeClassName
                      )}
                    >
                      {option.label}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleUnselect(option.value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(option.value)}
                      >
                        <X className="h-3 w-3 text-blue-600 hover:text-blue-900" />
                        <span className="sr-only">Remove {option.label}</span>
                      </button>
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mr-1 mb-1 py-1 px-2 bg-blue-100 text-blue-800",
                        badgeClassName
                      )}
                    >
                      +{remainingCount} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 z-50 border rounded-b-sm"
          style={{ width: buttonRef.current?.offsetWidth }}
        >
          <Command className="w-full">
            <CommandInput
              placeholder="Search options..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {selected.length > 0 && (
                  <div className="px-1 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 w-full justify-start text-muted-foreground"
                      onClick={handleClearAll}
                    >
                      Clear all ({selected.length})
                    </Button>
                  </div>
                )}
                {options.map((option,index) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={index}
                     
                      value={option.value}
                      onSelect={()=>handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "flex text-xs items-center gap-2",
                        isSelected ? "bg-blue-50" : "",
                        option.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-4 w-4 border rounded mr-1",
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </PopoverRoot>
  );
}