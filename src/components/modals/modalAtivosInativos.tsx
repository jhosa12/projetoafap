
import { Controller, useForm } from "react-hook-form"
import { Dialog,DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useEffect, useRef } from "react"
import { Select, SelectItem, SelectContent, SelectTrigger } from "../ui/select"
import { SelectValue } from "@radix-ui/react-select"
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../ui/button"
import useApiPost from "@/hooks/useApiPost"
import { AtivosInativos } from "@/Documents/ativosInativos/ListaAtivosInativos"
import { useReactToPrint } from "react-to-print"
import { ajustarData } from "@/utils/ajusteData"
import { Spinner } from "flowbite-react"
import { DatePickerInput } from "../DatePickerInput"
import { pageStyle } from "@/utils/pageStyle"
import { MultiSelects } from "../ui/multiSelect"
import { ConsultoresProps } from "@/types/consultores"

interface ModalProps {
    open: boolean
    onClose: () => void,
    id_empresa: string
    logo: string | undefined,
    usuario: string | undefined
    cidadesEmpresa: string[]
    bairrosEmpresa: Array<{ cidade: string; bairro: string }>;
    cobradores:Array<ConsultoresProps>|undefined
}

interface FormProps {
    startDate: Date,
    endDate: Date,
    tipo: string,
    cidade?: string,
    bairros?: string[],
    cobrador?:string[]
}


interface RequestProps {
    startDate?: string,
    endDate?: string,
    tipo: string,
    cidade?: string,
    bairros?: string[],
    id_empresa:string
}

interface ResponseProps {
    id_contrato: number,
    dt_adesao: Date,
    dt_cancelamento: Date,
    associado: {
        nome: string,
        endereco: string,
        bairro: string,
        cidade: string,
        celular1: string,

    }
}

export const ModalAtivosInativos = ({ open, onClose, id_empresa, logo, usuario, cidadesEmpresa, bairrosEmpresa,cobradores }: ModalProps) => {
    const currentRef = useRef<HTMLDivElement>(null)
    const { register, watch, setValue, handleSubmit, reset, control } = useForm<FormProps>({
        defaultValues: {
            startDate: new Date(new Date().setDate(1)),
            endDate: new Date(),

        }
    })
    const { data, loading, postData, setData } = useApiPost<Array<ResponseProps>, RequestProps>('/listarAtivosInativos')
    const bairrosFilter = watch('cidade')? bairrosEmpresa.filter(item=>item.cidade===watch('cidade')):bairrosEmpresa
    const onSubmit = async (data: FormProps) => {
        const { dataIni, dataFim } = ajustarData(data.startDate, data.endDate)
        await postData({
            ...data,
            startDate: dataIni,
            endDate: dataFim,
            id_empresa
        })
        // onClose()
    }

    useEffect(() => {

        if (data) imprimir()
      
    }, [data])

    const imprimir = useReactToPrint({
        pageStyle: pageStyle,
        contentRef:currentRef,
        onAfterPrint: async() => setData(null)
    })

    const handleCidadeChange = (value: string) => {
        setValue('cidade', value);
        setValue('bairros', [])
      };


    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent className="max-w-sm">
                <DialogHeader>
                   <DialogTitle>Ativos/Inativos</DialogTitle>
                    </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 w-full">

                    <div>
                        <label className="text-xs  font-semibold">Tipo</label>

                        <Controller
                            control={control}
                            name="tipo"
                            render={({ field }) => (
                                <Select required value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger >
                                        <SelectValue placeholder="SELECIONE" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className="text-[11px]" value="ATIVO">ATIVOS</SelectItem>
                                        <SelectItem className="text-[11px]" value="INATIVO">INATIVOS</SelectItem>
                                    </SelectContent>

                                </Select>
                            )}
                        />


                    </div>

                     <Controller
                                    control={control}
                                    name="cidade"
                                    render={({ field }) => (
                                      <Select value={field.value} onValueChange={handleCidadeChange}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecionar cidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {cidadesEmpresa?.map((cidade, index) => (
                                            <SelectItem key={index} value={cidade?? ''}>
                                              {cidade}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />



                                     <Controller
                          name="bairros"
                          control={control}
                          render={({ field }) => (
                          <MultiSelects
                            maxDisplayItems={3}
                            options={bairrosFilter.map((district) => ({
                              value: district.bairro??"",
                              label: `${district.bairro}`,
                            }))??[]}
                            selected={field.value??[]}
                            onChange={field.onChange}
                            placeholder="Seleciona os bairros/distritos"
                            className="min-h-9"
                          />
                          )}
                          />
                    
                          <Controller
                          name="cobrador"
                          control={control}
                          render={({ field }) => (
                          <MultiSelects
                            maxDisplayItems={3}
                            options={cobradores?.map((cob) => ({
                              value: cob.nome??"",
                              label: `${cob.nome}`,
                            }))??[]}
                            selected={field.value??[]}
                            onChange={field.onChange}
                            placeholder="Selecione os cobradores"
                            className="min-h-9"
                          />
                          )}
                          />

                    <div className="inline-flex w-full gap-4">
                        <div className="flex flex-col">

                            <label className="text-xs font-semibold">Data Inicial</label>

                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field: { onChange, value } }) => (
                              <DatePickerInput
                                    onChange={onChange}
                                    value={value}
                              />
                                )}
                            />

                        </div>


                        <div className="flex flex-col">

                            <label className="text-xs  font-semibold">Data Final</label>

                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field: { onChange, value } }) => (
                                    <DatePickerInput
                                    onChange={onChange}
                                    value={value}
                              />
                                )}
                            />

                        </div>

                    </div>

                                    <div className="flex w-full justify-between">
                                    <Button type="button" size={'sm'} variant={'outline'} onClick={()=>reset({
                                        startDate: new Date(new Date().setDate(1)),
                                        endDate: new Date(),
                                        tipo: 'ATIVO',
                                        cidade: '',
                                        bairros: []
                                    })}>Limpar Parametros</Button>
                                    <Button disabled={loading} type="submit" size={'sm'} className="ml-auto">{loading ? <Spinner /> : 'Aplicar'}</Button>
                                    </div>
                   



                    {data && data?.length > 0 && <div style={{ display: 'none' }}>
                        <AtivosInativos  tipo={watch('tipo')} periodo={{ start: watch('startDate'), end: watch('endDate') }} logo={logo} ref={currentRef} dados={data ?? []} usuario={usuario} />
                    </div>}
                </form>
            </DialogContent>
        </Dialog>
    )
}