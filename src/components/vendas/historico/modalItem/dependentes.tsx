import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Table as ShadcnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerInput } from "@/components/DatePickerInput";
import { UseFormLeadProps } from "./modalItem";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MdClose } from "react-icons/md";
import { DependentesProps } from "@/app/dashboard/admcontrato/_types/associado";
import { parentescos } from "@/utils/arrayParentesco";
import { toast } from "sonner";






export function TabDependentes({ control, register, setValue, trigger, watch }: UseFormLeadProps) {
    const [open, onClose] = useState(false)
    const [novo, setNovo] = useState(false)

    const { register: registerDependente, setValue: setValueDependente, handleSubmit, control: controlDependente } = useForm<DependentesProps>()

    const handleOnSubmit: SubmitHandler<DependentesProps> = async (data) => {
        novo ? handleAdicionarDependente(data) : handleEditarDependente(data)
    }

    const handleEditarDependente = (data: DependentesProps) => {



    }
    const handleAdicionarDependente = (data: DependentesProps) => {
        if (!data.nome || !data.grau_parentesco) {
            toast.error("Preencha os campos obrigatorios")
            return
        }

        setValue('dependentes', (watch('dependentes') ?? []).concat(data))

    }
    const handleDeleteDependente = (index: number) => {
        setValue('dependentes', watch('dependentes').filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex gap-2 pb-2 ml-auto">
                <Button type="button" variant="outline" size="sm" onClick={() => { setNovo(true); onClose(true) }}>
                    NOVO
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setNovo(false); onClose(true) }}>
                    EDITAR
                </Button>
            </div>
            <div>
                <ShadcnTable>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs uppercase">Nome</TableHead>
                            <TableHead className="text-xs uppercase">Parentesco</TableHead>
                            <TableHead className="text-xs uppercase">Data de Nascimento</TableHead>
                            <TableHead className="text-xs uppercase">Celular</TableHead>
                            <TableHead className="text-xs uppercase">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {watch('dependentes')?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-xs">{item?.nome}</TableCell>
                                <TableCell className="text-xs">{item?.grau_parentesco}</TableCell>
                                <TableCell className="text-xs">
                                    {item?.data_nasc && new Date(item?.data_nasc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </TableCell>
                                <TableCell className="text-xs">{item?.celular}</TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteDependente(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <MdClose size={13} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ShadcnTable>
            </div>

            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader />
                    <div className="grid grid-cols-3 gap-2" >
                        <div className="col-span-2">
                            <Label className="text-xs">Nome</Label>
                            <Controller
                                name="nome"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full"
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className="">
                            <Label className="text-xs">Data de Nascimento</Label>
                            <Controller
                                name="data_nasc"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <DatePickerInput
                                        value={value}
                                        onChange={onChange}
                                        className="h-9"
                                    />
                                )}
                            />
                        </div>

                        <div className="">
                            <Label className="text-xs">Celular</Label>
                            <Controller
                                name="celular"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        type="tel"
                                        placeholder="Celular"
                                        className="w-full"
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className="">
                            <Label className="text-xs">Parentesco</Label>
                            <Controller
                                name="grau_parentesco"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <Select value={value} onValueChange={onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parentescos.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="">
                            <Label className="text-xs">Carencia</Label>
                            <Controller
                                name="carencia"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <DatePickerInput
                                        value={value}
                                        onChange={onChange}
                                        className="h-9"
                                    />
                                )}
                            />
                        </div>
                        <div className="">
                            <Label className="text-xs">Adesão</Label>
                            <Controller
                                name="data_adesao"
                                control={controlDependente}
                                render={({ field: { onChange, value } }) => (
                                    <DatePickerInput
                                        value={value}
                                        onChange={onChange}
                                        className="h-9"
                                    />
                                )}
                            />
                        </div>

                        <div className="col-span-3 flex justify-end">
                            <Button type="button" onClick={handleSubmit(handleOnSubmit)}>
                                {novo ? 'Adicionar' : 'Editar'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}