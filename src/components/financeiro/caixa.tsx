
import { Table, Select, Dropdown, Checkbox, Avatar, Datepicker, Button, ModalFooter, Modal, ModalHeader, ModalBody, Label, FileInput, TextInput, TableHead, TableHeadCell, TableBody, TableCell, TableRow } from "flowbite-react";
import { CaixaProps, CcustosProps } from "@/pages/financeiro/login";
import { useEffect, useRef, useState } from "react";
import { api } from "@/services/apiClient";
import { GiMoneyStack } from "react-icons/gi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { PiPrinterFill } from "react-icons/pi";
import DocumentTemplate from "@/Documents/financeiro/caixa/DocumentTemplate";
import { useReactToPrint } from "react-to-print";


interface DataProps {
  arrayCcustos: Array<CcustosProps>
  arrayCaixa: Array<CaixaProps>
  setCcustos: (fields: Array<CcustosProps>) => void
  setCaixa: (fields: Array<CaixaProps>) => void
  handleFiltro: (array: Array<CcustosProps>, dataInicio: Date, dataFim: Date) => Promise<void>
}

export interface SomaProps {
  pix: number,
  cartao: number,
  deposito: number,
  boleto: number,
  dinheiro: number,
  total: number,
  transferencia: number
}

export interface TagsProps{
  id:number,
  desc:string,
  check:boolean
}

export function Caixa({ arrayCcustos, arrayCaixa, setCcustos, setCaixa, handleFiltro }: DataProps) {
  const [data, setData] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date())
  const [somaValor, setSoma] = useState<SomaProps>({ boleto: 0, cartao: 0, deposito: 0, dinheiro: 0, pix: 0, total: 0, transferencia: 0 })
  const [openModal, setOpenModal] = useState(false)
  const [tagSelect, setTag] = useState<Array<CaixaProps>>([])
  const [openModalImp, setOpenModalImp] = useState(false)
  const [arrayTags,setArrayTags] = useState<Array<TagsProps>>([
    {id:1,desc:'TODOS',check:true},
    {id:2,desc:'PIX',check:true},
    {id:3,desc:'CARTAO',check:true},
    {id:4,desc:'TRANSFERENCIA',check:true},
    {id:5,desc:'DINHEIRO',check:true},
    {id:6,desc:'BOLETO',check:true},
  ]);
  const current = useRef<DocumentTemplate>(null)
const [loadind,setLoading] = useState<boolean>(false)

const ImprimirRelatorio = useReactToPrint({
  content:()=>current.current
})

