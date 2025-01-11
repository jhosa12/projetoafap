
import { Table, Select, Dropdown, Checkbox,  Button,  TableHead, TableHeadCell, TableBody, TableCell, TableRow, Card, Pagination } from "flowbite-react";
import { CaixaProps, CcustosProps } from "@/pages/financeiro";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { FcMultipleInputs } from "react-icons/fc";
import { MdOutput } from "react-icons/md";
import { EmpresaProps } from "@/types/empresa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ModalResumoTags } from "./modalResumoTags";
import { ModalRelatorio } from "./modalRelatorio";
import { BiCalendarMinus } from "react-icons/bi";
import useApiPost from "@/hooks/useApiPost";
import { ajustarData } from "@/utils/ajusteData";


interface DataProps {
  arrayCcustos: Array<CcustosProps>
  setCcustos: (fields: Array<CcustosProps>) => void
  empresas: Array<EmpresaProps>
 
}

export interface SomaProps {
  pix: number,
  cartao: number,
  deposito: number,
  boleto: number,
  despesas: number,
  dinheiro: number,
  total: number,
  transferencia: number
}

export interface TagsProps{
  id:number,
  desc:string,
  check:boolean
}
interface FormProps{
  id_empresa:string,
  startDate:Date,
  endDate:Date,
}


interface ReqProps{
  array : Array<number>|[],
  id_empresa:string,
  dataInicio:String|undefined,
  dataFim:String|undefined
}

