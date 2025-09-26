import { memo, useCallback } from 'react';
import { CardValuesCaixa } from "./card-values-caixa"
import { Control, Controller, SubmitHandler, UseFormHandleSubmit } from "react-hook-form"
import { DatePickerInput } from "@/components/DatePickerInput";
import { BiCalendarMinus } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineLaunch } from "react-icons/md";
import ActionsCaixa from "./ActionsCaixa";
import { FormCaixaProps, LancamentosProps, ResponseCaixaProps } from "../_types/types";

interface CaixaHeaderProps {
    saldo: number,
    despesas: number,
    valorForma: Record<string, number> | undefined,
    data: Partial<ResponseCaixaProps> | undefined
    control: Control<FormCaixaProps>
    handleSubmit: UseFormHandleSubmit<FormCaixaProps>
    listarLancamentos: SubmitHandler<FormCaixaProps>
    register: any;
    tipoFiltro: string;
    setTipoFiltro: (value: string) => void;
    infoEmpresa: any;
    setFilteredData: (value: Partial<ResponseCaixaProps>) => void;
    setModal: (props:{ [key: string]: boolean }) => void;
    setMov: (value: Partial<LancamentosProps>) => void;
    setSelectRelatorio: (value: string | null) => void;
}


const HeaderCaixaComponent = memo(({ 
  saldo, 
  despesas, 
  valorForma, 
  data, 
  control, 
  handleSubmit, 
  listarLancamentos, 
  register, 
  tipoFiltro, 
  setTipoFiltro, 
  infoEmpresa, 
  setFilteredData, 
  setModal, 
  setMov, 
  setSelectRelatorio 
}: CaixaHeaderProps) => {
    return (
        <div>

            <form
                onSubmit={handleSubmit(listarLancamentos)}
                className="flex w-full items-end flex-row justify-end p-1 gap-4 text-black pr-2 "
            >

                <CardValuesCaixa saldo={saldo} despesas={despesas} valorForma={valorForma} data={data} />

                <div className="flex items-center gap-2">
                    <div>
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field: { onChange, value } }) => (
                                <DatePickerInput
                                    value={value}
                                    onChange={(e) => e && onChange(e)}
                                    required
                                    className="flex w-full shadow-sm uppercase  z-50 text-[11px] leading-[14px]   border  rounded-sm    border-gray-200 placeholder-gray-400  "
                                />
                            )}
                        />
                    </div>

                    <BiCalendarMinus size={25} />

                    <div>
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field: { onChange, value } }) => (
                                <DatePickerInput
                                    value={value}
                                    onChange={(e) => e && onChange(e)}
                                    required
                                    className="flex shadow-sm w-full uppercase  z-50 text-[11px]   border  rounded-sm    border-gray-200 placeholder-gray-400 leading-[14px] "
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="w-1/3">
                    <Input
                        placeholder="Descrição"
                        className="w-full h-8 text-[11px]"
                        {...register("descricao")}
                    />
                </div>

                <div className="w-[150px]">
                    <Select
                        value={tipoFiltro}
                        onValueChange={(value) => {
                            setTipoFiltro(value);
                            if (data?.lista) {
                                const filtered = {
                                    ...data,
                                    lista: value === 'TODOS'
                                        ? data.lista
                                        : data.lista.filter(item => item.tipo === value)
                                };
                                setFilteredData(filtered);
                            }
                        }}
                    >
                        <SelectTrigger className="h-8 text-[11px] w-full">
                            <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos</SelectItem>
                            <SelectItem value="RECEITA">RECEITAS</SelectItem>
                            <SelectItem value="DESPESA">DESPESAS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant={"outline"} size={"sm"} type="submit">
                    <IoSearchSharp /> Buscar
                </Button>

                <Button
                    variant={"outline"}
                    onClick={() => {
                        setMov({
                            conta: "",
                            conta_n: "",
                            ccustos_desc: "",
                            data: undefined,
                            datalanc: new Date(),
                            descricao: "",
                            historico: "",
                            num_seq: null,
                            tipo: "",
                            usuario: "",
                            valor: null,
                            ccustos_id: null,
                            notafiscal: "",
                        }),
                            setModal({ lancar: true });
                    }}
                    size={"sm"}
                    type="button"
                >
                    <MdOutlineLaunch />
                    Lançar
                </Button>
                <ActionsCaixa
                    infoEmpresa={infoEmpresa}
                    id_empresa={infoEmpresa?.id ?? ""}
                    data={data}
                    setSelectRelatorio={setSelectRelatorio}
                />
            </form>

        </div>
    );
});

const HeaderCaixa = memo(HeaderCaixaComponent);

export default HeaderCaixa;