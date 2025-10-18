
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PlanoContasProps } from "@/app/dashboard/financeiro/_types/plano-contas";
import { SetorProps } from "../../../vendas/_components/sales/FilterModal";
import { MetaProps } from "../../_types/meta";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ChevronDown, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatarComVirgula } from "@/utils/normalizarValorEditar";
import { normalizarValor } from "@/utils/normalizarValor";


interface DataProps {
    planoContas?: Array<PlanoContasProps>
    show: boolean,
    setModalMetas: (open: boolean) => void
    arraySetores: Array<SetorProps>
    meta: Partial<MetaProps> | null
    arrayMetas: Array<MetaProps>
    id_empresa: string | undefined,
    handleNovaMeta: (data: MetaProps) => Promise<void>
    handleSalvar: SubmitHandler<MetaProps>
}

export interface MetaFormProps extends MetaProps {
    radio: string;
}

type MetaValores = Omit<MetaFormProps, 'valor'> & {
    valor: string
}

export function ModalMetas({ show, setModalMetas, meta, arraySetores, planoContas, handleSalvar }
    : DataProps) {

    const isEditMode = !!meta?.id_meta;
    const radioTipo = meta?.id_conta ? "GASTOS" : "VENDAS"

    const { register, control, handleSubmit, watch, setValue, reset } = useForm<MetaValores>({
        defaultValues: {
            ...meta,
            data_lanc: meta?.data_lanc ?? new Date(),
            radio: radioTipo,
            id_conta: meta?.id_conta ?? "",
            valor: ''
        }
    })

    const [openDataInicio, setOpenDataInicio] = useState(false);
    const [openDataFim, setOpenDataFim] = useState(false);

    useEffect(() => {
        if (show) {


            const valor = formatarComVirgula(meta?.valor)


            reset({
                ...meta,
                data_lanc: meta?.data_lanc ?? new Date(),
                radio: meta?.id_conta ? "GASTOS" : "VENDAS",
                id_conta: meta?.id_conta ?? "",
                valor: valor
            });
        }
    }, [meta, show, reset]);


    return (
        <Dialog open={show} onOpenChange={setModalMetas}>
            <DialogContent className="max-w-md p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold mb-2">
                        {isEditMode ? "Editar Meta" : "Adicionar Meta"}
                    </DialogTitle>
                    <DialogDescription>{isEditMode ? 'Altere os dados da meta conforme necessário e clique em atualizar para salvar as mudanças.'
                        : 'Escolha o tipo de meta, preencha os dados e clique em adicionar para salvar uma nova meta na lista.'}</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit((data) => {

                        const valor = normalizarValor(data.valor)

                        const payload = {
                            ...data,
                            valor: valor
                        }

                        handleSalvar(payload)

                    })}
                    className="space-y-4">

                    <RadioGroup
                        value={isEditMode ? radioTipo : watch('radio')}
                        onValueChange={value => !isEditMode && setValue('radio', value)}
                        className="flex gap-8 justify-center mb-2"
                        disabled={isEditMode}
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="VENDAS" id="vendas" />
                            <Label htmlFor="vendas" className="cursor-pointer">Meta Vendas</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="GASTOS" id="gastos" />
                            <Label htmlFor="gastos" className="cursor-pointer">Meta Gastos</Label>
                        </div>
                    </RadioGroup>

                    {watch('radio') === 'GASTOS' && (
                        <Controller
                            control={control}
                            name="id_conta"
                            render={({ field }) =>
                                <div>
                                    <Label className="mb-1 block">Plano de Contas</Label>
                                    <Select
                                        onValueChange={value => setValue('id_conta', String(value))}
                                        value={field.value !== undefined ? String(field.value) : ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o plano" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {planoContas?.map((item) => (
                                                <SelectItem key={item.conta} value={String(item.conta)}>
                                                    {item.descricao}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            }
                        />
                    )}

                    <Controller
                        control={control}
                        name="id_grupo"
                        render={({ field }) =>
                            <div>
                                <Label className="mb-1 block">Setor</Label>
                                <Select
                                    onValueChange={value => setValue('id_grupo', Number(value))}
                                    value={field.value !== undefined ? String(field.value) : ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {arraySetores?.map((item) => (
                                            <SelectItem key={item.id_grupo} value={String(item.id_grupo)}>
                                                {item.descricao}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        }
                    />

                    <div>
                        <Label htmlFor="descricao" className="mb-1 block">Descrição</Label>
                        <Input
                            id="descricao"
                            {...register('descricao')}
                            placeholder="Descrição"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="date" className="px-1">
                                Data início
                            </Label>
                            <Controller
                                control={control}
                                name="date"
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-48 justify-between font-normal"
                                                    type="button"
                                                >
                                                    {value ? format(value, "dd/MM/yyyy") : "Selecione a data"}
                                                    <ChevronDown size={16} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={value}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        onChange(date);
                                                        setOpenDataInicio(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="dateFimMeta" className="px-1">
                                Data Fim
                            </Label>
                            <Controller
                                control={control}
                                name="dateFimMeta"
                                render={({ field: { onChange, value } }) => {

                                    return (
                                        <Popover open={openDataFim} onOpenChange={setOpenDataFim}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="dateFimMeta"
                                                    className="w-48 justify-between font-normal"
                                                    type="button"
                                                >
                                                    {value ? format(value, "dd/MM/yyyy") : "Selecione a data"}
                                                    <ChevronDown size={16} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={value}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        onChange(date);
                                                        setOpenDataFim(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <div>
                            <TooltipProvider>
                                <Label className="mb-1 flex items-center gap-2">
                                    Data Lançamento
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex items-center">
                                                <Info size={18} className="text-blue-500 hover:text-blue-700 transition-colors" />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-blue-50 text-blue-900 border border-blue-200 rounded-md px-3 py-2 text-xs shadow-md max-w-[220px]">
                                            Este campo é preenchido automaticamente com a data do lançamento.<br />
                                            <span className="font-semibold">Não é necessário inserir.</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </Label>
                            </TooltipProvider>
                            <Controller
                                control={control}
                                name="data_lanc"
                                render={({ field: { value } }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="w-full text-xs border rounded-sm bg-gray-50 border-gray-300 placeholder-gray-400 px-3 py-2 text-left cursor-not-allowed"
                                                disabled
                                            >
                                                {value ? format(value, "dd/MM/yyyy") : "Data automática"}
                                            </button>
                                        </PopoverTrigger>
                                    </Popover>
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="valor" className="mb-1 flex">Valor</Label>
                            <Input
                                id="valor"
                                {...register('valor')}
                                type="text"
                                placeholder="Digite o valor"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full">
                            {meta?.id_meta ? "Atualizar" : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )


}