
import { api } from "@/lib/axios/apiClient"
import { FileInput, Label, Modal, Popover, Select, Textarea } from "flowbite-react"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaNotesMedical } from "react-icons/fa"
import { IoIosSave } from "react-icons/io"
import { toast } from "react-toastify"
import { ModalProcedimentos } from "./modalProcedimentos"
import { AuthContext } from "@/store/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BiMoneyWithdraw } from "react-icons/bi"
import useApiPost from "@/hooks/useApiPost"
import ReciboRepasse from "@/Documents/afapSaude/reciboRepasse"
import { useReactToPrint } from "react-to-print"
import pageStyle from "@/utils/pageStyle"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ajustarData } from "@/utils/ajusteData"
import { ConsultaProps, MedicoProps } from "@/types/afapSaude"


interface DataProps {
    openModal: boolean
    setOpenModal: (open: boolean) => void
    dataMedico: Partial<MedicoProps> | MedicoProps,
    setDataMedico: (medico: Partial<MedicoProps> | MedicoProps) => void
    medicos: Array<MedicoProps>,
    setArray: (array: Array<MedicoProps>) => void
}

interface ReqReciboProps {
    id_med: number
    startDate: string | undefined
    endDate: string | undefined,
   id_exame?:number
}





export function ModalMedico({ openModal, setOpenModal, dataMedico, medicos, setArray, setDataMedico }: DataProps) {
    const [openProcedimentos, setModalProcedimentos] = useState(false);
    const { usuario } = useContext(AuthContext)
    const { postData, data, setData, loading } = useApiPost<Array<ConsultaProps>, ReqReciboProps>('/reciboRepasse')
    const [date, setDate] = useState(new Date())
    const [id_exame,setIdExame] = useState('')
    const currentRef = useRef<ReciboRepasse>(null)


    const imprimirRecibo = useReactToPrint({
        pageStyle: pageStyle,
        content: () => currentRef.current,
        documentTitle: 'Recibo de Repasse',
        onAfterPrint: () => setData([])
    })

    const handleRecibo = async () => {

        if (!dataMedico.id_med) {
            return
        }
        const { dataFim, dataIni } = ajustarData(date, date)
        await postData({ id_med: dataMedico.id_med, startDate: dataIni, endDate: dataFim,id_exame:id_exame?Number(id_exame):undefined })
    }


    useEffect(() => {
        if (data && data.length > 0) imprimirRecibo()


    }, [data])







    const { register, formState: { errors }, handleSubmit, watch, control, reset, setValue } = useForm<MedicoProps>(
        {
            defaultValues: dataMedico
        }
    )




    const handleOnSubmit: SubmitHandler<MedicoProps> = (data) => {
        dataMedico.id_med ? editarMedico(data) : novoMedico(data)

    }



    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const imagem = e.target.files[0];

        if (imagem.type === 'image/jpeg' || imagem.type === 'image/png') {
            /* setarDadosMedico({...dataMedico,imageUrl:'',tmpUrl:URL.createObjectURL(e.target.files[0]),file:e.target.files[0]})*/
            setValue('file', e.target.files[0])
            setValue('imageUrl', '')
            setValue('tmpUrl', URL.createObjectURL(e.target.files[0]))
        }
    }



    async function novoMedico(dados: MedicoProps) {
        const data = new FormData()
        data.append("nome", dados.nome)
        data.append("espec", dados.espec)
        data.append("time", String(dados.time))
        data.append("sobre", dados.sobre)
        data.append("plano", String(dados.plano))
        data.append("funeraria", String(dados.funeraria))
        data.append("particular", String(dados.particular))
        const { file } = watch()
        if (file) {
            data.append("file", file)
        }
        try {
            const novo = await toast.promise(
                api.post("/agenda/novoMedico", data),
                {
                    error: 'Erro ao salvar dados',
                    pending: 'Salvando novos dados...',
                    success: 'Dados salvos com sucesso!'
                }
            )

            setArray([...medicos, novo.data])
            setOpenModal(false)
        } catch (error) {
            toast.error('Erro na requisição')
        }

    }



    async function editarMedico(dados: MedicoProps) {
        const data = new FormData()
        data.append("id_med", String(dados.id_med))
        data.append("nome", dados.nome ?? '')
        data.append("espec", dados.espec ?? '')
        data.append("sobre", dados.sobre ?? '')
        data.append("time", String(dados.time) ?? '')
        data.append("imageUrl", dados.imageUrl ?? '')
        data.append("plano", String(dados.plano) ?? '')
        data.append("funeraria", String(dados.funeraria) ?? '')
        data.append("particular", String(dados.particular) ?? '')
        if (dados.file) {
            data.append("file", dados.file)
        }
        try {
            const novo = await toast.promise(
                api.put("/agenda/editarMedico", data),
                {
                    error: 'Erro ao salvar dados',
                    pending: 'Salvando novos dados...',
                    success: 'Dados salvos com sucesso!'
                }
            )

            const novoArray = [...medicos]
            const index = novoArray.findIndex(item => item.id_med === dataMedico.id_med)
            novoArray[index] = { ...novo.data }
            setArray(novoArray)
        } catch (error) {
            toast.error('Erro na requisição')
        }
    }

    return (
        <>
            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                size={'2xl'}
                popup>
                <Modal.Header className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b  px-2 py-1 border-gray-60">
                    <span className="text-white text-base">Administrar Médico</span>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col space-y-2 px-2 pt-2  ">
                        <div className="flex flex-row gap-2">
                            <Button type="submit" size="sm" variant={'outline'}>
                                <IoIosSave className="h-3 w-3" />
                                {dataMedico.id_med ? 'Atualizar' : 'Salvar'}
                            </Button>
                            <Button onClick={() => setModalProcedimentos(true)} type="button" size="sm" variant={'outline'}>
                                <FaNotesMedical className="h-3 w-3" />
                                Procedimentos
                            </Button>

                            <Popover content={(<div className="flex flex-col p-2 gap-2" >

                                <div className="flex flex-col w-[200px]">
                                    <Label className="text-xs">Procedimento</Label>
                                    <Select value={id_exame} onChange={e => { e && setIdExame((e.target.value)) }} sizing="sm" className="text-xs">
                                        <option value="">TODOS</option>
                                        {dataMedico?.exames?.map(proc => (
                                            <option className="truncate" key={proc.id_exame} value={proc.id_exame}>{proc.nome}</option>
                                        ))}
                                    </Select>

                                </div>
                                <div className="flex flex-col">
                                    <Label className="text-xs">Data da Consulta</Label>
                                    <DatePicker className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " dateFormat={"dd/MM/yyyy"} onChange={e => { e && setDate(e) }} selected={date} locale={pt} />

                                </div>
                                <Button disabled={loading} onClick={handleRecibo} type="button" size="sm">{loading ? 'Carregando...' : 'Aplicar'}</Button>
                            </div>)}   >
                                <Button type="button" size="sm" variant={'outline'}>
                                    <BiMoneyWithdraw className="h-3 w-3" />
                                    Recibo de repasse
                                </Button>
                            </Popover>

                        </div>

                        <Label
                            htmlFor="dropzone-file"
                            className="flex relative w-full cursor-pointer mt-2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <svg
                                className="absolute  z-5 mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            {!watch('imageUrl') && !watch('tmpUrl') && <div className="flex flex-col items-center justify-center pt-6">
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG(MAX. 500x350px)</p>
                            </div>}
                            <FileInput onChange={handleFile} id="dropzone-file" className="hidden" />
                            {(watch('imageUrl') || watch('tmpUrl')) && <img className="w-full h-28 object-center rounded-lg" src={watch('imageUrl') ? `${process.env.NEXT_PUBLIC_API_URL}/file/${watch('imageUrl')}` : watch('tmpUrl')} alt="fotoUser"  ></img>}
                        </Label>

                        <Input {...register('nome')} placeholder="Nome do Médico" />

                        <Input {...register('espec')} placeholder="Especialidade" />
                        {/* <FloatingLabel sizing="sm" label="Nome do Médico" variant="outlined" {...register('nome')}  />
      <FloatingLabel sizing="sm" label="Especialidade" variant="outlined" {...register('espec')} />*/}


                        {/*     <FloatingLabel sizing="sm" label="Valor Plano" variant="outlined" type="number" {...register('plano')} />

        <FloatingLabel sizing="sm" label="Valor Funerária" variant="outlined" type="number" {...register('funeraria')} />

        <FloatingLabel sizing="sm" label="Valor Particular" variant="outlined" type="number" {...register('particular')} />*/}


                        <Input {...register('time')} placeholder="Intervalo médio entre consultas em minutos" />
                        { /*  <FloatingLabel sizing="sm" label="Intervalo médio entre consultas em minutos" variant="outlined" type="number" {...register('time')}/>*/}

                        <Textarea className="min-h-[40px] h-auto text-xs bg-white rounded-sm"  {...register('sobre')} rows={3} placeholder="Descreva suas atividades" />


                    </form>
                </Modal.Body>
            </Modal>

            {openProcedimentos && <ModalProcedimentos setMedico={setDataMedico} medicos={medicos} setArrray={setArray} usuario={usuario?.nome} medico={dataMedico} openModal={openProcedimentos} setOpenModal={setModalProcedimentos} />}


            <div style={{ display: 'none' }}>
                <ReciboRepasse
                    ref={currentRef}
                    dados={data ?? []}
                    especialidade={dataMedico.espec ?? ''}
                    exames={dataMedico.exames ?? []}
                    medico={dataMedico.nome ?? ''}
                    usuario={usuario?.nome ?? ''}
                />
            </div>


        </>
    )
}