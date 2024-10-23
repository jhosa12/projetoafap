import { ClientProps, EventProps, MedicoProps } from "@/pages/afapSaude"
import { da } from "date-fns/locale"
import { Button, Label, Modal, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import ReactInputMask from "react-input-mask"
import { a } from "react-spring"


interface DataProps {
    openModal:boolean
    setOpenModal:(open:boolean)=>void,
    arrayMedicos: Array<MedicoProps>,
    dataEvent:Partial<EventProps>
}


export function ModalAgendCliente({openModal,setOpenModal,dataEvent,arrayMedicos}:DataProps) {
    const {register,setValue,control,handleSubmit,watch} = useForm<EventProps>({defaultValues:dataEvent})
    const [intervals, setIntervalo] = useState<Array<{
        start: Date,
        end: Date,
        reserv: boolean
    }>>([])
const [loading,setLoading] = useState(false)


useEffect(()=>{

    const time =arrayMedicos.find(item=>item.id_med === dataEvent.id_med)?.time
    if(dataEvent.start && dataEvent.end  && time){
       
       // gerarIntervalos({end:dataEvent.end,start:dataEvent.start,time,clientes:dataEvent.clientes??[]})
    }
   
},[])

    const gerarIntervalos = ({ start, end, clientes,time }: { start: Date, end: Date, time: number, clientes: Array<ClientProps> }) => {

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
        <Modal.Header>Agendamento Cliente</Modal.Header>
        <Modal.Body >
            <div className="flex flex-col gap-3 w-full text-black font-semibold">

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
                                <ReactInputMask mask={'(99) 9 9999-9999'} value={value} onChange={e => onChange('celular', e.target.value )} className="block py-2 px-2 w-full rounded-lg border 0  bg-gray-50 text-xs border-gray-300 " />
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
                    <TextInput disabled value={arrayMedicos?.find(item => item.id_med === Number(watch('id_med')))?.nome} sizing="sm" />
                       
                   
                </div>
               
                    <div className="inline-flex gap-4 w-full">
                        <div className="w-full">
                            <div className="mb-1 block">
                                <Label htmlFor="small" value="Consulta/Data" />
                            </div>
                            <TextInput id="small" disabled value={new Date(watch('start')).toLocaleDateString('pt-BR')}  sizing="sm" />
                              
                        </div>
                        <div className="w-full">
                            <div className="mb-1 block">
                                <Label htmlFor="small" value="Horário" />
                            </div>
                            <Select id="small" onChange={e => {
                                setValue( 'start', intervals[Number(e.target.value)].start),
                                setValue( 'end' ,intervals[Number(e.target.value)].end )
                            }} sizing="sm" >
                                <option value={''}></option>
                                {intervals?.map((item, index) => (
                                    <option disabled={item.reserv} key={index} value={index}>{new Date(item.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
             <Button isProcessing={loading}>{!watch('id_agcli') ?"Salvar":"Alterar"}</Button> 
        </Modal.Footer>
    </Modal>
    )
}