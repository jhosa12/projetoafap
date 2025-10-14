import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanoContasProps } from "../../../financeiro/_types/plano-contas";
import { useEffect } from "react";
interface ModalProps {
    open: boolean,
    onClose: () => void
    handleSalvar: SubmitHandler<PlanoContasProps>
    itemEdit?: PlanoContasProps | null
}

export const ModalAdicionar = ({ open, onClose, handleSalvar, itemEdit }: ModalProps) => {
    const { register, setValue, handleSubmit, control, reset } = useForm<PlanoContasProps>({
        defaultValues: itemEdit || {}
    })

    useEffect(() => {
        if (open && itemEdit) {
            reset(itemEdit);
        } else if (!open) {
            reset({
                conta: "",
                descricao: "",
                tipo: "",
                perm_lanc: "",
            })
        }
    }, [open, itemEdit, reset]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{itemEdit ? 'Editar Conta' : 'Adicionar Conta'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleSalvar)} className="flex flex-col gap-4">
                    <Input   {...register('conta')} placeholder="Conta" autoComplete="off" type="text" required />

                    <Input {...register('descricao')} className="h-8" placeholder="Descrição" required />

                    <Controller
                        control={control}
                        name="tipo"
                        render={({ field: { onChange, value } }) => (
                            <Select value={value} onValueChange={onChange} required>
                                <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="RECEITA">Receita</SelectItem>
                                    <SelectItem value="DESPESA">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    <Controller
                        control={control}
                        name="perm_lanc"
                        render={({ field: { onChange, value } }) => (
                            <Select value={value} onValueChange={onChange}>
                                <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Lançavel ?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="S">Sim</SelectItem>
                                    <SelectItem value="N">Não</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />


                    <Button
                        type="submit"
                    >
                        {itemEdit ? 'Atualizar' : 'Adicionar'}
                    </Button>
                </form>


            </DialogContent>
        </Dialog>
    )
}