"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: { consultor: string; status: string; bairro: string }
  onFiltersChange: (filters: { consultor: string; status: string; bairro: string }) => void
}

export function FiltersDialog({ open, onOpenChange, filters, onFiltersChange }: FiltersDialogProps) {
  const [tempFilters, setTempFilters] = useState(filters)

  const handleApply = () => {
    onFiltersChange(tempFilters)
    onOpenChange(false)
  }

  const handleClear = () => {
    const clearedFilters = { consultor: "", status: "todos", bairro: "" }
    setTempFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Configure os filtros para encontrar as rotas desejadas</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="filter-consultor">Consultor</Label>
            <Input
              id="filter-consultor"
              placeholder="Nome do consultor"
              value={tempFilters.consultor}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, consultor: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select
              value={tempFilters.status}
              onValueChange={(value) => setTempFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-bairro">Bairro</Label>
            <Input
              id="filter-bairro"
              placeholder="Nome do bairro"
              value={tempFilters.bairro}
              onChange={(e) => setTempFilters((prev) => ({ ...prev, bairro: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>
          <Button onClick={handleApply}>Aplicar Filtros</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
