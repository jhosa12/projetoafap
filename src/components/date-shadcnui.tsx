




"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Helpers
function formatDate(date: Date | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {timeZone:"UTC"});
}

function parsePtBrDate(input: string): Date | undefined {
  // Accept dd/MM/yyyy
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  const d = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const y = parseInt(m[3], 10);
  const dt = new Date(y, mo, d);
  console.log(dt,dt.toISOString())
  return isNaN(dt.getTime()) ? undefined : dt;
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

// Reusable, controlled Date Field
export interface DateFieldProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function DateField({
  value,
  onChange,
  label,
  id = "date",
  name,
  placeholder = "Digite a data",
  disabled = false,
  required = false,
  className,
}: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value ?? new Date());
  const [inputValue, setInputValue] = React.useState<string>(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
    if (value) setMonth(value);
  }, [value]);

  return (
    <div className={"flex flex-col gap-3 " + (className ?? "") }>
      {label ? (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      ) : null}
      <div className="relative flex gap-2">
        <Input
          id={id}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          disabled={disabled}
          required={required}
          onChange={(e) => {
            const v = e.target.value;
              onChange(parsePtBrDate(v)); 
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover modal={true} open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id + "-picker"}
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={disabled}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Selecionar data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 z-50"
            align="end"
            alignOffset={-8}
            sideOffset={10}
            
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                onChange(date ?? undefined);
                setInputValue(formatDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