export function Caixa({ arrayCcustos, setCcustos, empresas }: DataProps) {
  const [somaValor, setSoma] = useState<SomaProps>({ boleto: 0, cartao: 0, deposito: 0, dinheiro: 0, pix: 0, total: 0, transferencia: 0 ,despesas:0})
  const [tag, setTag] = useState<string>('TODOS')
  const [openModal, setOpenModal] = useState(false)
  const [openModalImp, setOpenModalImp] = useState(false)
  const {data:caixa,postData,loading}= useApiPost<Array<CaixaProps>,ReqProps>('/financeiro/caixa/lancamentos')


const {register,handleSubmit,watch,control} = useForm<FormProps>({
  defaultValues:{
    startDate:new Date(),
    endDate:new Date(),
  }
})



const handleFiltro:SubmitHandler<FormProps> = useCallback(async (data)=>{
 const arrayCustos = arrayCcustos.map(item=>{if(item.check===true)return item.id_ccustos}).filter((item) =>item!==undefined)


const{dataIni,dataFim}=ajustarData(data.startDate,data.endDate)
    
 await postData({
    array : arrayCustos,
    id_empresa:data.id_empresa,
    dataInicio:dataIni,
    dataFim:dataFim
  })


},[arrayCcustos,postData,watch('endDate'),watch('id_empresa'),watch('startDate')]) 


const calcularSoma = useCallback (() => {
  setSoma({}as SomaProps)

const soma = caixa?.reduce((acumulador, atual) => {
    const valor = Number(atual.valor);

    switch (atual.forma_pagamento) {
      case 'PIX':atual.tipo==='RECEITA' ? acumulador.pix -= valor:acumulador.pix += valor; break;
      case 'BOLETO':atual.tipo==='RECEITA' ? acumulador.boleto -= valor: acumulador.boleto += valor; break;
      case 'CARTAO': case 'CARTAO CREDITO': case 'CARTAO DEBITO': atual.tipo==='RECEITA' ? acumulador.cartao -= valor: acumulador.cartao += valor; break;
      case 'DINHEIRO':case undefined:case '':case null:atual.tipo==='RECEITA' ? acumulador.dinheiro += valor: acumulador.dinheiro -= valor; break;
      default: break;
    }

    if (atual.tipo === 'DESPESA') acumulador.despesas += valor;
    if (atual.tipo === 'RECEITA') acumulador.total += valor;

    return acumulador;
  }, { pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0, despesas: 0 } as SomaProps);
  setSoma(soma??{ pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0, despesas: 0 });
},[caixa])


useEffect(() => {
  calcularSoma()
},[caixa])



  const handleSelectCheck = (id: number) => {
    const novoArray = [...arrayCcustos]
    const index = novoArray.findIndex(item => item.id_ccustos === id)
    novoArray[index].check = !novoArray[index].check
    setCcustos(novoArray)
    console.log(novoArray)
  }



  return (
    <>
    
{openModal && <ModalResumoTags openModal={openModal} setOpenModal={setOpenModal} array={caixa} tag={tag}/>}

{openModalImp && <ModalRelatorio openModal={openModalImp} setOpenModal={setOpenModalImp} caixa={caixa} arrayCcustos={arrayCcustos} startDate={watch('startDate')} endDate={watch('endDate')} />}


    
      <div className="flex flex-col  h-[calc(100vh-112px)] gap-2">
        <div className="flex flex-row w-full text-xs justify-between cursor-pointer p-2 mb-1 text-black font-semibold">
 

          <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FcMultipleInputs size={25} /></div>
            <div className="flex flex-col " >RECEITA TOTAL<span className="text-sm">{Number((somaValor?.total-somaValor?.despesas)+somaValor.pix+somaValor.cartao+somaValor.boleto+somaValor.transferencia).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>

          <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><MdOutput size={25} /></div>
            <div className="flex flex-col " >DESPESA TOTAL <span className="text-sm">{Number(somaValor?.despesas-somaValor.transferencia-somaValor.boleto-somaValor.cartao-somaValor.pix ).toLocaleString('pt-BR',{style: 'currency',currency: 'BRL'})}</span></div>
          </Card>

          <Card onClick={() => {setTag('DINHEIRO'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillAlt size={25} /></div>
            <div className="flex flex-col " >CÉDULA<span className="text-sm">{Number(somaValor.total-somaValor.despesas).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>

          <Card onClick={() => {setTag('PIX'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaPix size={23} /></div>
            <div className="flex flex-col " >PIX<span className="text-sm">{Number(somaValor?.pix??0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>

          <Card onClick={() => {setTag('TRANSFERENCIA'),setOpenModal(true)}}  theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>

            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillTransfer size={25} /></div>
            <div className={`flex flex-col `} >TRANSFERÊNCIA<span className="text-sm">{Number(somaValor?.transferencia??0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>

          <Card onClick={() => {setTag('CARTAO'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaCreditCard size={25} /></div>
            <div className={`flex flex-col `} >CARTÃO<span className="text-sm">{Number(somaValor?.cartao??0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>

        </div>


        <form onSubmit={handleSubmit(handleFiltro)} className="inline-flex text-black font-semibold w-full  rounded-lg px-2 gap-7 items-center justify-evenly">
          <Select sizing={'sm'} style={{ padding: 6 }} className="w-[150px]" title="Empresa" {...register('id_empresa')}>
            <option value={''}>EMPRESAS</option>
           {empresas.map((item) => (
             <option value={item.id} key={item.id}>{item.nome}</option>
           ))}
          </Select>
          <Dropdown  className="max-h-60 overflow-y-auto" size={'sm'} renderTrigger={() => <span className="text-xs font-semibold border-[1px] rounded-lg py-1.5 px-2 w-1/6 border-gray-300 bg-gray-50">CAIXA</span>} theme={{ content: 'p-1' }} dismissOnClick={false} label='Caixa'>

            {arrayCcustos.map((item) => (
              <Dropdown.Item className="flex gap-2"  key={item.id_ccustos}>
                <Checkbox checked={item.check} onChange={() => handleSelectCheck(item.id_ccustos)} />{item.descricao}</Dropdown.Item>
            ))}
          </Dropdown>
        <div className=" inline-flex gap-4 items-center"> 


          <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker 
            dateFormat={'dd/MM/yyyy'} 
            className="rounded-lg py-1.5 text-xs bg-gray-50 border-gray-300 text-black" 
             onChange={(date) =>date && onChange(date)} 
             selected={value} locale={pt} />
          )}
          
          />
<BiCalendarMinus />
<Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value} }) => (
            <DatePicker 
            dateFormat={'dd/MM/yyyy'} 
            className="rounded-lg py-1.5 text-xs bg-gray-50 border-gray-300 text-black" 
             onChange={(date) =>date && onChange(date)} 
             selected={value} locale={pt} />
          )}
          
          />
    

        

          </div>
            <Button isProcessing={loading} type="submit" size={'xs'} >FILTRAR</Button>
            
            <Button  className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setOpenModalImp(true)} size={'xs'} >RELATÓRIO</Button>

         

        </form>


        <div className="overflow-y-auto max-h-[calc(100vh-100px)] px-2">
          <Table hoverable theme={{root:{shadow:'none'},body:{cell:{base:"px-4 py-1"}},head:{cell:{base:"px-4 py-1"}}}}  >
            <TableHead>
              <TableHeadCell className="whitespace-nowrap">Nº Lanc.</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>Conta</TableHeadCell>
              <TableHeadCell>Ccusto</TableHeadCell>
              <TableHeadCell>Documento</TableHeadCell>
              <TableHeadCell>Histórico</TableHeadCell>
              <TableHeadCell>Tipo</TableHeadCell>
              <TableHeadCell>Valor</TableHeadCell>
            </TableHead>
            <Table.Body className="divide-y" theme={{ cell: { base: 'px-4 py-2 ' } }}>
              {caixa?.map((item) =>
              (<TableRow key={item.lanc_id} className="bg-white text-xs font-semibold text-black">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.num_seq}
                </TableCell>
                <TableCell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{item.conta}</TableCell>
                <TableCell>{item.ccustos_desc}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.historico}</TableCell>
                <TableCell className={`${item.tipo === 'RECEITA' ? 'text-green-500' : 'text-red-600'}`}>{item.tipo}</TableCell>
                <TableCell>{Number(item.valor).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}</TableCell>
              </TableRow>)
              )}
            </Table.Body>
          </Table>
        </div>
     
      </div>
   
   
    </>
  );
}


