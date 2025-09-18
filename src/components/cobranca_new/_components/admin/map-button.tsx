"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { OpenLocaleMaps } from "@/utils/openLocaleMaps"
import { Navigation } from "lucide-react"

export function MapButton({
  coordenadas,
  endereco,
}: {
  coordenadas: {inLocale:{lat_In:number,lng_In:number},outLocale?:{lat_Out?:number,lng_Out?:number}}
  endereco: string
}) {


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={()=>OpenLocaleMaps(coordenadas)}>
            <Navigation className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Abrir direções no Google Maps</p>
          <p className="text-xs text-muted-foreground">{endereco}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
