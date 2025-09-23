import { Fragment, useState } from "react"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@radix-ui/react-label";
  import { Controller, useFormContext } from "react-hook-form";
  import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ServicoItem {
  id: string
  descricao: string
  quantidade: number
  valor_unitario: number
  acrescimo: number
  desconto: number
  valor_total: number
}

export const OSDadosFinanceiros = ()=>{
    const {register,control,watch} =useFormContext<ObitoProps>()
      const [servicos, setServicos] = useState<ServicoItem[]>([])



     const addServico = () => {
        const newServico: ServicoItem = {
          id: Date.now().toString(),
          descricao: "",
          quantidade: 1,
          valor_unitario: 0,
          acrescimo: 0,
          desconto: 0,
          valor_total: 0,
        }
        setServicos([...servicos, newServico])
      }
    
      const removeServico = (id: string) => {
        setServicos(servicos.filter((s) => s.id !== id))
      }
    
      const updateServico = (id: string, field: keyof ServicoItem, value: any) => {
        setServicos(
          servicos.map((s) => {
            if (s.id === id) {
              const updated = { ...s, [field]: value }
              // Recalculate total when quantity, unit value, addition or discount changes
              if (["quantidade", "valor_unitario", "acrescimo", "desconto"].includes(field)) {
                const subtotal = updated.quantidade * updated.valor_unitario
                const totalComAcrescimo = subtotal + updated.acrescimo
                updated.valor_total = totalComAcrescimo - updated.desconto
              }
              return updated
            }
            return s
          }),
        )
      }

    return(
        <div className="space-y-2" >
        <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Serviços Prestados</CardTitle>
          <CardDescription className="text-gray-600">Adicione e gerencie os serviços prestados</CardDescription>
        </CardHeader>
        <CardContent className="text-xs">
          <div className="space-y-4">
            <Button type="button" onClick={addServico} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Serviço
            </Button>

            {servicos.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-20">Qtd</TableHead>
                      <TableHead className="w-32">Valor Unit.</TableHead>
                      <TableHead className="w-32">Acréscimo</TableHead>
                      <TableHead className="w-32">Desconto</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicos.map((servico) => (
                      <TableRow key={servico.id}>
                        <TableCell>
                          <Input
                            value={servico.descricao}
                            onChange={(e) => updateServico(servico.id, "descricao", e.target.value)}
                            placeholder="Descrição do serviço"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={servico.quantidade}
                            onChange={(e) =>
                              updateServico(servico.id, "quantidade", Number.parseInt(e.target.value) || 1)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={servico.valor_unitario}
                            onChange={(e) =>
                              updateServico(servico.id, "valor_unitario", Number.parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={servico.acrescimo}
                            onChange={(e) =>
                              updateServico(servico.id, "acrescimo", Number.parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={servico.desconto}
                            onChange={(e) =>
                              updateServico(servico.id, "desconto", Number.parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">R$ {servico.valor_total.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeServico(servico.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">Resumo Financeiro</CardTitle>
          <CardDescription className="text-gray-600">Valores totais e saldo</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <Label htmlFor="vl_servicos">Valor dos Serviços</Label>
            <Input
              id="vl_servicos"
              type="number"
              step="0.01"
              value={servicos.reduce((total, s) => total + s.valor_total, 0).toFixed(2)}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vl_produtos">Valor dos Produtos</Label>
            <Input
              id="vl_produtos"
              type="number"
              step="0.01"
             {...register('vl_produtos',{valueAsNumber:true})}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vl_total">Valor Total</Label>
            <Input
              id="vl_total"
              type="number"
              step="0.01"
              value={(
                servicos.reduce((total, s) => total + s.valor_total, 0) + (watch('vl_produtos') || 0)
              ).toFixed(2)}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saldo">Saldo em Aberto</Label>
            <Input
              id="saldo"
              type="number"
              step="0.01"
            {...register('saldo',{valueAsNumber:true})}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>
      </div>
    )
}