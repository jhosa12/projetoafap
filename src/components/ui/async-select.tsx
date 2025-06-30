"use client"

import { useState, type ReactNode } from "react"
import { Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

import { cn } from "@/lib/utils"

interface AsyncSelectProps<T> {
  data: T[]
  loading: boolean
  error: string | null
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  loadingMessage: string
  disabled?: boolean
  getItemValue: (item: T) => string
  getItemLabel: (item: T) => string
  renderItem?: (item: T) => ReactNode
  className?: string
}

export function AsyncSelect<T>({
  data,
  loading,
  error,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  loadingMessage,
  disabled = false,
  getItemValue,
  getItemLabel,
  renderItem,
  className,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(false)

  const selectedItem = data.find((item) => getItemValue(item) === value)
  const selectedLabel = selectedItem ? getItemLabel(selectedItem) : null

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue === value ? "" : selectedValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-transparent", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingMessage}
            </div>
          ) : selectedLabel ? (
            selectedLabel
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {loading ? (
              <div className="p-2 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="p-2">
                <span>{error}</span>
                {/* <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert> */}
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => {
                    const itemValue = getItemValue(item)
                    const itemLabel = getItemLabel(item)

                    return (
                      <CommandItem key={itemValue} value={itemLabel} onSelect={() => handleSelect(itemValue)}>
                        <Check className={cn("mr-2 h-4 w-4", value === itemValue ? "opacity-100" : "opacity-0")} />
                        {renderItem ? renderItem(item) : itemLabel}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
