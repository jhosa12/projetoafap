
import { Table, Select, Dropdown, Checkbox, Avatar, Datepicker, Button, ModalFooter, Modal, ModalHeader, ModalBody, Label, FileInput, TextInput, TableHead, TableHeadCell, TableBody, TableCell, TableRow } from "flowbite-react";
import { CaixaProps, CcustosProps } from "@/pages/financeiro/login";
import { useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { GiExpense } from "react-icons/gi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { FaBalanceScale } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";


interface DataProps {
  arrayCcustos: Array<CcustosProps>
  arrayCaixa: Array<CaixaProps>
  setCcustos: (fields: Array<CcustosProps>) => void
  setCaixa: (fields: Array<CaixaProps>) => void
  handleFiltro:(array:Array<CcustosProps>,dataInicio:Date,dataFim:Date)=>Promise<void>
}

interface SomaProps{
  pix:number,
  cartao:number,
  deposito:number,
  boleto:number,
  dinheiro:number,
  total:number,
  transferencia:number
}

export function Caixa({ arrayCcustos, arrayCaixa, setCcustos, setCaixa,handleFiltro}: DataProps) {
  const [data, setData] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date())
  const [somaValor,setSoma] =useState<SomaProps>({boleto:0,cartao:0,deposito:0,dinheiro:0,pix:0,total:0,transferencia:0})
  const [openModal,setOpenModal] =useState(false)
  const [tagSelect,setTag]=useState<Array<CaixaProps>>([])



const clickTag  = (tag:string)=>{
  let caixaTag:Array<CaixaProps>|[]=[]
    if(tag==='PIX'){
      caixaTag = arrayCaixa.map(item =>{
        if(item.mensalidade.form_pagto==='PIX'){
          return item
        }
      }).filter(item=>item!==undefined)
    }

    if(tag==='DINHEIRO'){
      caixaTag = arrayCaixa.map(item =>{
        if(item.mensalidade.form_pagto==='DINHEIRO'){
          return item
        }
      }).filter(item=>item!==undefined)
    }
    if(tag==='CARTAO'){
      caixaTag = arrayCaixa.map(item =>{
        if(item.mensalidade.form_pagto==='CARTAO'){
          return item
        }
      }).filter(item=>item!==undefined)
    }
   setTag(caixaTag??[])
   setOpenModal(true)
}








useEffect(()=>{

  if(arrayCaixa.length>0){

    const soma = arrayCaixa.reduce((acumulador,atual)=>{
      if(atual.mensalidade.form_pagto==='PIX'){
        acumulador.pix +=Number(atual.valor)
      }
      if(atual.mensalidade.form_pagto==='BOLETO'){
        acumulador.boleto +=Number(atual.valor)
      }
      if(atual.mensalidade.form_pagto==='CARTAO'){
        acumulador.cartao +=Number(atual.valor)
      }
      if(atual.mensalidade.form_pagto==='DINHEIRO'){
        acumulador.dinheiro +=Number(atual.valor)
      }
      acumulador.total+=Number(atual.valor)
      return acumulador

    },{pix:0,boleto:0,cartao:0,dinheiro:0,deposito:0,total:0,transferencia:0} as SomaProps)
    console.log(soma)
    setSoma(soma)
  }
},[arrayCaixa])
  const handleSelectCheck = (select: CcustosProps) => {
    const index = arrayCcustos.findIndex(item => item.id_ccustos === select.id_ccustos)
    const novoArray = [...arrayCcustos]
    novoArray[index] = { ...select, check: !select.check }
    setCcustos(novoArray)
  }




  return (
    <>
          <Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'4xl'}
        popup    
         dismissible
          >    
            <ModalHeader className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b p-2 border-gray-60">
                <h1 className="text-white">RESUMO DE LANÇAMENTOS</h1>
                </ModalHeader>
            <ModalBody>
                <div className="">        
                  <Table>
                    <TableHead>

            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Banco</TableHeadCell>
            <TableHeadCell>Documento</TableHeadCell>
            <TableHeadCell>Histórico</TableHeadCell>
            <TableHeadCell>Valor</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y" theme={{cell:{base:'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'}}}>
                    {tagSelect.map((item) =>
            (<TableRow className="bg-white">
             
              <TableCell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
              <TableCell>{item.mensalidade.banco_dest}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>{item.historico}</TableCell>
            
              <TableCell>{Number(item.valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}</TableCell>
             
            </TableRow>)
            )}
                    </TableBody>
                  </Table>
          </div>
          </ModalBody>
          <ModalFooter>
          <Button color="gray" className="bg-gray-400" onClick={() => {}}>
            Cancelar
          </Button>
        </ModalFooter>
        </Modal>
    <div className="flex flex-col p-4 gap-2">
      <div className="flex flex-row w-full text-xs justify-between cursor-pointer  mb-1">


        <div onClick={()=>setOpenModal(true)} className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
          <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
          <h2 className="flex flex-col text-gray-800" >RECEITA TOTAL <span className="text-base">{Number(somaValor.total).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}</span></h2>
        </div>
        <div className=" inline-flex text-white p-2 gap-4 cursor-pointer bg-white rounded-lg min-w-[180px]">
          <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
          <h2 className="flex flex-col text-gray-800" >DESPESA TOTAL <span className="text-base">{ }</span></h2>
        </div>
        <div onClick={()=>clickTag('DINHEIRO')} className=" inline-flex text-white p-2 gap-4 cursor-pointer bg-white rounded-lg min-w-[180px]">
          <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillAlt size={25} /></div>
          <h2 className="flex flex-col text-gray-800" >RECEITA CÉDULA<span className="text-base">{Number(somaValor.dinheiro).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}</span></h2>
        </div>
        <div onClick={()=>clickTag('PIX')} className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
          <div  className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaPix size={25} /></div>
          <h2 className="flex flex-col text-gray-800" >PIX<span className="text-base">{Number(somaValor.pix).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}</span></h2>
        </div>
        <div className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">

          <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
          <h2 className={`flex flex-col text-gray-800`} >TRANSFERÊNCIA<span className="text-base">{ Number(somaValor.transferencia).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          })}</span></h2>
        </div>
        <div onClick={()=>clickTag('CARTAO')} className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
          <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaCreditCard size={25} /></div>
          <h2 className={`flex flex-col text-gray-800`} >CARTÃO<span className="text-base">{Number(somaValor.cartao).toLocaleString('pt-BR',{
            style:'currency',
            currency:'BRL'
          }) }</span></h2>
        </div>

      </div>
      <div className="inline-flex w-full bg-white rounded-lg p-2 gap-7 items-center">
        <Select style={{ padding: 6 }} className="w-[150px]" id="countries" required>
          <option>United States</option>
          <option>Canada</option>
          <option>France</option>
          <option>Germany</option>
        </Select>
        <Dropdown size={'sm'} style={{ background: '#f6f8fa', paddingTop: 0, paddingBottom: 0, color: '#000', borderWidth: '1px', borderColor: '#dce0e3' }} theme={{ content: 'p-1' }} dismissOnClick={false} label='Caixa'>

          {arrayCcustos.map((item) => (
            <Dropdown.Item className="flex gap-2" onChange={() => handleSelectCheck(item)} key={item.id_ccustos}><Checkbox defaultChecked={item.check} /><Avatar img={`data:image/jpeg;base64,${item.image}`} rounded />{item.descricao}</Dropdown.Item>
          ))}
        </Dropdown>
        <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e => setData(new Date(e))} value={data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })} language="pt-BR" style={{ padding: 6, paddingLeft: 34 }} />
        <span className="text-gray-700">até</span>
        <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e => setDataFim(e)} value={dataFim.toLocaleDateString('pt-BR')} language="pt-BR" style={{ padding: 6, paddingLeft: 34 }} />
        <button onClick={()=>handleFiltro(arrayCcustos,data,dataFim)} className="bg-[#0e7490] text-[14px] rounded-lg py-1.5 px-2 font-semibold" >Filtrar</button>

      </div>
      <div className="overflow-x-auto max-h-[62vh]">
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Nº Lanc.</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Conta</TableHeadCell>
            <TableHeadCell>Usuário</TableHeadCell>
            <TableHeadCell>Documento</TableHeadCell>
            <TableHeadCell>Histórico</TableHeadCell>
            <TableHeadCell>Tipo</TableHeadCell>
            <TableHeadCell>Valor</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <Table.Body className="divide-y" theme={{cell:{base:'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'}}}>
            {arrayCaixa.map((item) =>
            (<TableRow className="bg-white">
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
