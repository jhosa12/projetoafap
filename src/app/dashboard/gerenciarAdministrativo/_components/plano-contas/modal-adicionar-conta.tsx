import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanoContasProps } from "../../../financeiro/_types/plano-contas";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
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
                    <DialogTitle>{itemEdit ? 'Editar Plano de Contas' : 'Adicionar Plano de Contas'}</DialogTitle>
                    <DialogDescription>{itemEdit ? 'Altere os dados do plano de contas conforme necessário e clique em atualizar para salvar as mudanças.'
                        : 'Preencha os dados e clique em adicionar para salvar um novo plano de contas na lista.'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleSalvar)} className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="conta">Conta</Label>
                        <Input   {...register('conta')} placeholder="Ex: 1.01.01" autoComplete="off" type="text" required />
                    </div>

                    <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input {...register('descricao')} className="h-8" placeholder="Ex: Saídas" required />

                    </div>
                    <Controller
                        control={control}
                        name="tipo"
                        render={({ field: { onChange, value } }) => (
                            <div>
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select value={value} onValueChange={onChange} required>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Selecione o tipo de conta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RECEITA">Receita</SelectItem>
                                        <SelectItem value="DESPESA">Despesa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name="perm_lanc"
                        render={({ field: { onChange, value } }) => (
                            <div>
                                <Label>Lançável?</Label>
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="perm_lanc" className="h-8">
                                        <SelectValue placeholder="Selecione se é lançável" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="S">Sim</SelectItem>
                                        <SelectItem value="N">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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