const filtro = async()=>{
  setLoading(true)
 await handleFiltro(arrayCcustos, data, dataFim)
 setLoading(false)
}



  const handleTagImp=(index:number)=>{
    const novoArray = [...arrayTags]
    let mod:Array<TagsProps>=[]

    if(index===0){
    
      if(novoArray[index].check){
       mod = novoArray.map(item=>{return {...item,check:false}})

      }else{
        mod = novoArray.map(item=>{return {...item,check:true}})
      }


    }else{
      novoArray[index].check = !novoArray[index].check
      novoArray[0].check =false
      mod=novoArray
    }

    setArrayTags(mod)
  }

  const clickTag = (tag: string) => {
    let caixaTag: Array<CaixaProps> =[]
    if (tag === 'PIX') {
      caixaTag = arrayCaixa.filter(item => item?.mensalidade?.form_pagto === 'PIX')
    } else if (tag === 'DINHEIRO') {
      caixaTag = arrayCaixa.filter(item => item?.mensalidade?.form_pagto === 'DINHEIRO')
    } else if (tag === 'CARTAO') {
      caixaTag = arrayCaixa.filter(item => item?.mensalidade?.form_pagto === 'CARTAO')
    }
    else if (tag === 'TRANSFERENCIA') {
      caixaTag = arrayCaixa.filter(item => item?.mensalidade?.form_pagto === 'TRANSFERENCIA')
    }
   setTag(caixaTag??[])
    setOpenModal(true)
  }


  useEffect(() => {

    if (arrayCaixa.length > 0) {

      const soma = arrayCaixa.reduce((acumulador, atual) => {
        if (atual?.mensalidade?.form_pagto === 'PIX') {
          acumulador.pix += Number(atual.valor)
        }
        if (atual?.mensalidade?.form_pagto === 'BOLETO') {
          acumulador.boleto += Number(atual.valor)
        }
        if (atual?.mensalidade?.form_pagto === 'CARTAO') {
          acumulador.cartao += Number(atual.valor)
        }
        if (atual?.mensalidade?.form_pagto === 'DINHEIRO') {
          acumulador.dinheiro += Number(atual.valor)
        }
        acumulador.total += Number(atual.valor)
        return acumulador

      }, { pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0 } as SomaProps)
    
      setSoma(soma)
    }else{
      setSoma({
        boleto:0,
        cartao:0,
        deposito:0,
        dinheiro:0,
        pix:0,
        total:0,
        transferencia:0
      })
    }
  }, [arrayCaixa])


  const handleSelectCheck = (select: CcustosProps) => {
    const index = arrayCcustos.findIndex(item => item.id_ccustos === select.id_ccustos)
    const novoArray = [...arrayCcustos]
    novoArray[index] = { ...select, check: !select.check }
    setCcustos(novoArray)
  }




  return (
    <>
     { //MODAL PARA TAGS PIX/CARTÃO/TRANSFER/CEDULA.....
      <Modal
        className="absolute bg-gray-600 overflow-y-auto"
        content={"base"}
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={'5xl'}
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
              <TableBody className="divide-y" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
                {tagSelect.map((item) =>
                (<TableRow className="bg-white">

                  <TableCell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell>{item.mensalidade.banco_dest?item?.mensalidade?.banco_dest:item?.mensalidade?.form_pagto}</TableCell>
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
          <Button color="gray" className="bg-gray-400"  onClick={() => { }}>
           Cancelar
          </Button>
        </ModalFooter>
      </Modal>}


      { //MODAL PARA IMPRESSÃO DE RELATÓRIO.....
      <Modal
        className="absolute bg-gray-600 overflow-y-auto"
        content={"base"}
        show={openModalImp}
        onClose={() => setOpenModalImp(false)}
        size={'md'} 
        popup
        dismissible
      >
        <ModalHeader className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
          <h1 className="text-white">IMPRESSÃO DE RELOTÓRIO</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full mt-2 ">
          <Dropdown  size={'sm'}  style={{width:'100%',justifyContent:'space-between', background: '#f6f8fa', paddingTop: 0, paddingBottom: 0, color: '#000', borderWidth: '1px', borderColor: '#dce0e3',outline:'none' }} theme={{ arrowIcon:'flex h-full items-end ml-auto',content: 'p-1 w-full justify-between' }} dismissOnClick={false} label='TAG'  arrowIcon={false} >
         {arrayTags.map((item,index)=>(
               <Dropdown.Item className="flex gap-2 " key={item.id} ><Checkbox onChange={() =>handleTagImp(index) }  checked={item.check} />{item.desc}</Dropdown.Item>
         ))}
          
        

</Dropdown>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button outline  theme={{}}  onClick={() =>ImprimirRelatorio()}>
            <div className="flex justify-center items-center gap-1">
            <PiPrinterFill size={22}/> Imprimir
            </div>
        
          </Button>
        </ModalFooter>
      </Modal>}
      {/* TAGS VALORES E TABELA*/}
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-row w-full text-xs justify-between cursor-pointer  mb-1">


          <div  className=" inline-flex text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]">< GiMoneyStack size={25} /></div>
            <h2 className="flex flex-col text-gray-800" >RECEITA TOTAL <span className="text-base">{Number(somaValor.total).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></h2>
          </div>
          <div className=" inline-flex text-white p-2 gap-4 cursor-pointer bg-white rounded-lg min-w-[180px]">
            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiMoneyStack size={25} /></div>
            <h2 className="flex flex-col text-gray-800" >DESPESA TOTAL <span className="text-base">{ }</span></h2>
          </div>
          <div onClick={() => clickTag('DINHEIRO')} className=" inline-flex text-white p-2 gap-4 cursor-pointer bg-white rounded-lg min-w-[180px]">
            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillAlt size={25} /></div>
            <h2 className="flex flex-col text-gray-800" >RECEITA CÉDULA<span className="text-base">{Number(somaValor.dinheiro).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></h2>
          </div>
          <div onClick={() => clickTag('PIX')} className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaPix size={25} /></div>
            <h2 className="flex flex-col text-gray-800" >PIX<span className="text-base">{Number(somaValor.pix).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></h2>
          </div>
          <div onClick={() => clickTag('TRANSFERENCIA')}  className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">

            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaMoneyBillTransfer size={25} /></div>
            <h2 className={`flex flex-col text-gray-800`} >TRANSFERÊNCIA<span className="text-base">{Number(somaValor.transferencia).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></h2>
          </div>
          <div onClick={() => clickTag('CARTAO')} className=" inline-flex cursor-pointer text-white p-2 gap-4 bg-white rounded-lg min-w-[180px]">
            <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaCreditCard size={25} /></div>
            <h2 className={`flex flex-col text-gray-800`} >CARTÃO<span className="text-base">{Number(somaValor.cartao).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span></h2>
          </div>

        </div>
        <div className="inline-flex w-full bg-white rounded-lg p-2 gap-7 items-center justify-evenly">
          <Select style={{ padding: 6 }} className="w-[150px]" title="Empresa" required>
            <option>AFAP CEDRO</option>
            <option>AFAP LAVRAS</option>
            <option>OTICA FREITAS</option>
            <option>AFAP VIVA MAIS</option>
            <option>AFAP SAUDE</option>
          </Select>
          <Dropdown  size={'sm'} style={{ background: '#f6f8fa', paddingTop: 0, paddingBottom: 0, color: '#000', borderWidth: '1px', borderColor: '#dce0e3' }} theme={{ content: 'p-1' }} dismissOnClick={false} label='Caixa'>

            {arrayCcustos.map((item) => (
              <Dropdown.Item className="flex gap-2" onChange={() => handleSelectCheck(item)} key={item.id_ccustos}><Checkbox defaultChecked={item.check} /><Avatar img={`data:image/jpeg;base64,${item.image}`} rounded />{item.descricao}</Dropdown.Item>
            ))}
          </Dropdown>
        <div className=" inline-flex gap-4 items-center">  <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e => setData(new Date(e))} value={data.toLocaleDateString('pt-BR')} language="pt-BR" style={{ padding: 6, paddingLeft: 34 }} />
          <span className="text-gray-700">até</span>
          <Datepicker labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e => setDataFim(e)} value={dataFim.toLocaleDateString('pt-BR')} language="pt-BR" style={{ padding: 6, paddingLeft: 34 }} />
          </div>
            <Button onClick={filtro} size={'sm'} isProcessing={loadind}>FILTRAR</Button>
            
            <Button  className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setOpenModalImp(true)} size={'sm'} >RELATÓRIO</Button>

         

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
            <Table.Body className="divide-y" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
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
      <div className="hidden">
      <DocumentTemplate dataInical={data} dataFinal={dataFim} ccustos={arrayCcustos.filter(item=>item.check)} somaValor={somaValor} tag={arrayTags} caixa={arrayCaixa} ref={current}/>
      </div>
   
    </>
  );
}
