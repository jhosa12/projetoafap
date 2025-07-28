"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RouteProps } from "@/types/cobranca"


interface NewRouteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (route: Omit<RouteProps, "id_cobranca" | "dt_created" | "dt_updated">) => void
}

export function NewRouteDialog({ open, onOpenChange, onSave }: NewRouteDialogProps) {
  const [formData, setFormData] = useState({
    consultor: "",
    id_empresa: "",
    observacao: "",
    bairros: "",
    criterio_operator: ">=",
    criterio_value: 90,
    periodo_start: "",
    periodo_end: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRoute: Omit<RouteProps, "id_cobranca" | "dt_created" | "dt_updated"> = {
      consultor: formData.consultor,
      id_empresa: formData.id_empresa,
      status: "ativa",
      updated_by: "current_user",
      created_by: "current_user",
      observacao: formData.observacao,
      parametros: {
        bairros: formData.bairros.split(",").map((b) => b.trim()),
        periodo: {
          start: formData.periodo_start ? new Date(formData.periodo_start) : null,
          end: formData.periodo_end ? new Date(formData.periodo_end) : null,
        },
        criterio: {
          operator: formData.criterio_operator,
          value: formData.criterio_value,
        },
        consultor: formData.consultor,
      },
      cobranca: [],
      pagamentos: [],
      agendamentos: [],
      solicitacoes: [],
      atualizacaoCadastral: [],
    }

    onSave(newRoute)
    onOpenChange(false)

    // Reset form
    setFormData({
      consultor: "",
      id_empresa: "",
      observacao: "",
      bairros: "",
      criterio_operator: ">=",
      criterio_value: 90,
      periodo_start: "",
      periodo_end: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Rota de Cobrança</DialogTitle>
          <DialogDescription>Preencha os dados para criar uma nova rota de cobrança</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consultor">Consultor *</Label>
              <Input
                id="consultor"
                value={formData.consultor}
                onChange={(e) => setFormData((prev) => ({ ...prev, consultor: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="id_empresa">ID Empresa *</Label>
              <Input
                id="id_empresa"
                value={formData.id_empresa}
                onChange={(e) => setFormData((prev) => ({ ...prev, id_empresa: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bairros">Bairros (separados por vírgula) *</Label>
            <Input
              id="bairros"
              placeholder="Centro, Vila Nova, Jardim América"
              value={formData.bairros}
              onChange={(e) => setFormData((prev) => ({ ...prev, bairros: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodo_start">Data Início</Label>
              <Input
                id="periodo_start"
                type="date"
                value={formData.periodo_start}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodo_start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="periodo_end">Data Fim</Label>
              <Input
                id="periodo_end"
                type="date"
                value={formData.periodo_end}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodo_end: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="criterio_operator">Critério</Label>
              <Select
                value={formData.criterio_operator}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, criterio_operator: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">=">{">="} Maior ou igual</SelectItem>
                  <SelectItem value=">">{">"} Maior que</SelectItem>
                  <SelectItem value="=">= Igual a</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="criterio_value">Dias em atraso</Label>
              <Input
                id="criterio_value"
                type="number"
                value={formData.criterio_value}
                onChange={(e) => setFormData((prev) => ({ ...prev, criterio_value: Number.parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              placeholder="Observações sobre a rota..."
              value={formData.observacao}
              onChange={(e) => setFormData((prev) => ({ ...prev, observacao: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Rota</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
