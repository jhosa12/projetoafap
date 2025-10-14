import { Button } from "@/components/ui/button"
import { AuthContext } from "@/store/AuthContext"
import { useContext, useState } from "react"
import { TbAlertTriangle } from "react-icons/tb"
import useActionsAssociado from "@/app/dashboard/admcontrato/_hooks/associado/useActionsAssociado"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DataProps {
  setModal: (open: boolean) => void
  openModal: boolean
}

export function ModalInativar({ openModal, setModal }: DataProps) {
  const { dadosassociado } = useContext(AuthContext)

  const [descricao, setDescMotivo] = useState('')
  const [motivo, setMotivo] = useState<"Desagrado" | "Financeiro" | "Nao Localizado" | undefined>()

  const hookProps = {
    setModal: setModal
  }

  const { inativarAtivarContrato } = useActionsAssociado(hookProps)

  const handleMotivoChange = (selectedMotivo: "Desagrado" | "Financeiro" | "Nao Localizado") => {
    setMotivo(motivo === selectedMotivo ? undefined : selectedMotivo)
  }

  return (
    <Dialog open={openModal} onOpenChange={setModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <TbAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Alterar Status do Contrato
          </DialogTitle>
          <DialogDescription className="text-center">
            Realmente deseja alterar o contrato Nº {dadosassociado?.contrato?.id_contrato}?
          </DialogDescription>
        </DialogHeader>

        {dadosassociado?.contrato?.situacao === 'ATIVO' && (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Motivo da Inativação</Label>
              <div className="grid gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financeiro"
                    checked={motivo === 'Financeiro'}
                    onCheckedChange={() => handleMotivoChange('Financeiro')}
                  />
                  <Label
                    htmlFor="financeiro"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Financeiro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nao-localizado"
                    checked={motivo === 'Nao Localizado'}
                    onCheckedChange={() => handleMotivoChange('Nao Localizado')}
                  />
                  <Label
                    htmlFor="nao-localizado"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Não Localizado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="desagrado"
                    checked={motivo === 'Desagrado'}
                    onCheckedChange={() => handleMotivoChange('Desagrado')}
                  />
                  <Label
                    htmlFor="desagrado"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Desagrado
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Informe o motivo da inativação"
                value={descricao}
                onChange={(e) => setDescMotivo(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setModal(false)}
          >
            Não, cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => inativarAtivarContrato({ motivo, descricao })}
          >
            Sim, tenho certeza
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





