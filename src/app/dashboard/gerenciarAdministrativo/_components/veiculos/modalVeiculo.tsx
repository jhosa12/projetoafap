import { VeiculoProps } from "@/types/veiculo"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm } from "react-hook-form"

type DataProps = {
    openModal: boolean
    onClose: () => void,
    veiculo: VeiculoProps | null,
    handleNovoVeiculo: (data: VeiculoProps) => Promise<void>
    handleSalvar: SubmitHandler<VeiculoProps>
}

export function ModalVeiculo({ onClose, openModal, veiculo, handleNovoVeiculo, handleSalvar }: DataProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<VeiculoProps>({
        defaultValues: veiculo || {}
    })

    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>VEÍCULO</DialogTitle>
                </DialogHeader>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(handleSalvar)}>
                    <Field>
                        <FieldLabel>MODELO</FieldLabel>
                        <Input {...register('modelo', { required: "Campo obrigatório" })} placeholder="MODELO" />
                    </Field>
                    <Field>
                        <FieldLabel>MARCA</FieldLabel>
                        <Input {...register('marca', { required: "Campo obrigatório" })} placeholder="MARCA" />

                    </Field>
                    <Field>
                        <FieldLabel>ANO</FieldLabel>
                        <Input {...register('ano', { required: "Campo obrigatório" })} placeholder="ANO" />
                    </Field>
                    <Field>
                        <FieldLabel>COR</FieldLabel>
                        <Input {...register('cor', { required: "Campo obrigatório" })} placeholder="COR" />
                    </Field>
                    <Field>
                        <FieldLabel>PLACA</FieldLabel>
                        <Input {...register('placa', { required: "Campo obrigatório" })} placeholder="PLACA" />
                    </Field>
                    <Field>
                        <FieldLabel>CHASSI</FieldLabel>
                        <Input {...register('chassi', { required: "Campo obrigatório" })} placeholder="CHASSI" />
                    </Field>
                    <DialogFooter className="col-span-2 flex justify-between">
                        <Button type="submit" variant="default">
                            {veiculo?.id_veiculo ? "Atualizar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}