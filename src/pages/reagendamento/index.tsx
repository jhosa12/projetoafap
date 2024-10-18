import { Button, Card, Label, Table } from "flowbite-react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useForm } from "react-hook-form";
import { ModalBusca } from "@/components/modal";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";


interface AgendamentoProps {
    dataAge:Date
}



export default function Reagendamento() {
    const {data,closeModa,dadosassociado,setarDadosAssociado,usuario}= useContext(AuthContext)
    const {setValue,watch} = useForm<AgendamentoProps>({defaultValues:{dataAge:new Date()}})
    const [selecionadas,setSelecionadas] = useState<Array<number>>([])



    const handleReagendar = async()=>{
        try {
            const response = await toast.promise(
                api.put('/mensalidade/reagendamento', {
                    data: watch('dataAge'),
                    mensalidades:selecionadas,
                    id_global: dadosassociado?.id_global,
                    usuario:usuario?.id
                }),
                {
                    error: 'Erro na Requisição',
                    pending: 'Realizando Reagendamento',
                    success: 'Reagendamento realizado com sucesso'
                }
            )
            setSelecionadas([])
            setarDadosAssociado({mensalidade:response.data})
        } catch (error) {
            
        }
    }


    const handleSelecionadas = (id:number)=>{

        if(selecionadas.includes(id)){
            setSelecionadas(selecionadas.filter(e=>e!==id))
        }else{
            setSelecionadas([...selecionadas,id])
        }
    }

    useEffect(()=>{
        if(dadosassociado?.contrato?.situacao === 'INATIVO'){
            toast.warning('Contrato inativo')
        }
    },[dadosassociado?.id_global])


    return (
    <div className=" p-2 space-y-2 bg-white rounded-lg m-2 h-[89vh]">

        <Button onClick={()=>closeModa({closeModalPlano:true})} size={'sm'} className="ml-auto">Filtro</Button>
        <Card theme={{root:{children:"flex h-full flex-col  gap-2 px-4 py-2"}}}>
            <div className="inline-flex justify-between">
            <div>
            <div className="font-semibold inline-flex gap-3">
               <h1>{dadosassociado?.contrato?.id_contrato}-{dadosassociado?.nome}</h1> 
               <span className={`inline-flex items-center  text-sm font-medium px-2.5 py-0.5 rounded-full ${dadosassociado?.contrato?.situacao === 'ATIVO' ? "bg-green-700 text-green-300" : "bg-red-700 text-red-300"}`}>
                                        <span className={`w-2 h-2 me-1 ${dadosassociado?.contrato?.situacao === 'ATIVO' ? "bg-green-400 " : "bg-red-500"}  rounded-full`}></span>
                                        {dadosassociado?.contrato?.situacao}
                                    </span>
                </div>
            <p className="text-sm text-gray-600">ENDEREÇO: {dadosassociado?.endereco}  Nº {dadosassociado?.numero}</p>
            <p className="text-sm text-gray-600">BAIRRO: {dadosassociado?.bairro}</p>
            <p className="text-sm text-gray-600">CIDADE: {dadosassociado?.cidade}/{dadosassociado?.uf}</p>
            </div>

            <div className=" space-y-1">
                <div className="flex flex-col w-full">
                    <Label htmlFor="agendamento" value="Agendar Para:" />
                    <DatePicker selected={watch('dataAge')} dateFormat={"dd/MM/yyyy"} showMonthDropdown className="flex w-full text-sm p-1.5 rounded-lg bg-gray-50 border-gray-300" onChange={e=>e && setValue( 'dataAge',e)} locale={pt}/>
                </div>
                <Button onClick={handleReagendar} size={'xs'} className="w-full">AGENDAR</Button>
            
            </div>

            </div>
         
           

        </Card>
        <div className="overflow-y-auto max-h-[63vh]">
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}>
            <Table.Head>
                <Table.HeadCell>NP</Table.HeadCell>
                <Table.HeadCell>REFERENC.</Table.HeadCell>
                <Table.HeadCell>VENCIMENTO</Table.HeadCell>
                <Table.HeadCell>COBRANÇA</Table.HeadCell>
                <Table.HeadCell>VALOR</Table.HeadCell>
                <Table.HeadCell>STATUS</Table.HeadCell>
               
            </Table.Head>
            <Table.Body className="divide-y">
               {dadosassociado?.mensalidade?.map((item,index)=>(
                   item.status!=="P" && <Table.Row key={item.id_mensalidade_global} onClick={()=>handleSelecionadas(item.id_mensalidade_global)} className={`hover:cursor-pointer font-semibold ${selecionadas.includes(item.id_mensalidade_global) && 'bg-blue-100'}`}>
                    <Table.Cell >{item.parcela_n}</Table.Cell>
                    <Table.Cell>{item.referencia}</Table.Cell>
                    <Table.Cell> {new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                    <Table.Cell> {new Date(item.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                    <Table.Cell>{Number(item.valor_principal).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                    <Table.Cell className="text-red-600 ">{item.status}</Table.Cell>
                </Table.Row>
               ))}
            </Table.Body>
        </Table>
        </div>


{   data.closeModalPlano &&  <ModalBusca/>}
    </div>


)
}