"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Navigation } from "lucide-react"

export function MapButton({
  coordenadas,
  endereco,
}: {
  coordenadas: { latitude: number; longitude: number }
  endereco: string
}) {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordenadas.latitude},${coordenadas.longitude}`
    window.open(url, "_blank")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={openGoogleMaps}>
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
