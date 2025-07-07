import React, { HtmlHTMLAttributes } from "react";
import { CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  dateRange: DateRange|undefined;
  onDateRangeChange: (range: DateRange|undefined) => void;
  className?: HtmlHTMLAttributes<HTMLDivElement>["className"];
}

export function DatePickerWithRange({ dateRange, onDateRangeChange, className}: DatePickerWithRangeProps) {
  return (


  
    <div className={cn("grid gap-2", className)}>
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "flex justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a dateRange</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            locale={ptBR}
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
 

    
  );
}
