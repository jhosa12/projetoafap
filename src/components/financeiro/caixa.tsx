
import { Table,Select,Dropdown,Checkbox,Avatar, Datepicker, Button } from "flowbite-react";
import { CaixaProps, CcustosProps } from "@/pages/financeiro/login";
import { useState } from "react";
import { api } from "@/services/apiClient";
import { GiExpense} from "react-icons/gi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { FaBalanceScale } from "react-icons/fa";


interface DataProps{
    arrayCcustos:Array<CcustosProps>
    arrayCaixa:Array<CaixaProps>
    setCcustos:(fields:Array<CcustosProps>)=>void
    setCaixa:(fields:Array<CaixaProps>)=>void
}

export function Caixa({arrayCcustos,arrayCaixa,setCcustos,setCaixa}:DataProps) {
  const [data,setData] =useState<Date>(new Date());
  const [dataFim,setDataFim] = useState<Date>(new Date())
  

  const handleSelectCheck = (select:CcustosProps) =>{
      const index = arrayCcustos.findIndex(item=>item.id_ccustos===select.id_ccustos)
      const novoArray = [...arrayCcustos]
      novoArray[index] ={...select,check:!select.check}
     // const teste = novoArray.map(item=>{if(item.check)return item.id_ccustos}).filter(item=>item)
       
      setCcustos(novoArray)
  }

  const handleFiltro = async ()=>{
    const response = await api.post('/financeiro/caixa/lancamentos',{
      array: arrayCcustos.map(item=>{if(item.check)return item.id_ccustos}).filter(item=>item),
      dataInicio:new Date(data),
      dataFim:new Date(dataFim)
    })
    setCaixa(response.data)
  }

  return (
    <div className="flex flex-col p-4 gap-2">
   <div className="flex flex-row w-full text-xs justify-between  mb-1">
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col text-gray-800" >RECEITA TOTAL <span>{}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col text-gray-800" >DESPESA TOTAL <span>{}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillAlt size={25} /></div>
                <h2 className="flex flex-col text-gray-800" >RECEITA CÉDULA<span>{}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaPix size={25} /></div>
                <h2 className="flex flex-col text-gray-800" >PIX<span>R$ </span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
                <h2 className={`flex flex-col text-gray-800`} >DEPÓSITO<span className={`font-semibold  `}>{}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">

<div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
<h2 className={`flex flex-col text-gray-800`} >SALDO<span className={`font-semibold  `}>{}</span></h2>
</div>

            </div>
    <div className="inline-flex w-full bg-white rounded-lg p-2 gap-7 items-center">
      <Select style={{padding:6}} className="w-[150px]" id="countries" required>
        <option>United States</option>
        <option>Canada</option>
        <option>France</option>
        <option>Germany</option>
      </Select>
      <Dropdown size={'sm'} style={{background:'#f6f8fa',paddingTop:0,paddingBottom:0,color:'#000',borderWidth:'1px',borderColor:'#dce0e3'}} theme={{content:'p-1'}} dismissOnClick={false} label='Caixa'>

      {arrayCcustos.map((item)=>(
        <Dropdown.Item className="flex gap-2" onChange={()=>handleSelectCheck(item)}  key={item.id_ccustos}><Checkbox defaultChecked={item.check}/><Avatar img={`data:image/jpeg;base64,${item.image}`} rounded/>{item.descricao}</Dropdown.Item>
      ))  }
      </Dropdown>
      <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e=>setData(new Date(e))} value={data.toLocaleDateString('pt-BR',{timeZone:'UTC'})} language="pt-BR" style={{padding:6,paddingLeft:34}}/>
        <span className="text-gray-700">até</span>
      <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e=>setDataFim(e)} value={dataFim.toLocaleDateString('pt-BR')} language="pt-BR" style={{padding:6,paddingLeft:34}}/>
      <button  onClick={handleFiltro}className="bg-[#0e7490] text-[14px] rounded-lg py-1.5 px-2 font-semibold" >Filtrar</button>
    
    </div>
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nº Lanc.</Table.HeadCell>
          <Table.HeadCell>Data</Table.HeadCell>
          <Table.HeadCell>Conta</Table.HeadCell>
          <Table.HeadCell>Usuário</Table.HeadCell>
          <Table.HeadCell>Documento</Table.HeadCell>
          <Table.HeadCell>Histórico</Table.HeadCell>
          <Table.HeadCell>Tipo</Table.HeadCell>
          <Table.HeadCell>Valor</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
         {arrayCaixa.map((item)=>
         (<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {item.num_seq}
          </Table.Cell>
          <Table.Cell>{new Date(item.datalanc).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
          <Table.Cell>{item.conta}</Table.Cell>
          <Table.Cell>{item.ccustos_desc}</Table.Cell>
          <Table.Cell>{item.descricao}</Table.Cell>
          <Table.Cell>{item.historico}</Table.Cell>
          <Table.Cell>{item.tipo}</Table.Cell>
          <Table.Cell>{Number(item.valor).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}</Table.Cell>
          <Table.Cell>
            <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
              Edit
            </a>
          </Table.Cell>
        </Table.Row>) 
        ) }
        </Table.Body>
      </Table>
    </div>
    </div>
  );
}
