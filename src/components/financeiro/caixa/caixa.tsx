
import { Table, Select, Dropdown, Checkbox, Avatar, Button, ModalFooter, Modal, ModalHeader, ModalBody,  TableHead, TableHeadCell, TableBody, TableCell, TableRow, Card, Pagination } from "flowbite-react";
import { CaixaProps, CcustosProps } from "@/pages/financeiro";
import { useCallback, useEffect, useRef, useState } from "react";
import { GiMoneyStack } from "react-icons/gi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { PiPrinterFill } from "react-icons/pi";
import DocumentTemplate from "@/Documents/financeiro/caixa/DocumentTemplate";
import { useReactToPrint } from "react-to-print";
import DatePicker, { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { FcMultipleInputs } from "react-icons/fc";
import { MdOutput } from "react-icons/md";
import { EmpresaProps } from "@/types/empresa";
import { api } from "@/services/apiClient";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ModalResumoTags } from "./modalResumoTags";
import { ModalRelatorio } from "./modalRelatorio";
import { BiCalendarMinus } from "react-icons/bi";


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

export function Caixa({ arrayCcustos, setCcustos, empresas }: DataProps) {
  const [somaValor, setSoma] = useState<SomaProps>({ boleto: 0, cartao: 0, deposito: 0, dinheiro: 0, pix: 0, total: 0, transferencia: 0 ,despesas:0})
  const [tag, setTag] = useState<string>('TODOS')
  const [openModal, setOpenModal] = useState(false)
  const [openModalImp, setOpenModalImp] = useState(false)


  
const [loadind,setLoading] = useState<boolean>(false)
const [arrayCaixa,setCaixa] = useState<Array<CaixaProps>>([])
const {register,handleSubmit,watch,control} = useForm<FormProps>({
  defaultValues:{
    startDate:new Date(),
    endDate:new Date(),
  }
})



const handleFiltro:SubmitHandler<FormProps> = useCallback(async (data)=>{
 const arrayCustos = arrayCcustos.map(item=>{if(item.check===true)return item.id_ccustos}).filter(item=>item)
    
  const response = await api.post('/financeiro/caixa/lancamentos',{
    array : arrayCustos,
    id_empresa:data.id_empresa,
    dataInicio:data.startDate,
    dataFim:data.endDate
  })
  setCaixa(response.data)
},[]) 



console.log('RENDERIZOU')

  


  const calcularSoma =useCallback( (array:Array<CaixaProps>) => {
    return array.reduce((acumulador, atual) => {
      const valor = Number(atual.valor);
     

      switch (atual?.mensalidade?.form_pagto) {
        case 'PIX':
          acumulador.pix += valor;
          break;
        case 'BOLETO':
          acumulador.boleto += valor;
          break;
        case 'CARTAO':
        case 'CARTÃO CREDITO':
        case 'CARTÃO DEBITO':
          acumulador.cartao += valor;
          break;
        case 'DINHEIRO':
        case '':
          acumulador.dinheiro += valor;
          break;
        default:
          break; // Adicione uma ação padrão se necessário
      }

      if (atual.tipo === 'DESPESA') {
        acumulador.despesas += valor;
      }
      if(atual.tipo === 'RECEITA'){
        acumulador.total+= valor;
      }

      return acumulador;
    }, { pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0,despesas:0 } as SomaProps);
  },[])

  useEffect(() => {
    if (arrayCaixa.length > 0) {
      const novaSoma = calcularSoma(arrayCaixa);

      // Verifica se a nova soma é diferente da atual antes de atualizar o estado
      if (JSON.stringify(novaSoma) !== JSON.stringify(somaValor)) {
        setSoma(novaSoma);
      }
    } else {
      setSoma({
        boleto: 0,
        cartao: 0,
        deposito: 0,
        dinheiro: 0,
        pix: 0,
        total: 0,
        despesas: 0,
        transferencia: 0,
      });
    }
  }, [arrayCaixa]);


  const handleSelectCheck = (id: number) => {
    const novoArray = [...arrayCcustos]
    const index = novoArray.findIndex(item => item.id_ccustos === id)
    novoArray[index].check = !novoArray[index].check
    setCcustos(novoArray)
    console.log(novoArray)
  }




  return (
    <>
    
<ModalResumoTags openModal={openModal} setOpenModal={setOpenModal} array={arrayCaixa} tag={tag}/>

{openModalImp && <ModalRelatorio openModal={openModalImp} setOpenModal={setOpenModalImp} caixa={arrayCaixa} arrayCcustos={arrayCcustos} startDate={watch('startDate')} endDate={watch('endDate')} />}

    
      <div className="flex flex-col bg-white rounded-lg h-[calc(100vh-112px)] gap-2">
        <div className="flex flex-row w-full text-xs justify-between cursor-pointer p-2 mb-1 text-black font-semibold">
 

          <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FcMultipleInputs size={25} /></div>
            <div className="flex flex-col " >RECEITA TOTAL <span className="text-sm">{Number(somaValor.total).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>
          <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><MdOutput size={25} /></div>
            <div className="flex flex-col " >DESPESA TOTAL <span className="text-sm">{Number(somaValor.despesas ).toLocaleString('pt-BR',{style: 'currency',currency: 'BRL'})}</span></div>
          </Card>
          <Card onClick={() => {setTag('DINHEIRO'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillAlt size={25} /></div>
            <div className="flex flex-col " >RECEITA CÉDULA<span className="text-sm">{Number(somaValor.dinheiro).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>
          <Card onClick={() => {setTag('PIX'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaPix size={23} /></div>
            <div className="flex flex-col " >PIX<span className="text-sm">{Number(somaValor.pix).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>
          <Card onClick={() => {setTag('TRANSFERENCIA'),setOpenModal(true)}}  theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>

            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillTransfer size={25} /></div>
            <div className={`flex flex-col `} >TRANSFERÊNCIA<span className="text-sm">{Number(somaValor.transferencia).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></div>
          </Card>
          <Card onClick={() => {setTag('CARTAO'),setOpenModal(true)}} theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>
            <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaCreditCard size={25} /></div>
            <div className={`flex flex-col `} >CARTÃO<span className="text-sm">{Number(somaValor.cartao).toLocaleString('pt-BR', {
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
            className="rounded-lg py-1.5 text-xs bg-gray-50 text-black" 
             onChange={(date) =>date && onChange(date)} 
             selected={value} locale={pt} />
          )}
          
          />
<BiCalendarMinus />
<Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker 
            dateFormat={'dd/MM/yyyy'} 
            className="rounded-lg py-1.5 text-xs bg-gray-50 text-black" 
             onChange={(date) =>date && onChange(date)} 
             selected={value} locale={pt} />
          )}
          
          />
    

        

          </div>
            <Button type="submit" size={'xs'} isProcessing={loadind}>FILTRAR</Button>
            
            <Button  className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setOpenModalImp(true)} size={'xs'} >RELATÓRIO</Button>

         

        </form>
        <div className="overflow-x-auto max-h-[62vh] px-2">
          <Table hoverable theme={{head:{cell:{base:"bg-gray-50 px-6 py-1 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"}}, body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
            <TableHead>
              <TableHeadCell className="whitespace-nowrap">Nº Lanc.</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>Conta</TableHeadCell>
              <TableHeadCell>Ccusto</TableHeadCell>
              <TableHeadCell>Documento</TableHeadCell>
              <TableHeadCell>Histórico</TableHeadCell>
              <TableHeadCell>Tipo</TableHeadCell>
              <TableHeadCell>Valor</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <Table.Body className="divide-y" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
              {arrayCaixa.map((item) =>
              (<TableRow key={item.lanc_id} className="bg-white text-xs font-semibold text-black">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.num_seq}
                </TableCell>
                <TableCell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{item.conta}</TableCell>
                <TableCell>{item.ccustos_desc}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.historico}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{Number(item.valor).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}</TableCell>
                <TableCell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </TableCell>
              </TableRow>)
              )}
            </Table.Body>
          </Table>
        </div>
     
      </div>
   
   
    </>
  );
}
