import { Button, Label, Modal, Select, TextInput } from "flowbite-react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import ReactInputMask from "react-input-mask"
import { DadosInputs } from "../preAgendamento"
import { ClientProps, EventProps, MedicoProps } from "@/pages/afapSaude"
import { toast } from "react-toastify"
import { api } from "@/services/apiClient"
import { ChangeEvent, useState } from "react"


interface DataProps {
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    arrayMedicos: Array<MedicoProps>
    events: Array<EventProps>
  
    id_usuario: string,
    pre:Array<ClientProps>
    setPre:(array:Array<ClientProps>)=>void,
    dados:Partial<DadosInputs>
}


export function ModalPreAgend({openModal,setOpenModal,arrayMedicos,events,id_usuario,pre,setPre,dados}:DataProps) {
    const {setValue,watch,handleSubmit,register,control} = useForm<DadosInputs>({
        defaultValues:dados
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [intervals, setIntervalo] = useState<Array<{
        start: Date,
        end: Date,
        reserv: boolean
    }>>([])

     

    const editarEvento = async (data: DadosInputs) => {
        const dadosMedico =arrayMedicos.find(item=>item.id_med===Number(data?.id_med))
        try {
            const evento = await toast.promise(
                api.put("/agenda/preAgendamento/editar", {
                    id_agcli: data?.id_agcli,
                    id_agmed: data?.id_agmed,
                    status: data?.id_agmed !== dados.id_agmed && data.id_agmed ? 'AGENDADO' : data?.status,
                    id_med: Number(data?.id_med),
                    medico:`${dadosMedico?.nome} (${dadosMedico?.espec})`,
                    nome: data?.nome,
                    title: data?.title,
                    celular: data?.celular,
                    endereco: data?.endereco,
                    data_prev: data?.data_prev? data?.data_prev : null,

                }),
                {
                    error: 'Erro na requisição',
                    pending: 'Gerando Evento..',
                    success: 'Evento Gerado com sucesso'
                }

            )
            let novo: Array<ClientProps> = [...pre]
            const index = pre.findIndex(item => item.id_agcli === data?.id_agcli)
         

                    novo[index] = { ...evento.data }
              
                setPre(novo)

    

        } catch (error) {
            toast.error('Erro ao gerar evento')
        }
    }

    const handleOnSubmit:SubmitHandler<DadosInputs> = async(data)=>{
        data.id_agcli ? editarEvento(data) : novoEvento(data)
    }


    const novoEvento = async (data: DadosInputs) => {
        try {
          const dadosMedico =arrayMedicos.find(item=>item.id_med===Number(data?.id_med))
            setLoading(true)
            const evento = await toast.promise(
                api.post("/agenda/agendamentoCliente/adicionar", {
                    data: new Date(),
                    id_usuario: id_usuario,
                    nome: data?.nome,
                    id_med: Number(data?.id_med),
                    medico:`${dadosMedico?.nome} (${dadosMedico?.espec})`,
                    endereco: data?.endereco,
                    celular: data?.celular,
                    title: data?.title,
                    id_agmed: Number(data?.id_agmed),
                    data_prev: data?.data_prev,
                    //obs: dataEvent.obs,
                   

                }),
                {
                    error: 'Erro na requisição',
                    pending: 'Gerando Evento..',
                    success: 'Evento Gerado com sucesso'
                }

            )
            setLoading(false)
            setPre([...pre, evento.data])

           // toggleDrawer()



            /*  */
        } catch (error) {
            toast.error('Erro ao gerar evento')
        }

    }


    const selectMed = (e: ChangeEvent<HTMLSelectElement>) => {
     
        if (e.target.value) {
            const evento = events.find(item => item.id_agmed === Number(e.target.value))
            const medico = arrayMedicos.find(item => item.id_med === evento?.id_med)

            setValue( 'id_agmed', Number(e.target.value)??null )
     setValue('data_prev', evento?.start??undefined)

           /* if (evento && medico)
             gerarIntervalos({ clientes: evento.clientes, start: evento.start, end: evento.end, time: medico.time })*/

        }
        else {
            setValue( 'id_agmed',null )
            setValue('data_prev', undefined)
        }
    }

    const gerarIntervalos = ({ start, end, time, clientes }: { start: Date, end: Date, time: number, clientes: Array<ClientProps> }) => {

        const startTime = new Date(start);

        const endTime = new Date(end);
        const intervals = [];

        while (startTime < endTime) {
            const intervalStart = new Date(startTime);
            startTime.setMinutes(startTime.getMinutes() + Number(time));
            const intervalEnd = new Date(startTime);

            if (intervalEnd <= endTime) {

                intervals.push({
                    start: intervalStart,
                    end: intervalEnd,
                    reserv: clientes?.some(item => new Date(item.start).getTime() === intervalStart.getTime())
                });
            }

        }
        setIntervalo(intervals);

    };




    return (
        <Modal dismissible show={openModal} onClose={() => setOpenModal(!openModal)}>
        <Modal.Header>Administrar Pré Agendamento</Modal.Header>
        <Modal.Body >
            <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-3 w-full text-black font-semibold">

                <div >
                    <div className="mb-1 block">
                        <Label htmlFor="small" value="Nome" />
                    </div>
                    <TextInput {...register('nome')} id="small" type="text" sizing="sm" />
                </div>
                <div className="inline-flex gap-4 w-full">
                    <div className="w-full">
                        <div className="mb-1 block">
                            <Label htmlFor="small" value="Celular" />
                        </div>
                        <Controller
                            name="celular"
                            control={control}
                            render={({ field:{onChange,value} }) => (
                                <ReactInputMask mask={'(99) 9 9999-9999'} value={value} onChange={e => onChange(e.target.value )} className="block py-2 text-black px-2 w-full rounded-lg border 0  bg-gray-50 text-xs border-gray-300 " />
                            )}
                        />
                       
                    </div>
                    <div className="w-full">
                        <div className="mb-1 block">
                            <Label htmlFor="small" value="Endereço" />
                        </div>
                        <TextInput {...register('endereco')}  type="text" sizing="sm" />
                    </div>
                  

                </div>
                
                <div className="w-full">
                    <div className="mb-1 block">
                        <Label htmlFor="small" value="Especialista" />
                    </div>
                    <Select  {...register('id_med')} sizing="sm" >
                        <option value={''}></option>
                        {arrayMedicos.map((item, index) => (
                            <option key={item.id_med} value={item.id_med}>{`${item.nome}-(${item.espec})`}</option>
                        ))}
                    </Select>
                </div>
                
                    <div className="inline-flex gap-4 w-full">
                        <div className="w-full">
                            <div className="mb-1 block">
                                <Label htmlFor="small" value="Consulta/Data" />
                            </div>
                            <Select id="small" value={watch('id_agmed')??''}  onChange={selectMed} sizing="sm" >
                                <option value={''}></option>
                                {events.map((item, index) => (
                                   item.id_med === Number(watch('id_med')) && <option key={item.id_agmed} value={item.id_agmed??''}>{new Date(item.start).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-full">
                            <div className="mb-1 block">
                                <Label htmlFor="small" value="Horário" />
                            </div>
                            <Select disabled id="small" onChange={e => {
                               // setValue( 'start', intervals[Number(e.target.value)].start),
                               // setValue( 'end' ,intervals[Number(e.target.value)].end )
                            }} sizing="sm" >
                                <option selected value={''}></option>
                                {intervals?.map((item, index) => (
                                    <option disabled={item.reserv} key={index} value={index}>{new Date(item.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Button className="ml-auto" type="submit" isProcessing={loading}>{!watch('id_agcli') ?"Salvar":"Alterar"}</Button> 
            </form>
        </Modal.Body>
        
           
     
    </Modal>
    )

}