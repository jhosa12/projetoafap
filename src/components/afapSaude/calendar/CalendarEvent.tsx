import React from "react";
import { cn } from "@/lib/utils";
import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventProps {
  title: string;
  status: string;
  start: Date | string;
  end: Date | string;
}

interface CalendarEventProps {
  event: EventProps;
  index: number;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  const currentDate = new Date();
  const eventEndDate = new Date(event.end);
  const isPastEvent = currentDate > eventEndDate;
  const isCancelled = event.status === "CANCELADO";
  
  // Determine styling based on event status and date
  const getEventStyles = () => {
    if (isCancelled) {
      return {
        containerClass: "border-destructive bg-destructive/10 hover:bg-destructive/20",
        textClass: "text-destructive font-medium",
        icon: <CalendarX className="h-4 w-4 shrink-0 text-destructive" strokeWidth={2.5} />,
        badgeVariant: "destructive" as const
      };
    } else if (isPastEvent) {
      return {
        containerClass: "border-green-600 bg-green-100 hover:bg-green-200",
        textClass: "text-green-800 font-medium",
        icon: <CalendarCheck className="h-4 w-4 shrink-0 text-green-800" strokeWidth={2.5} />,
        badgeVariant: "outline" as const
      };
    } else {
      return {
        containerClass: "border-amber-600 bg-amber-100 hover:bg-amber-200",
        textClass: "text-amber-800 font-medium",
        icon: <CalendarClock className="h-4 w-4 shrink-0 text-amber-800" strokeWidth={2.5} />,
        badgeVariant: "secondary" as const
      };
    }
  };

  const { containerClass, textClass, icon, badgeVariant } = getEventStyles();

  return (
    <TooltipProvider>
      <Tooltip >
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "flex items-center   gap-1.5 p-1.5 rounded-sm border shadow-sm transition-colors",
              "cursor-pointer overflow-hidden text-xs font-medium",
              containerClass
            )}
          >
            {icon}
            <span className={cn("flex-1 truncate text-[10px]", textClass)}>{event.title}</span>
            {/*isCancelled && (
              <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0.5 h-auto font-bold">
                Cancelado
              </Badge>
            )*/}
          </div>
        </TooltipTrigger>
        <TooltipContent className="font-medium">
          <p className="font-medium">{event.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Status: {event.status}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarEvent;