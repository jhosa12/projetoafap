import { api } from "@/lib/axios/apiClient"
import { MdDelete, MdModeEditOutline, MdSaveAlt } from "react-icons/md"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { GiExpense } from "react-icons/gi";
import { Badge } from "flowbite-react";
import { IoCheckmarkDoneCircleSharp, IoSearch } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { FaRepeat } from "react-icons/fa6";
import { ModalNovaConta } from "./modalNovaConta";
import { PlanoContasProps } from "@/pages/dashboard/financeiro";
import { ModalRecPag } from "./modalRecPag";
import { Button } from "@/components/ui/button";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { toast } from "sonner";

export interface ContaProps {
    id_conta: number,
    dataprev: Date,
    dataLanc: Date,
    datapag: Date,
    dataReag: Date,
    tipo: string,
    status: string,
    descricao: string,
    valor: number,
    parcela: number,
    id_grupo: number,
    descricao_grupo: string,
    conta: string,
    descricao_conta: string
    tipo_conta: string
  }

  interface TotalProps{
    pagar:number,
    receber:number,
    reagendados:number
  }


  interface DataProps{
    planodeContas: Array<PlanoContasProps>
  }


export function ContasPagarReceber({planodeContas}:DataProps){
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [listaContas, setListaContas] = useState<Array<Partial<ContaProps>>>([])
    const [dadosConta, setDadosConta] = useState<Partial<ContaProps>>({})
    const [abertoFinalizado, setAbertoFinalizado] = useState<boolean>(true)
    const [modalAdd, setModalAdd] = useState(false)
    const [excluir, setExcluir] = useState<boolean>(false)
    const [transacao,setTransacao] = useState<boolean>(false)
    const [total,setTotal] =  useState<TotalProps>({pagar:0,reagendados:0,receber:0})




    async function listarContasReq() {
        setLoading(true)
        const response = await api.post('/conta/listarContas', {
          dataInicial: startDate,
          dataFinal: endDate,
          status:abertoFinalizado?'ABERTO':'FINALIZADO'

        })
      
        setListaContas(response.data)
        const totais = response?.data?.reduce((acc:TotalProps,at:ContaProps)=>{
            if(at.tipo==='PAGAR'){
                acc.pagar+=Number(at.valor)
            }
            if(at.tipo==='RECEBER'){
                acc.receber+=Number(at.valor)
            }
            if(new Date(at.dataprev).toLocaleDateString('pt-BR')!==new Date(at.dataReag).toLocaleDateString('pt-BR')){
                acc.reagendados+=1
            }

            return acc

        },{pagar:0,reagendados:0,receber:0} as TotalProps)
setTotal(totais)
        setLoading(false)
      }
    
    
  
    



    async function contaDelete() {
      toast.promise(
            api.delete('/conta/deletar', {
              data: {
                id_conta: dadosConta.id_conta
      
              }
      
            }),
            {
              error: 'Erro ao Deletar',
              loading: 'Deletando Dados...',
              success:()=> {
                const index = listaContas.findIndex(item=>item.id_conta===dadosConta.id_conta)
                const novoArray = [...listaContas]
                novoArray.splice(index,1);
                setListaContas(novoArray)
                
                return 'Dados Deletados com sucesso'}
            }
          )
          
      
        }

    async function contasReq() {
      
           toast.promise(
            api.post('/conta/adicionar', {
              dataLanc: new Date(),
              dataprev: dadosConta.dataprev,
              descricao: dadosConta.descricao,
              tipo: dadosConta.tipo,
              valor: dadosConta.valor,
              parcelas: dadosConta.parcela
      
            }),
            {
              error: 'Erro ao realizar requisição',
              loading: 'Salvando Dados...',
              success:()=>{ 
                listarContasReq()
                return 'Dados salvos com sucesso'}
            }
          )
        
      }


      const handleEditarConta  =async ()=>{
                toast.promise(
                        api.put('conta/editar',{
                            id_conta:dadosConta.id_conta,
                            dataprev:dadosConta.dataprev,
                            descricao:dadosConta.descricao,
                            tipo:dadosConta.tipo,
                            valor:dadosConta.valor,
                        }),
                        {
                            error:'Erro ao atualizar dados',
                            loading:'Atualizando dados..',
                            success:'Dados Atualizados com sucesso'
                        }
                    )
             
      }


    return(

        <>
        <ModalNovaConta handleEditarConta={handleEditarConta}  contasReq={contasReq} dadosConta={dadosConta ??{}} openModal={modalAdd} setDadosConta={setDadosConta} setOpenModal={setModalAdd}/>


     
        <ModalConfirmar
        handleConfirmar={contaDelete}
        openModal={excluir}
        setOpenModal={()=>setExcluir(false)}
        pergunta="Tem certeza que deseja excluir essa conta?"
        />
        
        <ModalRecPag dadosConta={dadosConta} openModal={transacao} planoContas={planodeContas} setOpen={setTransacao}/>
         <div className="flex flex-col px-2  gap-2 w-full overflow-y-auto h-[calc(100vh-120px)] text-black rounded-lg ">
            <div className="flex flex-row gap-10 text-sm w-full px-2 justify-between  " id="Area Resumo/Filtro">
              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-gray-50 text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col font-semibold " >TOTAL A PAGAR <span>{Number(total.pagar).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>

              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-gray-50 text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col font-semibold" >TOTAL A RECEBER <span>{Number(total.receber).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>

              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-gray-50 text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col font-semibold" >REAGENDADOS<span>{Number(total.reagendados)}</span></h2>
              </div>


            </div>

            <div className="flex  w-full bg-white px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-200 border p-1 rounded-sm border-gray-200" >FILTROS</label>
              <div className="inline-flex  items-center  gap-3">
                <div className="flex items-center ">
                  <input type="checkbox" checked={abertoFinalizado} onChange={() => { setAbertoFinalizado(!abertoFinalizado) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-200 border-gray-300" />
                  <label className="ms-2  text-xs whitespace-nowrap ">ABERTO</label>
                </div>
                <div className="flex items-center  ">
                  <input type="checkbox" checked={!abertoFinalizado} onChange={() => { setAbertoFinalizado(!abertoFinalizado) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-200 border-gray-300" />
                  <label className="ms-2  text-xs whitespace-nowrap ">FINALIZADO</label>
                </div>
                <DatePicker
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="flex py-1.5 pl-2 text-xs  border rounded-lg   bg-gray-200 border-gray-300  "
                />
                <span>até</span>

                <DatePicker
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={endDate}
                  onChange={(date) => date && setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className=" flex py-1.5 pl-2 text-xs  border rounded-lg  bg-gray-200 border-gray-300   "
                />
  <Button size={'sm'} variant={'outline'} onClick={() => listarContasReq()}>BUSCAR<IoSearch size={18} /></Button>
              </div>
              
              
              
              <Button variant={'outline'} size={'sm'} onClick={() => setModalAdd(true)} ><IoIosAddCircle className="mr-1 h-5 w-5" /> NOVO</Button>
            </div>
          



            {/*excluir === 2 && (<div id="Lançar conta no caixa" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="flex items-center justify-center p-2 w-full h-full">
                <div className="relative rounded-lg shadow bg-gray-800">
                  <button type="button" onClick={() => setExcluir(0)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:" >
                    <button type="button" onClick={() => setExcluir(0)} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:" >
                      <IoIosClose size={30} />
                    </button>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <div className="flex w-full justify-center items-center">
                      <TbAlertTriangle className='text-gray-400' size={60} />
                    </div>
                    <h3 className="mb-5 text-lg font-normal  text-gray-400">{dadosConta.status==='FINALIZADO'?'SELECIONE OS DETALHES DO LANÇAMENTO':'REALMENTE DESEJA REALIZAR O ESTORNO ?'}</h3>
                   {dadosConta.status ==='FINALIZADO' && <div className="flex flex-col w-full gap-3 mb-2">


                      <select defaultValue={dadosConta.id_grupo} onChange={e => {
                        const item = grupos?.find(item => item.id_grupo === Number(e.target.value))

                        setarDadosConta({ ...dadosConta, id_grupo: Number(item?.id_grupo), descricao_grupo: item?.descricao })
                      }

                      } className="block  pt-1 pb-1.5 w-full pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500">
                        <option value={''}>SETOR</option>
                        {grupos?.map((item, index) => (
                          <option key={index} value={item.id_grupo}>{item.descricao}</option>

                        ))
                        }


                      </select>

                      <select defaultValue={dadosConta.descricao_conta} onChange={e => {
                        const item = arraygeral.find(item => item.conta === e.target.value)
                        setarDadosConta({ ...dadosConta, conta: item?.conta, descricao_conta: item?.descricao, tipo_conta: item?.tipo })
                      }} className="block  pt-1 pb-1.5 w-full pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500">
                        <option value={''}>PLANO DE CONTA</option>
                        {arraygeral?.map((item, index) => (
                          <option key={index} value={item.conta}>{item.descricao}</option>
                        ))}
                      </select>


                    </div>}


                    <button onClick={() => lancarMovimentacao()} data-modal-hide="popup-modal" type="button" className=" bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                      {dadosConta.status==='FINALIZADO'?'LANÇAR':'Sim, tenho certeza'}
                    </button>
                    <button onClick={() => setExcluir(0)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover: hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                  </div>
                </div>
              </div>
            </div>)*/}

            <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)]  bg-white rounded-lg ">
              <ul className="flex flex-col w-full p-2 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center font-semibold">
                    <div className="flex w-full gap-8  items-center">
                      <span className="flex w-full ">DESCRIÇÃO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">TIPO</span>
                      <span className="flex w-full text-start whitespace-nowrap">VALOR</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA PREVISTA</span>
                      <span className="flex w-full text-start whitespace-nowrap ">REAGENDADO PARA</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA PAG.</span>
                      <span className="flex w-full text-start whitespace-nowrap ">STATUS</span>
                      <span className="flex w-full text-start whitespace-nowrap justify-end "></span>
                    </div>
                  </div>
                </li>
                {
                  listaContas?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full font-semibold">{item.descricao}</span>

                            <span className="inline-flex w-full text-start whitespace-nowrap">{item.tipo==='PAGAR'?<Badge size={'sm'} color={'success'}>PAGAR</Badge>:<Badge size={'sm'} color={'info'}>RECEBER</Badge>}</span>

                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>

                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.dataprev && new Date(item.dataprev).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>

                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.dataReag && new Date(item.dataReag).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>


                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.datapag && new Date(item.datapag).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>

                            <span className="inline-flex w-full text-start whitespace-nowrap">{item.status==='ABERTO'?<Badge size={'sm'} color={'yellow'}>ABERTO</Badge>:<Badge size={'sm'} color={'green'}>FINALIZADO</Badge>}</span>
                            <div className="inline-flex w-full gap-4 text-start justify-end whitespace-nowrap">
                              <button onClick={() => { setDadosConta({ id_conta: item.id_conta }), setExcluir(true) }} className="rounded-lg text-gray-500 hover:text-red-500 "><MdDelete size={19} /></button>
                              <button onClick={()=>{
                                setDadosConta({
                                    ...dadosConta,
                                    dataLanc: item.dataLanc,
                                    descricao: item.descricao,
                                    tipo: item.tipo,
                                    status: 'ABERTO',
                                    valor: item.valor,
                                    id_conta: item.id_conta,
                                    dataprev: item.dataprev,
                                    dataReag: item.dataReag
                                  });
                                  setModalAdd(true)  
                              }} className="rounded-lg text-gray-500 hover:text-blue-500 "><MdModeEditOutline size={19} /></button>
                              {item.status === 'FINALIZADO' ? <button onClick={() => {
                                setDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'ABERTO',
                                  valor: item.valor,
                                  id_conta: item.id_conta,
                                  dataprev: item.dataprev,
                                  dataReag: item.dataReag
                                });
                             
                              

                              }}
                                className="rounded-lg text-gray-500 hover:text-yellow-500">
                                <FaRepeat size={16} />
                              </button> :
                               <button onClick={() => {
                                setDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'FINALIZADO',
                                  valor: item.valor,
                                  id_conta: item.id_conta,
                                  dataprev: item.dataprev,
                                  dataReag: item.dataReag
                                })
                                setTransacao(true)
                              }
                              
                            }
                                className="rounded-lg text-gray-500 hover:text-green-500">
                                <IoCheckmarkDoneCircleSharp size={19} />
                              </button>}
                            </div>

                          </div>
                        </div>

                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

      


          </>

    )
}