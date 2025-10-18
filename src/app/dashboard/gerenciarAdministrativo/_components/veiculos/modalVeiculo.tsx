import { VeiculoProps } from "@/types/veiculo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm } from "react-hook-form"

type DataProps = {
    openModal: boolean
    onClose: () => void,
    veiculo: VeiculoProps | null,
    handleSalvar: SubmitHandler<VeiculoProps>
}

export function ModalVeiculo({ onClose, openModal, veiculo, handleSalvar }: DataProps) {
    const { register, handleSubmit } = useForm<VeiculoProps>({
        defaultValues: veiculo || {}
    })

    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{veiculo?.id_veiculo ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
                    <DialogDescription>
                        {veiculo?.id_veiculo ? "Altere os dados do veículo conforme necessário e clique em atualizar para salvar as mudanças."
                            : "Preencha os dados e clique em adicionar para salvar um novo veículo na lista."}
                    </DialogDescription>
                </DialogHeader>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(handleSalvar)}>
                    <Field>
                        <FieldLabel>Modelo</FieldLabel>
                        <Input {...register('modelo', { required: "Campo obrigatório" })} placeholder="Ex: Gol, Uno, Corolla" />
                    </Field>
                    <Field>
                        <FieldLabel>Marca</FieldLabel>
                        <Input {...register('marca', { required: "Campo obrigatório" })} placeholder="Ex: Volkswagen, Fiat, Toyota" />

                    </Field>
                    <Field>
                        <FieldLabel>Ano</FieldLabel>
                        <Input {...register('ano', { required: "Campo obrigatório" })} placeholder="Ex: 2020" />
                    </Field>
                    <Field>
                        <FieldLabel>Cor</FieldLabel>
                        <Input {...register('cor', { required: "Campo obrigatório" })} placeholder="Ex: Prata" />
                    </Field>
                    <Field>
                        <FieldLabel>Placa</FieldLabel>
                        <Input {...register('placa', { required: "Campo obrigatório" })} placeholder="Ex: ABC1D23" />
                    </Field>
                    <Field>
                        <FieldLabel>Chassi</FieldLabel>
                        <Input {...register('chassi', { required: "Campo obrigatório" })} placeholder="Número do chassi" />
                    </Field>
                    <DialogFooter className="col-span-2 flex justify-between">
                        <Button
                            type="button"
                            onClick={() => onClose()}
                            variant="outline"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                        >
                            {veiculo?.id_veiculo ? "Atualizar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}